import 'dart:async';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'models/app_config.dart';
import 'screens/dashboard_screen.dart';
import 'screens/browser_screen.dart';
import 'screens/settings_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Cargar configuración local persistida
  final config = await AppConfig.load();
  bool isFirebaseInitialized = false;

  if (config.isFirebaseConfigured) {
    try {
      await Firebase.initializeApp(
        options: FirebaseOptions(
          apiKey: config.firebaseApiKey,
          appId: config.firebaseAppId,
          messagingSenderId: config.firebaseMessagingSenderId,
          projectId: config.firebaseProjectId,
        ),
      );
      isFirebaseInitialized = true;
    } catch (e) {
      print('Fallo al inicializar Firebase al iniciar: $e');
    }
  }

  runApp(TouchIdApp(
    initialConfig: config,
    initialFirebaseState: isFirebaseInitialized,
  ));
}

class TouchIdApp extends StatefulWidget {
  final AppConfig initialConfig;
  final bool initialFirebaseState;

  const TouchIdApp({
    Key? key,
    required this.initialConfig,
    required this.initialFirebaseState,
  }) : super(key: key);

  @override
  State<TouchIdApp> createState() => _TouchIdAppState();
}

class _TouchIdAppState extends State<TouchIdApp> {
  late AppConfig _config;
  bool _isFirebaseInitialized = false;

  @override
  void initState() {
    super.initState();
    _config = widget.initialConfig;
    _isFirebaseInitialized = widget.initialFirebaseState;
  }

  // Volver a inicializar Firebase de manera dinámica cuando cambien las credenciales
  Future<void> _handleConfigSaved(AppConfig newConfig) async {
    setState(() {
      _config = newConfig;
    });

    if (newConfig.isFirebaseConfigured) {
      try {
        // Si ya hay una app inicializada, cerramos o simplemente evitamos volver a crear
        if (Firebase.apps.isNotEmpty) {
          // Re-inicializamos el default borrando el actual de memoria
          await Firebase.app().delete();
        }

        await Firebase.initializeApp(
          options: FirebaseOptions(
            apiKey: newConfig.firebaseApiKey,
            appId: newConfig.firebaseAppId,
            messagingSenderId: newConfig.firebaseMessagingSenderId,
            projectId: newConfig.firebaseProjectId,
          ),
        );
        
        setState(() {
          _isFirebaseInitialized = true;
        });
      } catch (e) {
        print('Error al re-inicializar Firebase: $e');
        setState(() {
          _isFirebaseInitialized = false;
        });
      }
    } else {
      setState(() {
        _isFirebaseInitialized = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TouchID Cuestionarios',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF020617),
        primaryColor: Colors.blue,
        colorScheme: const ColorScheme.dark(
          primary: Colors.blue,
          secondary: Colors.cyan,
          surface: Color(0xFF0F172A),
        ),
      ),
      home: AppNavigationContainer(
        config: _config,
        isFirebaseInitialized: _isFirebaseInitialized,
        onConfigSaved: _handleConfigSaved,
      ),
    );
  }
}

class AppNavigationContainer extends StatelessWidget {
  final AppConfig config;
  final bool isFirebaseInitialized;
  final Function(AppConfig) onConfigSaved;

  const AppNavigationContainer({
    Key? key,
    required this.config,
    required this.isFirebaseInitialized,
    required this.onConfigSaved,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BrowserScreen(
      config: config,
      isFirebaseInitialized: isFirebaseInitialized,
      onConfigSaved: onConfigSaved,
    );
  }
}
