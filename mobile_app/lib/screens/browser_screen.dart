import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
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
  
  // Posición del botón circular flotante
  double _btnRight = 20;
  double _btnBottom = 20;
  
  @override
  void initState() {
    super.initState();
    _addNewTab('https://google.com');
  }

  void _addNewTab([String url = 'https://google.com']) {
    final id = DateTime.now().millisecondsSinceEpoch.toString();
    final WebViewController controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setGestureNavigationEnabled(true)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (String pageUrl) {
            setState(() {
              final index = _tabs.indexWhere((t) => t.id == id);
              if (index != -1) {
                _tabs[index].url = pageUrl;
                if (index == _currentTabIndex) {
                  _urlController.text = pageUrl;
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

  // Raspado del cuestionario e invocación a la API de Gemini
  Future<void> _solveQuestionnaire() async {
    if (widget.config.geminiApiKey.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Por favor, ingresa tu API Key de Gemini en Configuración.'),
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

  // Petición HTTP directa a la API de Gemini
  Future<Map<String, dynamic>> _queryGemini(String question, List<String> options) async {
    final apiKey = widget.config.geminiApiKey;
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
        final explanation = resData['explanation'] as String;
        final subject = resData['subject'] as String;

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
      backgroundColor: const Color(0xFF1E293B),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
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
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.add, color: Colors.blueAccent, size: 28),
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
                              color: const Color(0xFF0F172A),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: isActive ? Colors.blue : Colors.white.withOpacity(0.08),
                                width: isActive ? 2.5 : 1,
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
                                          color: isActive ? Colors.blue : Colors.white,
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
                                        color: Colors.grey,
                                        size: 16,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Expanded(
                                  child: Container(
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF1E293B),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    padding: const EdgeInsets.all(8),
                                    child: Center(
                                      child: Text(
                                        tab.url,
                                        maxLines: 4,
                                        overflow: TextOverflow.ellipsis,
                                        textAlign: TextAlign.center,
                                        style: TextStyle(
                                          color: Colors.grey[400],
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
      backgroundColor: const Color(0xFF1E293B),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
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
        backgroundColor: const Color(0xFF0F172A),
        body: SafeArea(
          child: Stack(
            children: [
              Column(
                children: [
                  // Barra de navegación estilo Google Chrome
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                    decoration: const BoxDecoration(
                      color: Color(0xFF1F1F1F), // Color gris oscuro de la barra de Chrome en modo oscuro
                      border: Border(
                        bottom: BorderSide(
                          color: Color(0xFF2F2F2F),
                          width: 1.0,
                        ),
                      ),
                    ),
                    child: Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.home_outlined, color: Colors.white, size: 24),
                          onPressed: () {
                            _tabs[_currentTabIndex].controller.loadRequest(Uri.parse('https://google.com'));
                          },
                        ),
                        Expanded(
                          child: Container(
                            height: 38,
                            decoration: BoxDecoration(
                              color: const Color(0xFF2D2D2D), // Fondo de barra de dirección en Chrome
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Row(
                              children: [
                                const Padding(
                                  padding: EdgeInsets.only(left: 12, right: 6),
                                  child: Icon(Icons.lock_outline, color: Colors.grey, size: 14),
                                ),
                                Expanded(
                                  child: TextField(
                                    controller: _urlController,
                                    style: const TextStyle(color: Colors.white, fontSize: 13.5),
                                    decoration: const InputDecoration(
                                      hintText: 'Busca o escribe una dirección web',
                                      hintStyle: TextStyle(color: Colors.grey, fontSize: 13.5),
                                      border: InputBorder.none,
                                      isDense: true,
                                      contentPadding: EdgeInsets.symmetric(vertical: 10),
                                    ),
                                    onSubmitted: (_) => _loadUrl(),
                                  ),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.refresh, color: Colors.white70, size: 18),
                                  padding: EdgeInsets.zero,
                                  constraints: const BoxConstraints(),
                                  onPressed: () => _tabs[_currentTabIndex].controller.reload(),
                                ),
                                const SizedBox(width: 8),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 4),
                        // Icono del número de pestañas de Chrome (Interactivo)
                        GestureDetector(
                          onTap: _showTabSwitcher,
                          child: Container(
                            width: 24,
                            height: 24,
                            decoration: BoxDecoration(
                              border: Border.all(color: Colors.white, width: 2),
                              borderRadius: BorderRadius.circular(5),
                            ),
                            child: Center(
                              child: Text(
                                '${_tabs.length}',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 4),
                        // Menú de tres puntos de Chrome
                        PopupMenuButton<String>(
                          icon: const Icon(Icons.more_vert, color: Colors.white),
                          color: const Color(0xFF2D2D2D),
                          onSelected: (value) {
                            if (value == 'historial') {
                              _showBrowsingHistory();
                            } else if (value == 'configuracion') {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => SettingsScreen(
                                    config: widget.config,
                                    onConfigSaved: widget.onConfigSaved,
                                  ),
                                ),
                              );
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
                                  Icon(Icons.tab, color: Colors.white70),
                                  SizedBox(width: 10),
                                  Text('Nueva pestaña', style: TextStyle(color: Colors.white)),
                                ],
                              ),
                            ),
                            const PopupMenuItem<String>(
                              value: 'historial',
                              child: Row(
                                children: [
                                  Icon(Icons.history, color: Colors.white70),
                                  SizedBox(width: 10),
                                  Text('Historial', style: TextStyle(color: Colors.white)),
                                ],
                              ),
                            ),
                            const PopupMenuItem<String>(
                              value: 'descargas',
                              child: Row(
                                children: [
                                  Icon(Icons.download_done, color: Colors.white70),
                                  SizedBox(width: 10),
                                  Text('Descargas', style: TextStyle(color: Colors.white)),
                                ],
                              ),
                            ),
                            const PopupMenuDivider(height: 1),
                            const PopupMenuItem<String>(
                              value: 'configuracion',
                              child: Row(
                                children: [
                                  Icon(Icons.settings, color: Colors.white70),
                                  SizedBox(width: 10),
                                  Text('Configuración', style: TextStyle(color: Colors.white)),
                                ],
                              ),
                            ),
                            const PopupMenuItem<String>(
                              value: 'ayuda',
                              child: Row(
                                children: [
                                  Icon(Icons.help_outline, color: Colors.white70),
                                  SizedBox(width: 10),
                                  Text('Ayuda y comentarios', style: TextStyle(color: Colors.white)),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
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
}
