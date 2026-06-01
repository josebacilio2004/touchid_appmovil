import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class AppConfig {
  String geminiApiKey;
  String firebaseProjectId;
  String firebaseApiKey;
  String firebaseAppId;
  String firebaseMessagingSenderId;
  double touchOpacity;
  String systemPrompt;

  AppConfig({
    this.geminiApiKey = '',
    this.firebaseProjectId = 'touchid-forms-jose-2026',
    this.firebaseApiKey = '',
    this.firebaseAppId = '',
    this.firebaseMessagingSenderId = '',
    this.touchOpacity = 0.08,
    this.systemPrompt = 'Actúa como un experto académico de alto nivel y responde con precisión y el 100% de tasa de acierto.',
  });

  // Cargar configuración desde SharedPreferences
  static Future<AppConfig> load() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = prefs.getString('touchid_config');
    if (jsonStr != null) {
      try {
        final Map<String, dynamic> map = jsonDecode(jsonStr);
        return AppConfig(
          geminiApiKey: map['geminiApiKey'] ?? '',
          firebaseProjectId: map['firebaseProjectId'] ?? 'touchid-forms-jose-2026',
          firebaseApiKey: map['firebaseApiKey'] ?? '',
          firebaseAppId: map['firebaseAppId'] ?? '',
          firebaseMessagingSenderId: map['firebaseMessagingSenderId'] ?? '',
          touchOpacity: (map['touchOpacity'] as num?)?.toDouble() ?? 0.08,
          systemPrompt: map['systemPrompt'] ?? 'Actúa como un experto académico de alto nivel y responde con precisión y el 100% de tasa de acierto.',
        );
      } catch (e) {
        print('Error parsing config: $e');
      }
    }
    return AppConfig();
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
