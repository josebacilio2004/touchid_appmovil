import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import '../models/app_config.dart';

class SettingsScreen extends StatefulWidget {
  final AppConfig config;
  final Function(AppConfig) onConfigSaved;

  const SettingsScreen({
    Key? key,
    required this.config,
    required this.onConfigSaved,
  }) : super(key: key);

  @override
  _SettingsScreenState createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _geminiKeyController;
  late TextEditingController _projectIdController;
  late TextEditingController _apiKeyController;
  late TextEditingController _appIdController;
  late TextEditingController _senderIdController;
  late TextEditingController _systemPromptController;
  late TextEditingController _backendUrlController;
  late TextEditingController _settingsPinController;
  late TextEditingController _licenseKeyController;
  late TextEditingController _userIdController;
  bool _obscureGeminiKey = true;
  double _touchOpacity = 0.08;
  bool _showApiSection = false;
  int _clickCount = 0;
  
  int _credits = 0;
  bool _isUnlimited = false;
  bool _isCheckingCredits = false;
  bool _isActivatingLicense = false;

  @override
  void initState() {
    super.initState();
    _geminiKeyController = TextEditingController(text: widget.config.geminiApiKey);
    _projectIdController = TextEditingController(text: widget.config.firebaseProjectId);
    _apiKeyController = TextEditingController(text: widget.config.firebaseApiKey);
    _appIdController = TextEditingController(text: widget.config.firebaseAppId);
    _senderIdController = TextEditingController(text: widget.config.firebaseMessagingSenderId);
    _systemPromptController = TextEditingController(text: widget.config.systemPrompt);
    _backendUrlController = TextEditingController(text: widget.config.backendUrl);
    _settingsPinController = TextEditingController(text: widget.config.settingsPin);
    _licenseKeyController = TextEditingController();
    _userIdController = TextEditingController(text: widget.config.userId);
    _touchOpacity = widget.config.touchOpacity;
    
    _loadCreditsFromServer();
  }

  @override
  void dispose() {
    _geminiKeyController.dispose();
    _projectIdController.dispose();
    _apiKeyController.dispose();
    _appIdController.dispose();
    _senderIdController.dispose();
    _systemPromptController.dispose();
    _backendUrlController.dispose();
    _settingsPinController.dispose();
    _licenseKeyController.dispose();
    _userIdController.dispose();
    super.dispose();
  }

