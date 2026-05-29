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

class AppNavigationContainer extends StatefulWidget {
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
  State<AppNavigationContainer> createState() => _AppNavigationContainerState();
}

class _AppNavigationContainerState extends State<AppNavigationContainer> {
  int _currentIndex = 0;
  bool _isNavBarVisible = true;
  Timer? _hideTimer;

  @override
  void initState() {
    super.initState();
    _startHideTimer();
  }

  @override
  void dispose() {
    _hideTimer?.cancel();
    super.dispose();
  }

  void _startHideTimer() {
    _hideTimer?.cancel();
    _hideTimer = Timer(const Duration(seconds: 4), () {
      if (mounted) {
        setState(() {
          _isNavBarVisible = false;
        });
      }
    });
  }

  void _showNavBar() {
    _hideTimer?.cancel();
    if (!_isNavBarVisible) {
      setState(() {
        _isNavBarVisible = true;
      });
    }
    _startHideTimer();
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    final isSelected = _currentIndex == index;
    return Expanded(
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: () {
          _showNavBar();
          setState(() {
            _currentIndex = index;
          });
        },
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const SizedBox(height: 6),
            // Indicador de pestaña seleccionada
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: isSelected ? 20 : 0,
              height: 3,
              decoration: BoxDecoration(
                color: Colors.blue,
                borderRadius: BorderRadius.circular(1.5),
              ),
            ),
            const Spacer(),
            Icon(
              icon,
              color: isSelected ? Colors.blue : Colors.grey[500],
              size: 22,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                color: isSelected ? Colors.blue : Colors.grey[500],
                fontSize: 10,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
            const Spacer(),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // Definición de las pantallas en base al estado actual
    final List<Widget> screens = [
      DashboardScreen(
        config: widget.config,
        isFirebaseInitialized: widget.isFirebaseInitialized,
      ),
      BrowserScreen(
        config: widget.config,
        isFirebaseInitialized: widget.isFirebaseInitialized,
      ),
      SettingsScreen(
        config: widget.config,
        onConfigSaved: widget.onConfigSaved,
      ),
    ];

    return Listener(
      behavior: HitTestBehavior.translucent,
      onPointerDown: (_) => _showNavBar(),
      onPointerMove: (_) => _showNavBar(),
      child: Scaffold(
        body: Stack(
          children: [
            IndexedStack(
              index: _currentIndex,
              children: screens,
            ),
            // Sensor invisible en el borde inferior para re-activar la barra
            if (!_isNavBarVisible)
              Positioned(
                left: 0,
                right: 0,
                bottom: 0,
                height: 24, // Zona de 24px en la parte inferior
                child: GestureDetector(
                  behavior: HitTestBehavior.translucent,
                  onTap: _showNavBar,
                  onVerticalDragUpdate: (details) {
                    if (details.delta.dy < -2) { // Deslizar hacia arriba
                      _showNavBar();
                    }
                  },
                  child: Container(
                    color: Colors.transparent,
                  ),
                ),
              ),
          ],
        ),
        bottomNavigationBar: AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeInOut,
          height: _isNavBarVisible ? (64.0 + MediaQuery.of(context).padding.bottom) : 0.0,
          child: ClipRect(
            child: OverflowBox(
              minHeight: 0.0,
              maxHeight: 120.0,
              alignment: Alignment.topCenter,
              child: Container(
                height: 64.0 + MediaQuery.of(context).padding.bottom,
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  border: Border(
                    top: BorderSide(
                      color: Colors.white.withOpacity(0.08),
                      width: 1,
                    ),
                  ),
                ),
                padding: EdgeInsets.only(
                  bottom: MediaQuery.of(context).padding.bottom,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildNavItem(0, Icons.bolt, 'Compañero'),
                    _buildNavItem(1, Icons.language, 'Navegador'),
                    _buildNavItem(2, Icons.settings, 'Configuración'),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
