import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:webview_flutter_wkwebview/webview_flutter_wkwebview.dart';
import 'package:http/http.dart' as http;
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/app_config.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'settings_screen.dart';
import 'chrome_history_screen.dart';
import 'chrome_downloads_screen.dart';
import 'chrome_recent_tabs_screen.dart';
import 'chrome_clear_data_dialog.dart';
import 'chrome_bookmarks_screen.dart';
import 'chrome_share_sheet.dart';
import 'chrome_add_shortcut_dialog.dart';
import 'chrome_help_article_screen.dart';

class BrowserTab {
  final String id;
  String title;
  String url;
  final WebViewController controller;
  bool isDesktopMode;
  bool isIncognito;

  BrowserTab({
    required this.id,
    required this.title,
    required this.url,
    required this.controller,
    this.isDesktopMode = false,
    this.isIncognito = false,
  });
}

class BrowserScreen extends StatefulWidget {
  final AppConfig config;
  final bool isFirebaseInitialized;
  final Function(AppConfig) onConfigSaved;

  const BrowserScreen({
    Key? key,
    required this.config,
    required this.isFirebaseInitialized,
    required this.onConfigSaved,
  }) : super(key: key);

  @override
  _BrowserScreenState createState() => _BrowserScreenState();
}

class _BrowserScreenState extends State<BrowserScreen> {
  final List<BrowserTab> _tabs = [];
  int _currentTabIndex = 0;
  final List<ChromeHistoryItem> _browsingHistory = [];
  final List<Map<String, String>> _bookmarks = [];
  
  final TextEditingController _urlController = TextEditingController(text: 'https://google.com');
  final FocusNode _urlFocusNode = FocusNode();
  final TextEditingController _inPageSearchCtrl = TextEditingController();
  bool _isSearchingInPage = false;
  bool _isStealthMode = false;
  bool _isLoading = false;
  int _loadingProgress = 100;
  
  // Posición del botón circular flotante
  double _btnRight = 20;
  double _btnBottom = 20;
  