  Future<void> _loadCreditsFromServer() async {
    final backendUrl = _backendUrlController.text.trim();
    final userId = _userIdController.text.trim();
    if (backendUrl.isEmpty || userId.isEmpty) return;

    setState(() {
      _isCheckingCredits = true;
    });

    try {
      final url = '$backendUrl/credits/$userId';
      final response = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 8));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _credits = data['credits'] ?? 0;
          _isUnlimited = data['isUnlimited'] ?? false;
        });
      }
    } catch (e) {
      print('Error al cargar créditos: $e');
    } finally {
      setState(() {
        _isCheckingCredits = false;
      });
    }
  }

  Future<void> _activateLicense() async {
    final backendUrl = _backendUrlController.text.trim();
    final userId = _userIdController.text.trim();
    final licenseKey = _licenseKeyController.text.trim();

    if (licenseKey.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Por favor ingresa un código de licencia'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    setState(() {
      _isActivatingLicense = true;
    });

    try {
      final url = '$backendUrl/activate';
      final response = await http.post(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'userId': userId,
          'licenseKey': licenseKey,
        }),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final newCredits = data['credits'] ?? 0;
        setState(() {
          _credits = newCredits;
          _isUnlimited = data['isUnlimited'] ?? false;
          _licenseKeyController.clear();
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('¡Licencia canjeada con éxito! Nuevos créditos: $newCredits'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        String errorMsg = 'Error al canjear la licencia';
        try {
          final errBody = jsonDecode(response.body);
          errorMsg = errBody['error'] ?? errorMsg;
        } catch (_) {}
        throw Exception(errorMsg);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Fallo: ${e.toString().replaceAll('Exception: ', '')}'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() {
        _isActivatingLicense = false;
      });
    }
  }

  void _saveConfig() async {
    if (_formKey.currentState?.validate() ?? false) {
      final updatedConfig = AppConfig(
        geminiApiKey: _geminiKeyController.text.trim(),
        firebaseProjectId: _projectIdController.text.trim(),
        firebaseApiKey: _apiKeyController.text.trim(),
        firebaseAppId: _appIdController.text.trim(),
        firebaseMessagingSenderId: _senderIdController.text.trim(),
        touchOpacity: _touchOpacity,
        systemPrompt: _systemPromptController.text.trim(),
        userId: _userIdController.text.trim(),
        backendUrl: _backendUrlController.text.trim(),
        settingsPin: _settingsPinController.text.trim(),
      );

      await updatedConfig.save();
      widget.onConfigSaved(updatedConfig);
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Configuración guardada correctamente'),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: GestureDetector(
          onTap: () {
            setState(() {
              _clickCount++;
              if (_clickCount >= 5) {
                _showApiSection = !_showApiSection;
                _clickCount = 0;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(_showApiSection
                        ? 'Configuraciones avanzadas desbloqueadas'
                        : 'Configuraciones avanzadas ocultas'),
                    backgroundColor: Colors.blue,
                    duration: const Duration(seconds: 2),
                  ),
                );
              }
            });
          },
          child: const Text('Configuración'),
        ),
        backgroundColor: const Color(0xFF0F172A),
        elevation: 0,
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF0F172A), Color(0xFF020617)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _showApiSection 
                        ? 'Configura la API de Gemini y las credenciales de tu proyecto Firebase para activar la sincronización.'
                        : 'Ajusta las preferencias de visualización y opacidad para el navegador.',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[400],
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  // Card de Configuración
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B).withOpacity(0.4),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: Colors.white.withOpacity(0.06),
                      ),
                    ),
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'CONFIGURACIÓN DE CLIENTE (OPCIÓN B)',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Colors.blue,
                            letterSpacing: 1.0,
                          ),
                        ),
                        const SizedBox(height: 16),
                        
                        // Mostrar saldo de créditos actual del servidor
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          decoration: BoxDecoration(
                            color: Colors.blue.withOpacity(0.08),
                            border: Border.all(color: Colors.blue.withOpacity(0.2)),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Créditos Disponibles:',
                                style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13),
                              ),
                              Row(
                                children: [
                                  IconButton(
                                    icon: const Icon(Icons.refresh, color: Colors.blue, size: 20),
                                    onPressed: _loadCreditsFromServer,
                                    padding: EdgeInsets.zero,
                                    constraints: const BoxConstraints(),
                                  ),
                                  const SizedBox(width: 8),
                                  _isCheckingCredits
                                      ? const SizedBox(
                                          width: 16,
                                          height: 16,
                                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.blue),
                                        )
                                      : Text(
                                          _isUnlimited ? 'Ilimitado' : '$_credits',
                                          style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold, fontSize: 18),
                                        ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                        
                        // Formulario de canje de licencia
                        Row(
                          children: [
                            Expanded(
                              child: TextFormField(
                                controller: _licenseKeyController,
                                style: const TextStyle(color: Colors.white, fontSize: 13, fontFamily: 'monospace'),
                                decoration: InputDecoration(
                                  labelText: 'Código de Licencia (Token)',
                                  labelStyle: TextStyle(color: Colors.grey[400]),
                                  hintText: 'LIC-50-XXXXXX',
                                  hintStyle: TextStyle(color: Colors.grey[600]),
                                  filled: true,
                                  fillColor: const Color(0xFF0F172A).withOpacity(0.6),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    borderSide: BorderSide.none,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            SizedBox(
                              height: 52,
                              child: ElevatedButton(
                                onPressed: _isActivatingLicense ? null : _activateLicense,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.blue,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                ),
                                child: _isActivatingLicense
                                    ? const SizedBox(
                                        width: 20,
                                        height: 20,
                                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                      )
                                    : const Text('Activar'),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        
                        const Divider(color: Colors.white10),
                        const SizedBox(height: 20),

                        // ID de Cliente (Editable con botón de copiar)
                        TextFormField(
                          controller: _userIdController,
                          style: const TextStyle(color: Colors.white, fontSize: 13, fontFamily: 'monospace'),
                          decoration: InputDecoration(
                            labelText: 'ID de Cliente (Client ID)',
                            labelStyle: TextStyle(color: Colors.grey[400]),
                            filled: true,
                            fillColor: const Color(0xFF0F172A).withOpacity(0.6),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                              borderSide: BorderSide.none,
                            ),
                            suffixIcon: IconButton(
                              icon: const Icon(Icons.copy, color: Colors.blue),
                              onPressed: () {
                                Clipboard.setData(ClipboardData(text: _userIdController.text.trim()));
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('ID de Cliente copiado al portapapeles'),
                                    backgroundColor: Colors.blue,
                                    duration: Duration(seconds: 2),
                                  ),
                                );
                              },
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // URL del Servidor Backend
                        TextFormField(
                          controller: _backendUrlController,
                          style: const TextStyle(color: Colors.white, fontSize: 14),
                          decoration: InputDecoration(
                            labelText: 'Servidor API Backend',
                            labelStyle: TextStyle(color: Colors.grey[400]),
                            hintText: 'https://touchid-backend.onrender.com',
                            hintStyle: TextStyle(color: Colors.grey[600]),
                            filled: true,
                            fillColor: const Color(0xFF0F172A).withOpacity(0.6),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                              borderSide: BorderSide.none,
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                              borderSide: const BorderSide(color: Colors.blue, width: 1.5),
                            ),
                          ),
                          validator: (value) {
                            if (value == null || value.trim().isEmpty) {
                              return 'Por favor ingresa la URL del servidor backend';
                            }
                            // Validar que comience con http/https
                            if (!value.startsWith('http://') && !value.startsWith('https://')) {
                              return 'La URL debe comenzar con http:// o https://';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        // PIN de Seguridad de Ajustes
                        TextFormField(
                          controller: _settingsPinController,
                          style: const TextStyle(color: Colors.white, fontSize: 14),
                          keyboardType: TextInputType.number,
                          maxLength: 8,
                          decoration: InputDecoration(
                            counterText: '',
                            labelText: 'PIN de Acceso a Configuración',
                            labelStyle: TextStyle(color: Colors.grey[400]),
                            hintText: '1234',
                            hintStyle: TextStyle(color: Colors.grey[600]),
                            filled: true,
                            fillColor: const Color(0xFF0F172A).withOpacity(0.6),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                              borderSide: BorderSide.none,
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                              borderSide: const BorderSide(color: Colors.blue, width: 1.5),
                            ),
                          ),
                          validator: (value) {
                            if (value == null || value.trim().isEmpty) {
                              return 'Por favor ingresa un PIN de seguridad';
                            }
                            if (value.trim().length < 4) {
                              return 'El PIN debe tener al menos 4 dígitos';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 20),
                        
                        const Divider(color: Colors.white10),
                        const SizedBox(height: 20),

                        if (_showApiSection) ...[
                          const Text(
                            'LLAVES DE API Y BASE DE DATOS',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: Colors.blue,
                              letterSpacing: 1.0,
                            ),
                          ),
                          const SizedBox(height: 20),
                          
                          // Input Gemini API Key
                          TextFormField(
                            controller: _geminiKeyController,
                            obscureText: _obscureGeminiKey,
                            style: const TextStyle(color: Colors.white),
                            decoration: InputDecoration(
                              labelText: 'Gemini API Key',
                              labelStyle: TextStyle(color: Colors.grey[400]),
                              hintText: 'AIzaSy...',
                              hintStyle: TextStyle(color: Colors.grey[600]),
                              filled: true,
                              fillColor: const Color(0xFF0F172A).withOpacity(0.6),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide.none,
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: const BorderSide(color: Colors.blue, width: 1.5),
                              ),
                              suffixIcon: IconButton(
                                icon: Icon(
                                  _obscureGeminiKey ? Icons.visibility_off : Icons.visibility,
                                  color: Colors.grey[400],
                                ),
                                onPressed: () {
                                  setState(() {
                                    _obscureGeminiKey = !_obscureGeminiKey;
                                  });
                                },
                              ),
                            ),
                            validator: (value) {
                              if (_showApiSection && (value == null || value.trim().isEmpty)) {
                                return 'Por favor ingresa tu API Key de Gemini';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),
                          
                          // Input Firebase Project ID
                          TextFormField(
                            controller: _projectIdController,
                            style: const TextStyle(color: Colors.white),
                            decoration: InputDecoration(
                              labelText: 'Firebase Project ID',
                              labelStyle: TextStyle(color: Colors.grey[400]),
                              filled: true,
                              fillColor: const Color(0xFF0F172A).withOpacity(0.6),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide.none,
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: const BorderSide(color: Colors.blue, width: 1.5),
                              ),
                            ),
                            validator: (value) {
                              if (_showApiSection && (value == null || value.trim().isEmpty)) {
                                return 'Por favor ingresa el ID del Proyecto Firebase';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),
                          
                          // Input Firebase Web API Key
                          TextFormField(
                            controller: _apiKeyController,
                            style: const TextStyle(color: Colors.white),
                            decoration: InputDecoration(
                              labelText: 'Firebase Web API Key (Opcional)',
                              labelStyle: TextStyle(color: Colors.grey[400]),
                              hintText: 'AIzaSy...',
                              hintStyle: TextStyle(color: Colors.grey[600]),
                              filled: true,
                              fillColor: const Color(0xFF0F172A).withOpacity(0.6),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide.none,
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Input Firebase App ID
                          TextFormField(
                            controller: _appIdController,
                            style: const TextStyle(color: Colors.white),
                            decoration: InputDecoration(
                              labelText: 'Firebase App ID (Opcional)',
                              labelStyle: TextStyle(color: Colors.grey[400]),
                              hintText: '1:123456789:android:abcdef...',
                              hintStyle: TextStyle(color: Colors.grey[600]),
                              filled: true,
                              fillColor: const Color(0xFF0F172A).withOpacity(0.6),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide.none,
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Input Firebase Messaging Sender ID
                          TextFormField(
                            controller: _senderIdController,
                            style: const TextStyle(color: Colors.white),
                            keyboardType: TextInputType.number,
                            decoration: InputDecoration(
                              labelText: 'Firebase Messaging Sender ID (Opcional)',
                              labelStyle: TextStyle(color: Colors.grey[400]),
                              hintText: '123456789',
                              hintStyle: TextStyle(color: Colors.grey[600]),
                              filled: true,
                              fillColor: const Color(0xFF0F172A).withOpacity(0.6),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide.none,
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),
                        ],
                        const SizedBox(height: 20),
                        
                        // Opacidad del Touch
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Opacidad del Touch (${(_touchOpacity * 100).round()}%)',
                              style: TextStyle(
                                fontSize: 13,
                                color: Colors.grey[400],
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        SliderTheme(
                          data: SliderTheme.of(context).copyWith(
                            activeTrackColor: Colors.blue,
                            inactiveTrackColor: Colors.white.withOpacity(0.08),
                            thumbColor: Colors.blue,
                            overlayColor: Colors.blue.withOpacity(0.15),
                            trackHeight: 4,
                            valueIndicatorColor: Colors.blue,
                          ),
                          child: Slider(
                            value: _touchOpacity,
                            min: 0.02,
                            max: 1.0,
                            divisions: 49,
                            label: '${(_touchOpacity * 100).round()}%',
                            onChanged: (val) {
                              setState(() {
                                _touchOpacity = val;
                              });
                            },
                          ),
                        ),
                        
                        const SizedBox(height: 20),
                        
                        const Text(
                          'COMPORTAMIENTO DE IA (PROMPT DE ROL)',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Colors.blue,
                            letterSpacing: 1.0,
                          ),
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _systemPromptController,
                          style: const TextStyle(color: Colors.white, fontSize: 14),
                          maxLines: 3,
                          decoration: InputDecoration(
                            labelText: 'Instrucción del Sistema (System Prompt)',
                            labelStyle: TextStyle(color: Colors.grey[400]),
                            hintText: 'Ej: Actúa como médico especialista en cardiología y resuelve...',
                            hintStyle: TextStyle(color: Colors.grey[600]),
                            filled: true,
                            fillColor: const Color(0xFF0F172A).withOpacity(0.6),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                              borderSide: BorderSide.none,
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                              borderSide: const BorderSide(color: Colors.blue, width: 1.5),
                            ),
                          ),
                        ),

                        const SizedBox(height: 24),
                        
                        SizedBox(
                          width: double.infinity,
                          height: 50,
                          child: ElevatedButton(
                            onPressed: _saveConfig,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.blue,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                              elevation: 4,
                              shadowColor: Colors.blue.withOpacity(0.4),
                            ),
                            child: const Text(
                              'GUARDAR CONFIGURACIÓN',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Sección informativa
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.02),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: Colors.white.withOpacity(0.04),
                      ),
                    ),
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Sincronización en Tiempo Real',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'Para habilitar la sincronización en tiempo real con la extensión de Chrome de tu PC, asegúrate de que ambos usen el mismo "Firebase Project ID" y tengan Firestore activado en modo de lectura/escritura pública.',
                          style: TextStyle(
                            fontSize: 13,
                            color: Colors.grey[400],
                            height: 1.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
