import 'package:flutter/material.dart';
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
  bool _obscureGeminiKey = true;
  double _touchOpacity = 0.08;
  bool _showApiSection = false;
  int _clickCount = 0;

  @override
  void initState() {
    super.initState();
    _geminiKeyController = TextEditingController(text: widget.config.geminiApiKey);
    _projectIdController = TextEditingController(text: widget.config.firebaseProjectId);
    _apiKeyController = TextEditingController(text: widget.config.firebaseApiKey);
    _appIdController = TextEditingController(text: widget.config.firebaseAppId);
    _senderIdController = TextEditingController(text: widget.config.firebaseMessagingSenderId);
    _touchOpacity = widget.config.touchOpacity;
  }

  @override
  void dispose() {
    _geminiKeyController.dispose();
    _projectIdController.dispose();
    _apiKeyController.dispose();
    _appIdController.dispose();
    _senderIdController.dispose();
    super.dispose();
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