  @override
  void initState() {
    super.initState();
    _loadBrowsingHistory();
    _loadBookmarks();
    _urlFocusNode.addListener(() {
      setState(() {});
      if (_urlFocusNode.hasFocus) {
        _urlController.selection = TextSelection(
          baseOffset: 0,
          extentOffset: _urlController.text.length,
        );
      }
    });
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Color(0xFF1F1F1F),
        statusBarIconBrightness: Brightness.light,
        systemNavigationBarColor: Color(0xFF1F1F1F),
        systemNavigationBarIconBrightness: Brightness.light,
      ),
    );
    _addNewTab('https://google.com');
  }

  Future<void> _loadBrowsingHistory() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final historyRaw = prefs.getStringList('chrome_browsing_history');
      if (historyRaw != null && historyRaw.isNotEmpty) {
        _browsingHistory.clear();
        for (final itemStr in historyRaw) {
          try {
            final map = jsonDecode(itemStr) as Map<String, dynamic>;
            _browsingHistory.add(ChromeHistoryItem.fromJson(map));
          } catch (_) {}
        }
        if (mounted) setState(() {});
      } else {
        _seedInitialHistory();
      }
    } catch (e) {
      print('Error cargando historial: $e');
    }
  }

  void _seedInitialHistory() {
    final now = DateTime.now();
    final yesterday = now.subtract(const Duration(days: 1));
    _browsingHistory.addAll([
      ChromeHistoryItem(
        title: 'Examen de Reglas MTC Perú - Simulacro Oficial',
        url: 'https://sierdgtt.mtc.gob.pe/',
        timestamp: now.subtract(const Duration(minutes: 15)),
      ),
      ChromeHistoryItem(
        title: 'MTC Simulacro de Examen de Conocimientos',
        url: 'https://mtc.dhs.pe/evaluacion',
        timestamp: now.subtract(const Duration(hours: 1)),
      ),
      ChromeHistoryItem(
        title: 'Google',
        url: 'https://www.google.com',
        timestamp: now.subtract(const Duration(hours: 3)),
      ),
      ChromeHistoryItem(
        title: 'Balotario de Preguntas para Licencia de Conducir Clase A',
        url: 'https://portal.mtc.gob.pe/transportes/terrestre/licencias/balotario.html',
        timestamp: yesterday.subtract(const Duration(hours: 2)),
      ),
      ChromeHistoryItem(
        title: 'Reglamento Nacional de Tránsito TUO DS 016-2009-MTC',
        url: 'https://transparencia.mtc.gob.pe/normas_transito',
        timestamp: yesterday.subtract(const Duration(hours: 5)),
      ),
    ]);
    _saveBrowsingHistory();
  }

  Future<void> _saveBrowsingHistory() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final list = _browsingHistory.map((item) => jsonEncode(item.toJson())).toList();
      await prefs.setStringList('chrome_browsing_history', list);
    } catch (e) {
      print('Error guardando historial: $e');
    }
  }

  @override
  void dispose() {
    _urlFocusNode.dispose();
    _urlController.dispose();
    _inPageSearchCtrl.dispose();
    super.dispose();
  }

  void _addNewTab([String url = 'https://google.com', bool isIncognito = false]) {
    final id = DateTime.now().millisecondsSinceEpoch.toString();
    final WebViewController controller = WebViewController();
    
    controller.setJavaScriptMode(JavaScriptMode.unrestricted);
    
    // Configurar User-Agent personalizado para evitar error 403: disallowed_useragent en Google Login
    final platform = defaultTargetPlatform;
    if (platform == TargetPlatform.iOS) {
      controller.setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1");
    } else {
      controller.setUserAgent("Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36");
    }
    
    // Habilitar gestos de navegación atrás/adelante en iOS
    if (controller.platform is WebKitWebViewController) {
      (controller.platform as WebKitWebViewController)
          .setAllowsBackForwardNavigationGestures(true);
    }

    controller.setNavigationDelegate(
      NavigationDelegate(
        onProgress: (int progress) {
          final index = _tabs.indexWhere((t) => t.id == id);
          if (index == _currentTabIndex) {
            setState(() {
              _loadingProgress = progress;
            });
          }
        },
        onPageStarted: (String pageUrl) {
          setState(() {
            final index = _tabs.indexWhere((t) => t.id == id);
            if (index != -1) {
              _tabs[index].url = pageUrl;
              if (index == _currentTabIndex) {
                if (!_urlFocusNode.hasFocus) {
                  _urlController.text = pageUrl;
                }
                _loadingProgress = 20;
              }
            }
          });
        },
        onPageFinished: (String pageUrl) async {
          String? title;
          try {
            title = await controller.getTitle();
          } catch (_) {}
          
          final cleanTitle = (title == null || title.trim().isEmpty) ? pageUrl : title;
          
          // Track browsing history (solo si no es incógnito)
          if (!isIncognito && cleanTitle != 'Nueva pestaña' && cleanTitle.trim().isNotEmpty && pageUrl.trim().isNotEmpty && !pageUrl.startsWith('about:')) {
            if (_browsingHistory.isEmpty || _browsingHistory.first.url != pageUrl) {
              _browsingHistory.insert(0, ChromeHistoryItem(
                title: cleanTitle,
                url: pageUrl,
                timestamp: DateTime.now(),
              ));
              if (_browsingHistory.length > 200) {
                _browsingHistory.removeLast();
              }
              _saveBrowsingHistory();
            }
          }

          setState(() {
            final index = _tabs.indexWhere((t) => t.id == id);
            if (index != -1) {
              _tabs[index].url = pageUrl;
              _tabs[index].title = cleanTitle;
              if (index == _currentTabIndex) {
                if (!_urlFocusNode.hasFocus) {
                  _urlController.text = pageUrl;
                }
                _loadingProgress = 100;
              }
            }
          });
        },
      ),
    );
      
    controller.loadRequest(Uri.parse(url));

    setState(() {
      _tabs.add(BrowserTab(
        id: id,
        title: isIncognito ? 'Pestaña de incógnito' : 'Nueva pestaña',
        url: url,
        controller: controller,
        isDesktopMode: false,
        isIncognito: isIncognito,
      ));
      _currentTabIndex = _tabs.length - 1;
      _urlController.text = url;
    });
  }

  void _closeTab(int index) {
    setState(() {
      if (_tabs.length == 1) {
        _tabs[0].controller.loadRequest(Uri.parse('https://google.com'));
        _tabs[0].title = 'Google';
        _tabs[0].url = 'https://google.com';
        _urlController.text = 'https://google.com';
        return;
      }
      
      _tabs.removeAt(index);
      
      if (_currentTabIndex >= _tabs.length) {
        _currentTabIndex = _tabs.length - 1;
      } else if (_currentTabIndex == index) {
        if (_currentTabIndex > 0) {
          _currentTabIndex--;
        }
      }
      _urlController.text = _tabs[_currentTabIndex].url;
    });
  }

  void _selectTab(int index) {
    setState(() {
      _currentTabIndex = index;
      _urlController.text = _tabs[index].url;
      _loadingProgress = 100;
    });
  }

  void _loadUrl() {
    String input = _urlController.text.trim();
    if (input.isEmpty) return;

    String finalUrl;
    if (input.startsWith('http://') || input.startsWith('https://')) {
      finalUrl = input;
    } else {
      // Detección inteligente estilo Google Chrome:
      // Si no contiene espacios y cumple estructura de dominio/subdominio, se carga como web.
      // De lo contrario (ej. "hola", "examen mtc", etc.), se busca automáticamente en Google.
      final hasDomainPattern = !input.contains(' ') && 
          RegExp(r'^[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]+)+(/[^\s]*)?$').hasMatch(input);

      if (hasDomainPattern) {
        finalUrl = 'https://$input';
      } else {
        finalUrl = 'https://www.google.com/search?q=${Uri.encodeQueryComponent(input)}';
      }
    }

    _tabs[_currentTabIndex].controller.loadRequest(Uri.parse(finalUrl));
    FocusScope.of(context).unfocus();
  }

  // Raspado del cuestionario e invocación a la API (Backend o Gemini)
  Future<void> _solveQuestionnaire() async {
    final hasBackend = widget.config.backendUrl.trim().isNotEmpty;
    final hasUserId = widget.config.userId.trim().isNotEmpty;
    final hasGeminiKey = widget.config.geminiApiKey.trim().isNotEmpty;

    if (!hasBackend && !hasGeminiKey) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Por favor, configura tu cuenta/servidor o ingresa tu API Key en Configuración.'),
          backgroundColor: Colors.amber,
        ),
      );
      return;
    }

    if (hasBackend && !hasUserId && !hasGeminiKey) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Por favor, ingresa tu ID de Cliente en Configuración.'),
          backgroundColor: Colors.amber,
        ),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      // Inyectar script para extraer pregunta y opciones
      const jsScript = '''
        (function() {
          var radioInputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
          var questionText = '';
          var options = [];
          
          if (radioInputs.length > 0) {
            var name = radioInputs[0].name || radioInputs[0].id;
            var inputs = document.querySelectorAll('input[type="radio"]');
            var matchingInputs = Array.from(inputs).filter(function(i) {
              return i.name === name || i.id === name;
            });
            if (matchingInputs.length === 0) matchingInputs = radioInputs;
            
            var container = radioInputs[0].closest('fieldset, .question, .question-card, [class*="question"], [class*="cuestion"]') || 
                            radioInputs[0].parentElement?.parentElement;
            
            if (container) {
              questionText = container.innerText || container.textContent || '';
            }
            
            matchingInputs.forEach(function(input, index) {
              var label = document.querySelector('label[for="' + input.id + '"]') || input.closest('label');
              if (label) {
                var txt = (label.innerText || label.textContent || '').trim();
                if (txt) {
                  options.push(txt);
                  questionText = questionText.replace(txt, '');
                }
              }
            });
            
            questionText = questionText.trim().replace(/^[A-Za-z0-9]+\\.\\s+/, '').replace(/\\s+/g, ' ');
          }
          
          if (options.length === 0) {
            var allElements = document.querySelectorAll('div, button, span, li, p, label');
            var matchesByLetter = {A: [], B: [], C: [], D: [], E: [], F: []};
            var letterPatterns = [
              /^\\s*A[\\.\\)]\\s+/i,
              /^\\s*B[\\.\\)]\\s+/i,
              /^\\s*C[\\.\\)]\\s+/i,
              /^\\s*D[\\.\\)]\\s+/i,
              /^\\s*E[\\.\\)]\\s+/i,
              /^\\s*F[\\.\\)]\\s+/i
            ];
            
            allElements.forEach(function(el) {
              if (el.children.length > 2) return;
              var text = (el.innerText || el.textContent || '').trim();
              if (!text) return;
              
              if (letterPatterns[0].test(text)) matchesByLetter.A.push({el: el, text: text});
              else if (letterPatterns[1].test(text)) matchesByLetter.B.push({el: el, text: text});
              else if (letterPatterns[2].test(text)) matchesByLetter.C.push({el: el, text: text});
              else if (letterPatterns[3].test(text)) matchesByLetter.D.push({el: el, text: text});
              else if (letterPatterns[4].test(text)) matchesByLetter.E.push({el: el, text: text});
              else if (letterPatterns[5].test(text)) matchesByLetter.F.push({el: el, text: text});
            });
            
            if (matchesByLetter.A.length > 0 && matchesByLetter.B.length > 0) {
              var candidateA = matchesByLetter.A[0];
              var candidateB = matchesByLetter.B[0];
              var candidateC = matchesByLetter.C.length > 0 ? matchesByLetter.C[0] : null;
              var candidateD = matchesByLetter.D.length > 0 ? matchesByLetter.D[0] : null;
              var candidateE = matchesByLetter.E.length > 0 ? matchesByLetter.E[0] : null;
              var candidateF = matchesByLetter.F.length > 0 ? matchesByLetter.F[0] : null;
              
              options.push(candidateA.text);
              options.push(candidateB.text);
              if (candidateC) options.push(candidateC.text);
              if (candidateD) options.push(candidateD.text);
              if (candidateE) options.push(candidateE.text);
              if (candidateF) options.push(candidateF.text);
              
              var parent = candidateA.el.parentElement;
              while (parent && parent !== document.body) {
                if (parent.contains(candidateB.el)) {
                  break;
                }
                parent = parent.parentElement;
              }
              
              if (parent) {
                var parentText = parent.innerText || parent.textContent || '';
                options.forEach(function(opt) {
                  parentText = parentText.replace(opt, '');
                });
                questionText = parentText.trim().replace(/\\s+/g, ' ');
              }
            }
          }
          
          if (questionText.length < 5) {
            questionText = document.body.innerText || '';
            questionText = questionText.trim().substring(0, 1000);
          }
          
          return JSON.stringify({
            question: questionText,
            options: options
          });
        })()
      ''';

      final result = await _tabs[_currentTabIndex].controller.runJavaScriptReturningResult(jsScript);
      
      // Decodificar el resultado de JS (en Android a veces viene entre comillas extras)
      String cleanResult = result.toString();
      if (cleanResult.startsWith('"') && cleanResult.endsWith('"')) {
        cleanResult = cleanResult.substring(1, cleanResult.length - 1);
        cleanResult = cleanResult.replaceAll('\\"', '"').replaceAll('\\\\', '\\');
      }

      final Map<String, dynamic> data = jsonDecode(cleanResult);
      final String question = data['question'] ?? '';
      final List<String> options = List<String>.from(data['options'] ?? []);

      if (question.length < 5) {
        throw Exception('No se detectó suficiente contenido para formular una pregunta.');
      }

      // Llamar a Gemini
      final responseData = await _queryGemini(question, options);

      // Mostrar el bottom sheet con la respuesta
      _showAnswerBottomSheet(question, options, responseData);

      // Sincronizar en la nube
      if (widget.isFirebaseInitialized) {
        _syncToFirestore(question, options, responseData);
      }

    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error al resolver: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  // Petición a la API (Backend Gateway o Gemini directo)
  Future<Map<String, dynamic>> _queryGemini(String question, List<String> options) async {
    final backendUrl = widget.config.backendUrl.trim();
    final userId = widget.config.userId.trim();

    // Determinar system prompt inteligente (con detección MTC y alta precisión)
    String systemPrompt = widget.config.systemPrompt.trim();
    if (systemPrompt.isEmpty) {
      final isMtc = RegExp(
        r'mtc|tr[áa]nsito|conductor|licencia|brevete|veh[íi]culo|carril|calzada|acera|berma|velocidad|sem[áa]foro|infracci[óo]n|papeleta|adelantamiento|preferencia|estacionar|remolque|soat|citv|inspecci[óo]n|v[íi]a|intersecci[óo]n',
        caseSensitive: false,
      ).hasMatch('$question ${options.join(' ')}');
      if (isMtc) {
        systemPrompt = 'Eres el evaluador oficial y perito experto del examen de reglas de tránsito del MTC (Ministerio de Transportes y Comunicaciones del Perú). Tu objetivo es responder con 100% de precisión y exactitud jurídica basándote estrictamente en el TUO del Reglamento Nacional de Tránsito (D.S. N° 016-2009-MTC y sus modificatorias como D.S. N° 025-2021-MTC sobre límites de velocidad de 30 km/h en calles/jirones y 50 km/h en avenidas) y el Balotario Oficial de Preguntas del MTC. Responde de forma rigurosa seleccionando la alternativa oficial correcta.';
      } else {
        systemPrompt = 'Actúa como un experto académico de alto nivel y responde con precisión y el 100% de tasa de acierto.';
      }
    }

    if (backendUrl.isNotEmpty) {
      String urlStr = backendUrl;
      if (!urlStr.endsWith('/solve')) {
        urlStr = urlStr.endsWith('/') ? '${urlStr}solve' : '$urlStr/solve';
      }

      try {
        final response = await http.post(
          Uri.parse(urlStr),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'userId': userId,
            'question': question,
            'options': options,
            'systemPrompt': systemPrompt,
          }),
        ).timeout(const Duration(seconds: 25));

        if (response.statusCode == 200) {
          final data = jsonDecode(utf8.decode(response.bodyBytes));
          return data;
        } else {
          String errorMsg = 'Error en el servidor backend';
          try {
            final errBody = jsonDecode(utf8.decode(response.bodyBytes));
            errorMsg = errBody['error'] ?? errorMsg;
          } catch (_) {}
          throw Exception('$errorMsg (Código ${response.statusCode})');
        }
      } catch (e) {
        if (widget.config.geminiApiKey.isEmpty) {
          rethrow;
        }
        // Si falla el backend pero tenemos API key local, podemos intentar localmente
        print('Error en backend, reintentando localmente: $e');
      }
    }

    // Código original de Gemini directo
    final apiKey = widget.config.geminiApiKey;
    if (apiKey.isEmpty) {
      throw Exception('Por favor configura la API Key de Gemini o el Servidor Backend.');
    }

    final models = [
      'gemini-2.5-flash-lite',
      'gemini-2.5-flash',
      'gemini-3.1-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-2.0-flash',
      'gemini-flash-latest',
    ];

    String prompt = '';
    if (options.isNotEmpty) {
      prompt = '''
Selecciona la opción correcta.
Pregunta: "$question"
Opciones:
${options.asMap().entries.map((e) => '${e.key}) ${e.value}').join('\n')}

Responde estrictamente en formato JSON:
{
  "correct_option_index": int_indice_comenzando_en_0,
  "correct_option_text": "texto exacto de la opcion",
  "explanation": "explicación max 5 palabras",
  "subject": "disciplina 1 palabra"
}
''';
    } else {
      prompt = '''
Identifica la mejor respuesta.
Contenido: "$question"

Responde estrictamente en formato JSON:
{
  "correct_option_index": -1,
  "correct_option_text": "respuesta sintetizada",
  "explanation": "explicación max 5 palabras",
  "subject": "disciplina 1 palabra"
}
''';
    }

    final requestBody = {
      'contents': [
        {
          'parts': [
            {'text': prompt}
          ]
        }
      ],
      'systemInstruction': {
        'parts': [
          {'text': systemPrompt}
        ]
      },
      'generationConfig': {
        'temperature': 0.0,
        'responseMimeType': 'application/json',
        'responseSchema': {
          'type': 'OBJECT',
          'properties': {
            'correct_option_index': {'type': 'INTEGER'},
            'correct_option_text': {'type': 'STRING'},
            'explanation': {'type': 'STRING'},
            'subject': {'type': 'STRING'}
          },
          'required': ['correct_option_index', 'correct_option_text', 'explanation', 'subject']
        }
      }
    };

    http.Response? lastResponse;
    String? lastError;

    for (final model in models) {
      final url = Uri.parse(
          'https://generativelanguage.googleapis.com/v1beta/models/$model:generateContent?key=$apiKey');
      try {
        final response = await http.post(
          url,
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode(requestBody),
        ).timeout(const Duration(seconds: 10));

        if (response.statusCode == 200) {
          final data = jsonDecode(utf8.decode(response.bodyBytes));
          final String resultText = data['candidates']?[0]?['content']?['parts']?[0]?['text'] ?? '';
          if (resultText.isNotEmpty) {
            return jsonDecode(resultText.trim());
          }
        } else {
          lastResponse = response;
          lastError = 'HTTP ${response.statusCode}: ${response.body}';
        }
      } catch (e) {
        lastError = e.toString();
      }
    }

    if (lastResponse != null) {
      throw Exception('API Gemini falló (código ${lastResponse.statusCode}).');
    } else {
      throw Exception('Error al conectar con la API de Gemini: $lastError');
    }
  }

  // Guardar en Firestore
  void _syncToFirestore(String question, List<String> options, Map<String, dynamic> resData) async {
    try {
      await FirebaseFirestore.instance.collection('history').add({
        'question': question,
        'options': options,
        'answer': resData['correct_option_text'],
        'answerIndex': resData['correct_option_index'],
        'explanation': resData['explanation'],
        'subject': resData['subject'] ?? 'General',
        'timestamp': FieldValue.serverTimestamp(),
        'source': 'mobile_app',
      });
    } catch (e) {
      print('Error saving to firestore: $e');
    }
  }

  // Mostrar Bottom Sheet elegante con la respuesta (Modo Desapercibido / Faint Overlay)
  void _showAnswerBottomSheet(String question, List<String> options, Map<String, dynamic> resData) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      barrierColor: Colors.black.withOpacity(0.02),
      builder: (context) {
        final explanation = (resData['explanation'] ?? '').toString();
        final subject = (resData['subject'] ?? 'General').toString();

        return Container(
          decoration: BoxDecoration(
            color: Colors.black.withOpacity(0.65),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
            border: Border.all(
              color: Colors.white.withOpacity(0.04),
              width: 1,
            ),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    subject.toUpperCase(),
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.2),
                      fontSize: 9,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.5,
                    ),
                  ),
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Icon(
                      Icons.close,
                      color: Colors.white.withOpacity(0.15),
                      size: 14,
                    ),
                  )
                ],
              ),
              const SizedBox(height: 6),
              Text(
                'R: ${resData['correct_option_text']}',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.55),
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                ),
              ),
              if (explanation.isNotEmpty && explanation != 'N/A' && explanation != 'none') ...[
                const SizedBox(height: 4),
                Text(
                  explanation,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.35),
                    fontSize: 10.5,
                    height: 1.3,
                  ),
                ),
              ],
              const SizedBox(height: 4),
            ],
          ),
        );
      },
    );
  }

  void _showTabSwitcher() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF202124),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              height: MediaQuery.of(context).size.height * 0.75,
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Pestañas',
                        style: TextStyle(
                          color: Color(0xFFE8EAED),
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.add, color: Color(0xFF8AB4F8), size: 28),
                        onPressed: () {
                          _addNewTab('https://google.com');
                          Navigator.pop(context);
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 15),
                  Expanded(
                    child: GridView.builder(
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                        childAspectRatio: 0.85,
                      ),
                      itemCount: _tabs.length,
                      itemBuilder: (context, index) {
                        final tab = _tabs[index];
                        final isActive = index == _currentTabIndex;
                        return GestureDetector(
                          onTap: () {
                            _selectTab(index);
                            Navigator.pop(context);
                          },
                          child: Container(
                            decoration: BoxDecoration(
                              color: const Color(0xFF282A2D),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: isActive ? const Color(0xFF8AB4F8) : const Color(0xFF3C4043),
                                width: isActive ? 2.0 : 1.0,
                              ),
                            ),
                            padding: const EdgeInsets.all(10),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Expanded(
                                      child: Text(
                                        tab.title,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: TextStyle(
                                          color: isActive ? const Color(0xFF8AB4F8) : const Color(0xFFE8EAED),
                                          fontSize: 13,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                    GestureDetector(
                                      onTap: () {
                                        _closeTab(index);
                                        setModalState(() {});
                                        setState(() {});
                                      },
                                      child: const Icon(
                                        Icons.close,
                                        color: Color(0xFF9AA0A6),
                                        size: 16,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Expanded(
                                  child: Container(
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF1F1F1F),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    padding: const EdgeInsets.all(8),
                                    child: Center(
                                      child: Text(
                                        tab.url,
                                        maxLines: 4,
                                        overflow: TextOverflow.ellipsis,
                                        textAlign: TextAlign.center,
                                        style: const TextStyle(
                                          color: Color(0xFF9AA0A6),
                                          fontSize: 10,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showBrowsingHistory() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (ctx) => ChromeHistoryScreen(
          history: _browsingHistory,
          onSelectUrl: (url) {
            _tabs[_currentTabIndex].controller.loadRequest(Uri.parse(url));
          },
          onDeleteItem: (id) {
            setState(() {
              _browsingHistory.removeWhere((item) => item.id == id);
            });
            _saveBrowsingHistory();
          },
          onClearAll: () {
            setState(() {
              _browsingHistory.clear();
            });
            _saveBrowsingHistory();
          },
        ),
      ),
    );
  }

  Future<void> _loadBookmarks() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final list = prefs.getStringList('chrome_bookmarks_items');
      if (list != null && list.isNotEmpty) {
        _bookmarks.clear();
        for (final s in list) {
          try {
            _bookmarks.add(Map<String, String>.from(jsonDecode(s)));
          } catch (_) {}
        }
      } else {
        _bookmarks.addAll([
          {
            'title': 'Examen de Reglas MTC - Balotario Oficial',
            'url': 'https://portal.mtc.gob.pe/transportes/terrestre/licencias/balotario.html',
          },
          {
            'title': 'Simulacro de Examen Teórico MTC',
            'url': 'https://sierdgtt.mtc.gob.pe/',
          },
          {
            'title': 'Google',
            'url': 'https://www.google.com',
          },
        ]);
        _saveBookmarks();
      }
      if (mounted) setState(() {});
    } catch (_) {}
  }

  Future<void> _saveBookmarks() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final list = _bookmarks.map((e) => jsonEncode(e)).toList();
      await prefs.setStringList('chrome_bookmarks_items', list);
    } catch (_) {}
  }

  bool _isCurrentUrlBookmarked() {
    if (_tabs.isEmpty) return false;
    final currentUrl = _tabs[_currentTabIndex].url;
    return _bookmarks.any((b) => b['url'] == currentUrl);
  }

  void _toggleCurrentBookmark() {
    if (_tabs.isEmpty) return;
    final tab = _tabs[_currentTabIndex];
    final isBookmarked = _isCurrentUrlBookmarked();
    if (isBookmarked) {
      _bookmarks.removeWhere((b) => b['url'] == tab.url);
      _saveBookmarks();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Marcador eliminado'),
          duration: Duration(seconds: 2),
        ),
      );
    } else {
      _bookmarks.insert(0, {
        'title': tab.title.isEmpty ? tab.url : tab.title,
        'url': tab.url,
      });
      _saveBookmarks();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              const Icon(Icons.star_rounded, color: Color(0xFF8AB4F8), size: 18),
              const SizedBox(width: 8),
              Expanded(child: Text('Marcador guardado: ${tab.title}')),
            ],
          ),
          duration: const Duration(seconds: 2),
        ),
      );
    }
    setState(() {});
  }

  void _showBookmarksSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF282A2D),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF5F6368),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Marcadores',
                    style: TextStyle(
                      color: Color(0xFFE8EAED),
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded, color: Color(0xFFC4C7C5)),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              if (_bookmarks.isEmpty)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 36),
                  child: Text(
                    'No tienes marcadores guardados.\nToca la estrella en el menú para agregar marcadores.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 13.5),
                  ),
                )
              else
                Flexible(
                  child: ListView.separated(
                    shrinkWrap: true,
                    itemCount: _bookmarks.length,
                    separatorBuilder: (ctx, i) => const Divider(color: Color(0xFF3C4043), height: 1),
                    itemBuilder: (ctx, i) {
                      final item = _bookmarks[i];
                      return ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: const Icon(Icons.star_rounded, color: Color(0xFF8AB4F8), size: 20),
                        title: Text(
                          item['title'] ?? item['url'] ?? '',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(color: Color(0xFFE8EAED), fontSize: 14),
                        ),
                        subtitle: Text(
                          item['url'] ?? '',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(color: Color(0xFF9AA0A6), fontSize: 12),
                        ),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete_outline_rounded, color: Color(0xFF9AA0A6), size: 18),
                          onPressed: () {
                            setState(() {
                              _bookmarks.removeAt(i);
                              _saveBookmarks();
                            });
                            setModalState(() {});
                          },
                        ),
                        onTap: () {
                          Navigator.pop(ctx);
                          _tabs[_currentTabIndex].controller.loadRequest(Uri.parse(item['url']!));
                        },
                      );
                    },
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  void _showPageInfoDialog() {
    if (_tabs.isEmpty) return;
    final url = _tabs[_currentTabIndex].url;
    final uri = Uri.tryParse(url);
    final host = (uri != null && uri.host.isNotEmpty) ? uri.host : url;
    final isSecure = url.startsWith('https://');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF282A2D),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        titlePadding: const EdgeInsets.fromLTRB(20, 20, 20, 8),
        contentPadding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
        title: Row(
          children: [
            Icon(
              isSecure ? Icons.lock_rounded : Icons.info_outline_rounded,
              color: isSecure ? const Color(0xFF81C995) : const Color(0xFFF28B82),
              size: 22,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                host,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(color: Color(0xFFE8EAED), fontSize: 16, fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              isSecure ? 'La conexión es segura' : 'La conexión no es segura',
              style: TextStyle(
                color: isSecure ? const Color(0xFF81C995) : const Color(0xFFF28B82),
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              isSecure
                  ? 'Tu información (por ejemplo, contraseñas o datos de tarjeta de crédito) es privada cuando se envía a este sitio.'
                  : 'Ten precaución al introducir información confidencial en este sitio.',
              style: const TextStyle(color: Color(0xFF9AA0A6), fontSize: 12.5, height: 1.3),
            ),
            const Divider(color: Color(0xFF3C4043), height: 24),
            const ListTile(
              contentPadding: EdgeInsets.zero,
              leading: Icon(Icons.verified_user_outlined, color: Color(0xFF8AB4F8), size: 20),
              title: Text('Certificado de seguridad', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 13.5)),
              subtitle: Text('Válido (Emitido para el dominio)', style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 11.5)),
            ),
            const ListTile(
              contentPadding: EdgeInsets.zero,
              leading: Icon(Icons.cookie_outlined, color: Color(0xFF8AB4F8), size: 20),
              title: Text('Cookies y datos del sitio', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 13.5)),
              subtitle: Text('Permitidas y en uso para la sesión', style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 11.5)),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cerrar', style: TextStyle(color: Color(0xFF8AB4F8), fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  void _showClearDataModal() {
    showDialog(
      context: context,
      builder: (ctx) => ChromeClearDataDialog(
        onConfirm: ({
          required bool clearHistory,
          required bool clearCookies,
          required bool clearCache,
          required String timeRange,
        }) async {
          if (clearHistory) {
            setState(() {
              _browsingHistory.clear();
            });
            await _saveBrowsingHistory();
          }
          if (clearCache && _tabs.isNotEmpty) {
            try {
              await _tabs[_currentTabIndex].controller.clearCache();
            } catch (_) {}
          }
          if (clearCookies) {
            try {
              await WebViewCookieManager().clearCookies();
            } catch (_) {}
          }
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Se han borrado los datos de navegación seleccionados.'),
                backgroundColor: Color(0xFF1E8E3E),
                duration: Duration(seconds: 2),
              ),
            );
          }
        },
      ),
    );
  }

  void _toggleDesktopMode() async {
    final currentTab = _tabs[_currentTabIndex];
    final newMode = !currentTab.isDesktopMode;
    currentTab.isDesktopMode = newMode;

    if (newMode) {
      await currentTab.controller.setUserAgent(
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      );
    } else {
      final platform = defaultTargetPlatform;
      if (platform == TargetPlatform.iOS) {
        await currentTab.controller.setUserAgent(
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
        );
      } else {
        await currentTab.controller.setUserAgent(
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
        );
      }
    }
    await currentTab.controller.reload();
    setState(() {});
  }

  void _downloadCurrentPage() {
    if (_tabs.isEmpty) return;
    final tab = _tabs[_currentTabIndex];
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.downloading_rounded, color: Color(0xFF8AB4F8), size: 18),
            const SizedBox(width: 10),
            Expanded(child: Text('Descargando "${tab.title}"...')),
          ],
        ),
        action: SnackBarAction(
          label: 'Ver',
          textColor: const Color(0xFF8AB4F8),
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (c) => const ChromeDownloadsScreen()),
            );
          },
        ),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  void _shareCurrentUrl() {
    if (_tabs.isEmpty) return;
    final url = _tabs[_currentTabIndex].url;
    Clipboard.setData(ClipboardData(text: url));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Enlace copiado al portapapeles: $url'),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _translateCurrentPage() {
    if (_tabs.isEmpty) return;
    final url = _tabs[_currentTabIndex].url;
    final translateUrl = 'https://translate.google.com/translate?sl=auto&tl=es&u=${Uri.encodeComponent(url)}';
    _tabs[_currentTabIndex].controller.loadRequest(Uri.parse(translateUrl));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Traduciendo página con Google Traductor...'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  void _toggleReaderMode() {
    if (_tabs.isEmpty) return;
    _tabs[_currentTabIndex].controller.runJavaScript('''
      (function() {
        document.body.style.maxWidth = '700px';
        document.body.style.margin = '0 auto';
        document.body.style.padding = '24px 16px';
        document.body.style.fontFamily = 'sans-serif';
        document.body.style.fontSize = '17px';
        document.body.style.lineHeight = '1.6';
        document.body.style.color = '#E8EAED';
        document.body.style.backgroundColor = '#1F1F1F';
      })();
    ''');
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Modo Lectura activado'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  Widget _buildInPageSearchBar() {
    return Container(
      height: 54,
      color: const Color(0xFF1F1F1F),
      padding: const EdgeInsets.symmetric(horizontal: 14),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _inPageSearchCtrl,
              autofocus: true,
              style: const TextStyle(color: Color(0xFFE8EAED), fontSize: 16),
              cursorColor: const Color(0xFF8AB4F8),
              decoration: const InputDecoration(
                hintText: 'Buscar en la página',
                hintStyle: TextStyle(color: Color(0xFF9AA0A6), fontSize: 16),
                border: InputBorder.none,
                isDense: true,
              ),
              onChanged: (text) {
                if (text.isNotEmpty) {
                  _tabs[_currentTabIndex].controller.runJavaScript("window.find('$text');");
                }
              },
            ),
          ),
          Container(
            width: 1,
            height: 22,
            color: const Color(0xFF3C4043),
            margin: const EdgeInsets.symmetric(horizontal: 6),
          ),
          IconButton(
            icon: const Icon(Icons.keyboard_arrow_up, color: Color(0xFFC4C7C5), size: 24),
            splashRadius: 20,
            onPressed: () {
              final text = _inPageSearchCtrl.text;
              if (text.isNotEmpty) {
                _tabs[_currentTabIndex].controller.runJavaScript("window.find('$text', false, true);");
              }
            },
          ),
          IconButton(
            icon: const Icon(Icons.keyboard_arrow_down, color: Color(0xFFC4C7C5), size: 24),
            splashRadius: 20,
            onPressed: () {
              final text = _inPageSearchCtrl.text;
              if (text.isNotEmpty) {
                _tabs[_currentTabIndex].controller.runJavaScript("window.find('$text', false, false);");
              }
            },
          ),
          IconButton(
            icon: const Icon(Icons.close, color: Color(0xFFC4C7C5), size: 22),
            splashRadius: 20,
            onPressed: () {
              setState(() {
                _isSearchingInPage = false;
                _inPageSearchCtrl.clear();
              });
              _tabs[_currentTabIndex].controller.runJavaScript("window.getSelection().removeAllRanges();");
            },
          ),
        ],
      ),
    );
  }

  Widget _buildChromeMenuItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    Widget? trailing,
  }) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        child: Row(
          children: [
            Icon(icon, color: const Color(0xFFC4C7C5), size: 20),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  color: Color(0xFFE8EAED),
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                ),
              ),
            ),
            if (trailing != null) trailing,
          ],
        ),
      ),
    );
  }

  void _showChromeMenu(BuildContext context) async {
    final currentTab = _tabs[_currentTabIndex];
    final isForwardAvailable = await currentTab.controller.canGoForward();
    final isBookmarked = _isCurrentUrlBookmarked();

    if (!context.mounted) return;

    showGeneralDialog(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'ChromeMenu',
      barrierColor: Colors.black26,
      transitionDuration: const Duration(milliseconds: 180),
      pageBuilder: (ctx, anim1, anim2) {
        return SafeArea(
          child: Align(
            alignment: Alignment.topRight,
            child: Container(
              width: 290,
              margin: const EdgeInsets.only(top: 48, right: 8, bottom: 16),
              constraints: BoxConstraints(
                maxHeight: MediaQuery.of(context).size.height * 0.88,
              ),
              decoration: BoxDecoration(
                color: const Color(0xFF282A2D),
                borderRadius: BorderRadius.circular(16),
                boxShadow: const [
                  BoxShadow(
                    color: Colors.black54,
                    blurRadius: 16,
                    spreadRadius: 2,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: Material(
                color: Colors.transparent,
                child: StatefulBuilder(
                  builder: (ctx, setMenuState) {
                    return Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // 1. Barra superior de iconos horizontales (Forward, Bookmark, Download, Info, Reload)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                          decoration: const BoxDecoration(
                            border: Border(
                              bottom: BorderSide(color: Color(0xFF3C4043), width: 0.8),
                            ),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [
                              // Forward (->)
                              IconButton(
                                icon: Icon(
                                  Icons.arrow_forward_rounded,
                                  color: isForwardAvailable ? const Color(0xFFE8EAED) : const Color(0xFF5F6368),
                                  size: 22,
                                ),
                                splashRadius: 20,
                                onPressed: isForwardAvailable
                                    ? () {
                                        Navigator.pop(ctx);
                                        currentTab.controller.goForward();
                                      }
                                    : null,
                              ),
                              // Bookmark (*)
                              IconButton(
                                icon: Icon(
                                  isBookmarked ? Icons.star_rounded : Icons.star_outline_rounded,
                                  color: isBookmarked ? const Color(0xFF8AB4F8) : const Color(0xFFE8EAED),
                                  size: 22,
                                ),
                                splashRadius: 20,
                                onPressed: () {
                                  Navigator.pop(ctx);
                                  _toggleCurrentBookmark();
                                },
                              ),
                              // Download (v)
                              IconButton(
                                icon: const Icon(
                                  Icons.file_download_outlined,
                                  color: Color(0xFFE8EAED),
                                  size: 22,
                                ),
                                splashRadius: 20,
                                onPressed: () {
                                  Navigator.pop(ctx);
                                  _downloadCurrentPage();
                                },
                              ),
                              // Info ((i))
                              IconButton(
                                icon: const Icon(
                                  Icons.info_outline_rounded,
                                  color: Color(0xFFE8EAED),
                                  size: 22,
                                ),
                                splashRadius: 20,
                                onPressed: () {
                                  Navigator.pop(ctx);
                                  _showPageInfoDialog();
                                },
                              ),
                              // Reload (↻)
                              IconButton(
                                icon: const Icon(
                                  Icons.refresh_rounded,
                                  color: Color(0xFFE8EAED),
                                  size: 22,
                                ),
                                splashRadius: 20,
                                onPressed: () {
                                  Navigator.pop(ctx);
                                  currentTab.controller.reload();
                                },
                              ),
                            ],
                          ),
                        ),

                        // 2. Lista de opciones estilo Chrome exacto
                        Flexible(
                          child: ListView(
                            shrinkWrap: true,
                            padding: const EdgeInsets.symmetric(vertical: 4),
                            children: [
                              _buildChromeMenuItem(
                                icon: Icons.add_box_outlined,
                                title: 'Nueva pestaña',
                                onTap: () {
                                  Navigator.pop(ctx);
                                  _addNewTab('https://google.com');
                                },
                              ),
                              _buildChromeMenuItem(
                                icon: Icons.security_outlined,
                                title: 'Nueva pestaña de incógnito',
                                onTap: () {
                                  Navigator.pop(ctx);
                                  _addNewTab('https://google.com', true);
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Pestaña de incógnito abierta')),
                                  );
                                },
                              ),
                              _buildChromeMenuItem(
                                icon: Icons.tab_outlined,
                                title: 'Añadir pestaña a un grupo...',
                                onTap: () {
                                  Navigator.pop(ctx);
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Pestaña añadida al grupo')),
                                  );
                                },
                              ),
                              _buildChromeMenuItem(
                                icon: Icons.history_rounded,
                                title: 'Historial',
                                onTap: () {
                                  Navigator.pop(ctx);
                                  _showBrowsingHistory();
                                },
                              ),
                              _buildChromeMenuItem(
                                icon: Icons.delete_outline_rounded,
                                title: 'Borrar datos de navegación',
                                onTap: () {
                                  Navigator.pop(ctx);
                                  _showClearDataModal();
                                },
                              ),
                              _buildChromeMenuItem(
                                icon: Icons.download_rounded,
                                title: 'Descargas',
                                onTap: () {
                                  Navigator.pop(ctx);
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(builder: (c) => const ChromeDownloadsScreen()),
                                  );
                                },
                              ),
                              _buildChromeMenuItem(
                                icon: Icons.star_border_rounded,
                                title: 'Marcadores',
                                onTap: () {
                                  Navigator.pop(ctx);
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (c) => ChromeBookmarksScreen(
                                        onSelectUrl: (url) {
                                          _tabs[_currentTabIndex].controller.loadRequest(Uri.parse(url));
                                        },
                                      ),
                                    ),
                                  );
                                },
                              ),
                              _buildChromeMenuItem(
                                icon: Icons.devices_rounded,
                                title: 'Pestañas recientes',
                                onTap: () {
                                  Navigator.pop(ctx);
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (c) => ChromeRecentTabsScreen(
                                        history: _browsingHistory,
                                        onSelectUrl: (url) {
                                          _tabs[_currentTabIndex].controller.loadRequest(Uri.parse(url));
                                        },
                                      ),
                                    ),
                                  );
                                },
                              ),
                              const Divider(color: Color(0xFF3C4043), height: 8),
                              _buildChromeMenuItem(
                                icon: Icons.share_outlined,
                                title: 'Compartir...',
                                onTap: () {
                                  Navigator.pop(ctx);
                                  final tab = _tabs[_currentTabIndex];
                                  ChromeShareSheet.show(
                                    context,
                                    title: tab.title,
                                    url: tab.url,
                                    onFullScreenshot: () {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        const SnackBar(content: Text('Captura de pantalla guardada en Galería')),
                                      );
                                    },
                                    onPrint: () {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        const SnackBar(content: Text('Buscando impresoras disponibles...')),
                                      );
                                    },
                                  );
                                },
                              ),
                              _buildChromeMenuItem(
                                icon: Icons.search_rounded,
                                title: 'Buscar en la página',
                                onTap: () {
                                  Navigator.pop(ctx);
                                  setState(() {
                                    _isSearchingInPage = true;
                                  });
                                },
                              ),
                              _buildChromeMenuItem(
                                icon: Icons.translate_rounded,
                                title: 'Traducir...',
                                onTap: () {
                                  Navigator.pop(ctx);
                                  _translateCurrentPage();
                                },
                              ),
                              _buildChromeMenuItem(
                                icon: Icons.chrome_reader_mode_outlined,
                                title: 'Mostrar modo Lectura',
                                onTap: () {
                                  Navigator.pop(ctx);
                                  _toggleReaderMode();
                                },
                              ),
                              _buildChromeMenuItem(
                                icon: Icons.add_to_home_screen_rounded,
                                title: 'Instalar y crear acceso directo',
                                onTap: () async {
                                  Navigator.pop(ctx);
                                  final tab = _tabs[_currentTabIndex];
                                  final added = await ChromeAddShortcutDialog.show(
                                    context,
                                    title: tab.title,
                                    url: tab.url,
                                  );
                                  if (added == true && mounted) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text('Acceso directo añadido a la pantalla de inicio')),
                                    );
                                  }
                                },
                              ),
                              // Sitio para ordenadores con CHECKBOX funcional
                              InkWell(
                                onTap: () {
                                  _toggleDesktopMode();
                                  setMenuState(() {});
                                },
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                  child: Row(
                                    children: [
                                      const Icon(Icons.desktop_windows_outlined, color: Color(0xFFC4C7C5), size: 20),
                                      const SizedBox(width: 14),
                                      const Expanded(
                                        child: Text(
                                          'Sitio para ordenadores',
                                          style: TextStyle(color: Color(0xFFE8EAED), fontSize: 14),
                                        ),
                                      ),
                                      Checkbox(
                                        value: currentTab.isDesktopMode,
                                        activeColor: const Color(0xFF8AB4F8),
                                        checkColor: const Color(0xFF1F1F1F),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(3)),
                                        onChanged: (val) {
                                          _toggleDesktopMode();
                                          setMenuState(() {});
                                        },
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              const Divider(color: Color(0xFF3C4043), height: 8),
                              _buildChromeMenuItem(
                                icon: Icons.settings_outlined,
                                title: 'Configuración',
                                onTap: () {
                                  Navigator.pop(ctx);
                                  _showPinDialog();
                                },
                              ),
                              _buildChromeMenuItem(
                                icon: Icons.help_outline_rounded,
                                title: 'Ayuda y comentarios',
                                onTap: () {
                                  Navigator.pop(ctx);
                                  _showHelpAndFeedback();
                                },
                              ),
                            ],
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),
            ),
          ),
        );
      },
      transitionBuilder: (ctx, anim1, anim2, child) {
        return FadeTransition(
          opacity: anim1,
          child: ScaleTransition(
            scale: Tween<double>(begin: 0.85, end: 1.0).animate(
              CurvedAnimation(parent: anim1, curve: Curves.easeOutCubic),
            ),
            alignment: Alignment.topRight,
            child: child,
          ),
        );
      },
    );
  }

  void _showHelpAndFeedback() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF202124),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return DraggableScrollableSheet(
          initialChildSize: 0.85,
          minChildSize: 0.5,
          maxChildSize: 0.95,
          expand: false,
          builder: (context, scrollController) {
            return Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: ListView(
                controller: scrollController,
                children: [
                  // Barra de agarre
                  Center(
                    child: Container(
                      width: 36,
                      height: 4,
                      margin: const EdgeInsets.only(bottom: 12),
                      decoration: BoxDecoration(
                        color: const Color(0xFF5F6368),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Ayuda',
                        style: TextStyle(
                          color: Color(0xFFE8EAED),
                          fontSize: 20,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close_rounded, color: Color(0xFFC4C7C5)),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  // Barra de búsqueda oficial Google Help
                  Container(
                    height: 46,
                    decoration: BoxDecoration(
                      color: const Color(0xFF2B2D30),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Row(
                      children: [
                        const Icon(Icons.search_rounded, color: Color(0xFF9AA0A6), size: 20),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            style: const TextStyle(color: Color(0xFFE8EAED), fontSize: 14),
                            decoration: const InputDecoration(
                              hintText: 'Describe el problema',
                              hintStyle: TextStyle(color: Color(0xFF8E918F), fontSize: 14),
                              border: InputBorder.none,
                              isDense: true,
                            ),
                            onSubmitted: (query) {
                              if (query.trim().isNotEmpty) {
                                Navigator.pop(context);
                                _tabs[_currentTabIndex].controller.loadRequest(
                                  Uri.parse('https://support.google.com/chrome/search?q=${Uri.encodeQueryComponent(query.trim())}'),
                                );
                              }
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'Artículos populares',
                    style: TextStyle(
                      color: Color(0xFF9AA0A6),
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  _buildHelpItem(
                    icon: Icons.article_outlined,
                    title: 'Cambiar permisos en la configuración de sitios',
                    url: '',
                    onCustomTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (c) => const ChromeHelpArticleScreen()),
                      );
                    },
                  ),
                  _buildHelpItem(
                    icon: Icons.article_outlined,
                    title: 'Navegar en privado con el modo de incógnito',
                    url: 'https://support.google.com/chrome/answer/95464',
                  ),
                  _buildHelpItem(
                    icon: Icons.article_outlined,
                    title: 'Borrar los datos de navegación en Chrome',
                    url: 'https://support.google.com/chrome/answer/2392709',
                  ),
                  _buildHelpItem(
                    icon: Icons.article_outlined,
                    title: 'Administrar contraseñas guardadas en Google',
                    url: 'https://support.google.com/chrome/answer/95606',
                  ),
                  _buildHelpItem(
                    icon: Icons.article_outlined,
                    title: 'Bloquear o permitir ventanas emergentes',
                    url: 'https://support.google.com/chrome/answer/95472',
                  ),
                  _buildHelpItem(
                    icon: Icons.open_in_new_rounded,
                    title: 'Explorar todos los artículos de ayuda',
                    url: 'https://support.google.com/chrome',
                    isAccent: true,
                  ),
                  const Divider(color: Color(0xFF3C4043), height: 32),
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF2B2D30),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.feedback_outlined, color: Color(0xFF8AB4F8), size: 20),
                    ),
                    title: const Text(
                      'Enviar comentarios',
                      style: TextStyle(color: Color(0xFFE8EAED), fontSize: 14, fontWeight: FontWeight.w500),
                    ),
                    subtitle: const Text(
                      'Describe tus sugerencias o notifica problemas técnicos a Google',
                      style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 12),
                    ),
                    onTap: () {
                      Navigator.pop(context);
                      _showFeedbackDialog();
                    },
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showFeedbackDialog() {
    final TextEditingController feedbackCtrl = TextEditingController();
    bool includeSysLogs = true;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDlgState) => AlertDialog(
          backgroundColor: const Color(0xFF282A2D),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Row(
            children: [
              Icon(Icons.feedback_outlined, color: Color(0xFF8AB4F8), size: 22),
              SizedBox(width: 10),
              Text(
                'Enviar comentarios',
                style: TextStyle(color: Color(0xFFE8EAED), fontSize: 16, fontWeight: FontWeight.w600),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Cuéntanos qué sucedió o qué sugerencia tienes para Chrome:',
                style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 13),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: feedbackCtrl,
                maxLines: 4,
                style: const TextStyle(color: Color(0xFFE8EAED), fontSize: 14),
                decoration: InputDecoration(
                  hintText: 'Describe tus comentarios aquí...',
                  hintStyle: const TextStyle(color: Color(0xFF8E918F), fontSize: 13),
                  filled: true,
                  fillColor: const Color(0xFF1F1F1F),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Checkbox(
                    value: includeSysLogs,
                    activeColor: const Color(0xFF8AB4F8),
                    checkColor: const Color(0xFF1F1F1F),
                    onChanged: (val) {
                      setDlgState(() {
                        includeSysLogs = val ?? true;
                      });
                    },
                  ),
                  const Expanded(
                    child: Text(
                      'Incluir capturas y registros del sistema para diagnóstico',
                      style: TextStyle(color: Color(0xFFC4C7C5), fontSize: 11),
                    ),
                  ),
                ],
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancelar', style: TextStyle(color: Color(0xFF9AA0A6))),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF8AB4F8),
                foregroundColor: const Color(0xFF1F1F1F),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
              ),
              onPressed: () {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Gracias por tus comentarios. Ayudan a mejorar Google Chrome.'),
                    backgroundColor: Color(0xFF1E8E3E),
                  ),
                );
              },
              child: const Text('Enviar'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHelpItem({
    required IconData icon,
    required String title,
    required String url,
    bool isAccent = false,
    VoidCallback? onCustomTap,
  }) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: Icon(icon, color: isAccent ? const Color(0xFF8AB4F8) : const Color(0xFF9AA0A6), size: 20),
      title: Text(
        title,
        style: TextStyle(
          color: isAccent ? const Color(0xFF8AB4F8) : const Color(0xFFE8EAED),
          fontSize: 14,
          fontWeight: isAccent ? FontWeight.w600 : FontWeight.w400,
        ),
      ),
      onTap: () {
        Navigator.pop(context);
        if (onCustomTap != null) {
          onCustomTap();
        } else if (url.isNotEmpty) {
          _tabs[_currentTabIndex].controller.loadRequest(Uri.parse(url));
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;
        final controller = _tabs[_currentTabIndex].controller;
        if (await controller.canGoBack()) {
          await controller.goBack();
        } else {
          if (context.mounted) {
            Navigator.of(context).pop();
          }
        }
      },
      child: Scaffold(
        backgroundColor: const Color(0xFF202124),
        body: SafeArea(
          child: Stack(
            children: [
              Column(
                children: [
                  // Barra de navegación estilo Google Chrome (Material 3 Dark)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 6),
                    decoration: const BoxDecoration(
                      color: Color(0xFF1F1F1F), // Color de la barra de Chrome en modo oscuro
                      border: Border(
                        bottom: BorderSide(
                          color: Color(0xFF282A2D),
                          width: 0.8,
                        ),
                      ),
                    ),
                    child: Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.home_rounded, color: Color(0xFFC4C7C5), size: 24),
                          splashRadius: 20,
                          onPressed: () {
                            _tabs[_currentTabIndex].controller.loadRequest(Uri.parse('https://google.com'));
                          },
                        ),
                        Expanded(
                          child: Container(
                            height: 44, // Altura estándar del omnibox de Chrome
                            margin: const EdgeInsets.symmetric(horizontal: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFF2B2D30), // Fondo exacto del omnibox de Chrome
                              borderRadius: BorderRadius.circular(24),
                            ),
                            child: Row(
                              children: [
                                GestureDetector(
                                  onDoubleTap: () {
                                    setState(() {
                                      _isStealthMode = !_isStealthMode;
                                    });
                                    HapticFeedback.lightImpact();
                                  },
                                  child: const Padding(
                                    padding: EdgeInsets.only(left: 14, right: 8),
                                    child: Icon(Icons.tune_rounded, color: Color(0xFF9AA0A6), size: 17),
                                  ),
                                ),
                                Expanded(
                                  child: TextField(
                                    controller: _urlController,
                                    focusNode: _urlFocusNode,
                                    style: const TextStyle(
                                      color: Color(0xFFE8EAED),
                                      fontSize: 14.5,
                                      fontWeight: FontWeight.w400,
                                      letterSpacing: 0.1,
                                    ),
                                    decoration: const InputDecoration(
                                      hintText: 'Busca o escribe una dirección web',
                                      hintStyle: TextStyle(
                                        color: Color(0xFF8E918F),
                                        fontSize: 14.0,
                                      ),
                                      border: InputBorder.none,
                                      isDense: true,
                                      contentPadding: EdgeInsets.symmetric(vertical: 11),
                                    ),
                                    onTap: () {
                                      _urlController.selection = TextSelection(
                                        baseOffset: 0,
                                        extentOffset: _urlController.text.length,
                                      );
                                    },
                                    onSubmitted: (_) => _loadUrl(),
                                  ),
                                ),
                                if (_urlFocusNode.hasFocus && _urlController.text.isNotEmpty)
                                  IconButton(
                                    icon: const Icon(Icons.close_rounded, color: Color(0xFFC4C7C5), size: 20),
                                    padding: EdgeInsets.zero,
                                    constraints: const BoxConstraints(),
                                    splashRadius: 18,
                                    onPressed: () {
                                      _urlController.clear();
                                      setState(() {});
                                    },
                                  )
                                else
                                  IconButton(
                                    icon: const Icon(Icons.refresh_rounded, color: Color(0xFFC4C7C5), size: 20),
                                    padding: EdgeInsets.zero,
                                    constraints: const BoxConstraints(),
                                    splashRadius: 18,
                                    onPressed: () => _tabs[_currentTabIndex].controller.reload(),
                                  ),
                                const SizedBox(width: 10),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 4),
                        // Icono del número de pestañas de Chrome (Interactivo)
                        GestureDetector(
                          onTap: _showTabSwitcher,
                          child: Container(
                            width: 22,
                            height: 22,
                            decoration: BoxDecoration(
                              border: Border.all(color: const Color(0xFFC4C7C5), width: 1.8),
                              borderRadius: BorderRadius.circular(6.5),
                            ),
                            child: Center(
                              child: Text(
                                '${_tabs.length}',
                                style: const TextStyle(
                                  color: Color(0xFFC4C7C5),
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 4),
                        // Menú de tres puntos de Chrome
                        IconButton(
                          icon: const Icon(Icons.more_vert_rounded, color: Color(0xFFC4C7C5), size: 23),
                          splashRadius: 20,
                          onPressed: () => _showChromeMenu(context),
                        ),
                      ],
                    ),
                  ),
                  if (_isSearchingInPage)
                    _buildInPageSearchBar(),
                  if (_loadingProgress < 100)
                    LinearProgressIndicator(
                      value: _loadingProgress / 100.0,
                      minHeight: 2.5,
                      backgroundColor: const Color(0xFF1F1F1F),
                      valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF8AB4F8)),
                    ),
                  
                  // El navegador WebView con IndexedStack para preservar el estado
                  Expanded(
                    child: IndexedStack(
                      index: _currentTabIndex,
                      children: _tabs.map((tab) => WebViewWidget(controller: tab.controller)).toList(),
                    ),
                  ),
                ],
              ),
              
              // Botón circular semi-invisible draggable (Ultra stealthy)
              if (!_isStealthMode)
                Positioned(
                right: _btnRight,
                bottom: _btnBottom,
                child: GestureDetector(
                  onPanUpdate: (details) {
                    setState(() {
                      _btnRight -= details.delta.dx;
                      _btnBottom -= details.delta.dy;
                      
                      // Limitar bordes de pantalla
                      final media = MediaQuery.of(context);
                      _btnRight = _btnRight.clamp(10.0, media.size.width - 50.0).toDouble();
                      _btnBottom = _btnBottom.clamp(10.0, media.size.height - 110.0).toDouble();
                    });
                  },
                  child: MouseRegion(
                    cursor: SystemMouseCursors.click,
                    child: Opacity(
                      opacity: widget.config.touchOpacity, // Opacidad dinámica configurada
                      child: Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: Colors.white, // Color de fondo sólido para que responda directo al control de opacidad
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: Colors.black.withOpacity(0.15),
                            width: 1.0,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.15),
                              blurRadius: 5,
                              spreadRadius: 1,
                            )
                          ],
                        ),
                        child: Center(
                          child: _isLoading
                              ? SizedBox(
                                  width: 16,
                                  height: 16,
                                  child: CircularProgressIndicator(
                                    color: Colors.black.withOpacity(0.6),
                                    strokeWidth: 1.5,
                                  ),
                                )
                              : Container(
                                  width: 12,
                                  height: 12,
                                  decoration: BoxDecoration(
                                    color: Colors.black.withOpacity(0.55),
                                    shape: BoxShape.circle,
                                  ),
                                ),
                        ),
                      ),
                    ),
                  ),
                  onTap: _solveQuestionnaire,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showPinDialog() {
    final TextEditingController pinController = TextEditingController();
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF282A2D),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: const BorderSide(color: Color(0xFF3C4043), width: 0.8),
          ),
          title: const Text(
            'Acceso de Seguridad',
            style: TextStyle(color: Color(0xFFE8EAED), fontWeight: FontWeight.bold),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Introduce el PIN de configuración para ingresar.',
                style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 13),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: pinController,
                obscureText: true,
                keyboardType: TextInputType.number,
                maxLength: 8,
                style: const TextStyle(color: Color(0xFFE8EAED), fontSize: 20, letterSpacing: 8),
                textAlign: TextAlign.center,
                decoration: InputDecoration(
                  counterText: '',
                  filled: true,
                  fillColor: const Color(0xFF1F1F1F),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFF3C4043)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFF3C4043)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFF8AB4F8), width: 1.5),
                  ),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancelar', style: TextStyle(color: Color(0xFF9AA0A6))),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF8AB4F8),
                foregroundColor: const Color(0xFF1F1F1F),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              ),
              onPressed: () {
                final enteredPin = pinController.text.trim();
                final actualPin = widget.config.settingsPin.isNotEmpty ? widget.config.settingsPin : '1234';
                
                if (enteredPin == actualPin) {
                  Navigator.pop(context); // Cerrar diálogo
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => SettingsScreen(
                        config: widget.config,
                        onConfigSaved: widget.onConfigSaved,
                      ),
                    ),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('PIN incorrecto. Acceso denegado.'),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              },
              child: const Text('Entrar', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ],
        );
      },
    );
  }
}
