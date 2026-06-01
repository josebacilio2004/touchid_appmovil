import 'dart:convert';
import 'dart:math';
import 'package:shared_preferences/shared_preferences.dart';

class AppConfig {
  String geminiApiKey;
  String firebaseProjectId;
  String firebaseApiKey;
  String firebaseAppId;
  String firebaseMessagingSenderId;
  double touchOpacity;
  String systemPrompt;
  String userId;
  String backendUrl;

  AppConfig({
    this.geminiApiKey = '',
    this.firebaseProjectId = 'touchid-forms-jose-2026',
    this.firebaseApiKey = '',
    this.firebaseAppId = '',
    this.firebaseMessagingSenderId = '',
    this.touchOpacity = 0.08,
    this.systemPrompt = 'Actúa como un experto académico de alto nivel y responde con precisión y el 100% de tasa de acierto.',
    this.userId = '',
    this.backendUrl = 'https://touchid-backend.onrender.com',
  });

  // Generar un ID hexadecimal aleatorio sencillo
  static String _generateRandomHex(int length) {
    final random = Random.secure();
    final values = List<int>.generate(length, (i) => random.nextInt(256));
    return values.map((b) => b.toRadixString(16).padLeft(2, '0')).join();
  }

  // Cargar configuración desde SharedPreferences
  static Future<AppConfig> load() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = prefs.getString('touchid_config');
    String userId = '';
    
    if (jsonStr != null) {
      try {
        final Map<String, dynamic> map = jsonDecode(jsonStr);
        userId = map['userId'] ?? '';
        if (userId.isEmpty) {
          userId = 'usr_${DateTime.now().millisecondsSinceEpoch}_${_generateRandomHex(4)}';
        }
        
        final config = AppConfig(
          geminiApiKey: map['geminiApiKey'] ?? '',
          firebaseProjectId: map['firebaseProjectId'] ?? 'touchid-forms-jose-2026',
          firebaseApiKey: map['firebaseApiKey'] ?? '',
          firebaseAppId: map['firebaseAppId'] ?? '',
          firebaseMessagingSenderId: map['firebaseMessagingSenderId'] ?? '',
          touchOpacity: (map['touchOpacity'] as num?)?.toDouble() ?? 0.08,
          systemPrompt: map['systemPrompt'] ?? 'Actúa como un experto académico de alto nivel y responde con precisión y el 100% de tasa de acierto.',
          userId: userId,
          backendUrl: map['backendUrl'] ?? 'https://touchid-backend.onrender.com',
        );
        
        // Guardar el ID recién generado si no existía
        if (map['userId'] == null || (map['userId'] as String).isEmpty) {
          await config.save();
        }
        
        return config;
      } catch (e) {
        print('Error parsing config: $e');
      }
    }
    
    // Si no hay configuración previa, generar ID
    userId = 'usr_${DateTime.now().millisecondsSinceEpoch}_${_generateRandomHex(4)}';
    final config = AppConfig(userId: userId);
    await config.save();
    return config;
  }

  // Guardar configuración en SharedPreferences
  Future<void> save() async {
    final prefs = await SharedPreferences.getInstance();
    final map = {
      'geminiApiKey': geminiApiKey,
      'firebaseProjectId': firebaseProjectId,
      'firebaseApiKey': firebaseApiKey,
      'firebaseAppId': firebaseAppId,
      'firebaseMessagingSenderId': firebaseMessagingSenderId,
      'touchOpacity': touchOpacity,
      'systemPrompt': systemPrompt,
      'userId': userId,
      'backendUrl': backendUrl,
    };
    await prefs.setString('touchid_config', jsonEncode(map));
  }

  // Verificar si Firebase está configurado para inicialización dinámica
  bool get isFirebaseConfigured {
    return firebaseProjectId.isNotEmpty && 
           firebaseApiKey.isNotEmpty && 
           firebaseAppId.isNotEmpty;
  }
}
