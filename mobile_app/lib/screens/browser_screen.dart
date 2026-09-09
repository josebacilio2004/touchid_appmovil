import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:webview_flutter_wkwebview/webview_flutter_wkwebview.dart';
import 'package:http/http.dart' as http;
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/app_config.dart';
import 'dashboard_screen.dart';
import 'settings_screen.dart';

class BrowserTab {
  final String id;
  String title;
  String url;
  final WebViewController controller;

  BrowserTab({
    required this.id,
    required this.title,
    required this.url,
    required this.controller,
  });
}

class HistoryItem {
  final String title;
  final String url;
  final DateTime timestamp;

  HistoryItem({
    required this.title,
    required this.url,
    required this.timestamp,
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
  final List<HistoryItem> _browsingHistory = [];
  
  final TextEditingController _urlController = TextEditingController(text: 'https://google.com');
  bool _isLoading = false;
  int _loadingProgress = 100;
  
  // Posición del botón circular flotante
  double _btnRight = 20;
  double _btnBottom = 20;
  
  @override
  void initState() {
    super.initState();
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

  void _addNewTab([String url = 'https://google.com']) {
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
                _urlController.text = pageUrl;
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
          
          // Track browsing history
          if (_browsingHistory.isEmpty || _browsingHistory.first.url != pageUrl) {
            _browsingHistory.insert(0, HistoryItem(
              title: cleanTitle,
              url: pageUrl,
              timestamp: DateTime.now(),
            ));
          }

          setState(() {
            final index = _tabs.indexWhere((t) => t.id == id);
            if (index != -1) {
              _tabs[index].url = pageUrl;
              _tabs[index].title = cleanTitle;
              if (index == _currentTabIndex) {
                _urlController.text = pageUrl;
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
        title: 'Nueva pestaña',
        url: url,
        controller: controller,
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
    String url = _urlController.text.trim();
    if (url.isNotEmpty) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://$url';
      }
      _tabs[_currentTabIndex].controller.loadRequest(Uri.parse(url));
      FocusScope.of(context).unfocus();
    }
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

    if (backendUrl.isNotEmpty) {
      String urlStr = backendUrl;
      if (!urlStr.endsWith('/solve')) {
        urlStr = urlStr.endsWith('/') ? '${urlStr}solve' : '$urlStr/solve';
      }
      
      final systemPrompt = widget.config.systemPrompt.trim().isNotEmpty
          ? widget.config.systemPrompt.trim()
          : 'Actúa como un experto académico de alto nivel y responde con precisión y el 100% de tasa de acierto.';

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
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-3.1-flash-lite',
      'gemini-2.5-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-2.0-flash-lite',
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

    final systemPrompt = widget.config.systemPrompt.trim().isNotEmpty
        ? widget.config.systemPrompt.trim()
        : 'Actúa como un experto académico de alto nivel y responde con precisión y el 100% de tasa de acierto.';

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
              height: MediaQuery.of(context).size.height * 0.8,
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Historial del Navegador',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      TextButton(
                        onPressed: () {
                          setModalState(() {
                            _browsingHistory.clear();
                          });
                          setState(() {});
                        },
                        child: const Text('Borrar todo', style: TextStyle(color: Colors.redAccent)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Expanded(
                    child: _browsingHistory.isEmpty
                        ? const Center(
                            child: Text(
                              'No hay historial de navegación',
                              style: TextStyle(color: Colors.grey),
                            ),
                          )
                        : ListView.builder(
                            itemCount: _browsingHistory.length,
                            itemBuilder: (context, index) {
                              final item = _browsingHistory[index];
                              return ListTile(
                                leading: const Icon(Icons.history, color: Colors.grey),
                                title: Text(
                                  item.title,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(color: Colors.white, fontSize: 14),
                                ),
                                subtitle: Text(
                                  item.url,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(color: Colors.grey[400], fontSize: 11),
                                ),
                                onTap: () {
                                  _tabs[_currentTabIndex].controller.loadRequest(Uri.parse(item.url));
                                  Navigator.pop(context);
                                },
                                trailing: IconButton(
                                  icon: const Icon(Icons.delete_outline, color: Colors.grey, size: 20),
                                  onPressed: () {
                                    setModalState(() {
                                      _browsingHistory.removeAt(index);
                                    });
                                    setState(() {});
                                  },
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
                                const Padding(
                                  padding: EdgeInsets.only(left: 14, right: 8),
                                  child: Icon(Icons.tune_rounded, color: Color(0xFF9AA0A6), size: 17),
                                ),
                                Expanded(
                                  child: TextField(
                                    controller: _urlController,
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
                                    onSubmitted: (_) => _loadUrl(),
                                  ),
                                ),
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
                        PopupMenuButton<String>(
                          icon: const Icon(Icons.more_vert_rounded, color: Color(0xFFC4C7C5), size: 23),
                          color: const Color(0xFF282A2D),
                          elevation: 4,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          onSelected: (value) {
                            if (value == 'historial') {
                              _showBrowsingHistory();
                            } else if (value == 'configuracion') {
                              _showPinDialog();
                            } else if (value == 'pestana') {
                              _addNewTab('https://google.com');
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('Función "$value" no disponible en este momento.'),
                                  duration: const Duration(seconds: 1),
                                ),
                              );
                            }
                          },
                          itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
                            const PopupMenuItem<String>(
                              value: 'pestana',
                              child: Row(
                                children: [
                                  Icon(Icons.add_box_outlined, color: Color(0xFFC4C7C5), size: 20),
                                  SizedBox(width: 12),
                                  Text('Nueva pestaña', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 14)),
                                ],
                              ),
                            ),
                            const PopupMenuItem<String>(
                              value: 'historial',
                              child: Row(
                                children: [
                                  Icon(Icons.history_rounded, color: Color(0xFFC4C7C5), size: 20),
                                  SizedBox(width: 12),
                                  Text('Historial', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 14)),
                                ],
                              ),
                            ),
                            const PopupMenuItem<String>(
                              value: 'descargas',
                              child: Row(
                                children: [
                                  Icon(Icons.download_rounded, color: Color(0xFFC4C7C5), size: 20),
                                  SizedBox(width: 12),
                                  Text('Descargas', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 14)),
                                ],
                              ),
                            ),
                            const PopupMenuDivider(height: 1),
                            const PopupMenuItem<String>(
                              value: 'configuracion',
                              child: Row(
                                children: [
                                  Icon(Icons.settings_outlined, color: Color(0xFFC4C7C5), size: 20),
                                  SizedBox(width: 12),
                                  Text('Configuración', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 14)),
                                ],
                              ),
                            ),
                            const PopupMenuItem<String>(
                              value: 'ayuda',
                              child: Row(
                                children: [
                                  Icon(Icons.help_outline_rounded, color: Color(0xFFC4C7C5), size: 20),
                                  SizedBox(width: 12),
                                  Text('Ayuda y comentarios', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 14)),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
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
