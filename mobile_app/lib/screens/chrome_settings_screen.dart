import 'package:flutter/material.dart';
import '../models/app_config.dart';

class ChromeSettingsScreen extends StatefulWidget {
  final AppConfig? config;

  const ChromeSettingsScreen({super.key, this.config});

  @override
  State<ChromeSettingsScreen> createState() => _ChromeSettingsScreenState();
}

class _ChromeSettingsScreenState extends State<ChromeSettingsScreen> {
  final TextEditingController _searchCtrl = TextEditingController();
  late AppConfig _config;
  bool _isLoading = true;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _initConfig();
    _searchCtrl.addListener(() {
      setState(() {
        _searchQuery = _searchCtrl.text.trim().toLowerCase();
      });
    });
  }

  Future<void> _initConfig() async {
    if (widget.config != null) {
      _config = widget.config!;
      setState(() => _isLoading = false);
    } else {
      _config = await AppConfig.load();
      setState(() => _isLoading = false);
    }
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  bool _matchesQuery(String text) {
    if (_searchQuery.isEmpty) return true;
    return text.toLowerCase().contains(_searchQuery);
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: Color(0xFF141518),
        body: Center(
          child: CircularProgressIndicator(color: Color(0xFF8AB4F8)),
        ),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFF141518),
      appBar: AppBar(
        backgroundColor: const Color(0xFF141518),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFFE8EAED)),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Configuración',
          style: TextStyle(
            color: Color(0xFFE8EAED),
            fontSize: 22,
            fontWeight: FontWeight.w400,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.help_outline_rounded, color: Color(0xFFE8EAED), size: 24),
            onPressed: () => _showHelpDialog(),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        children: [
          // Buscador de ajustes
          Container(
            height: 48,
            decoration: BoxDecoration(
              color: const Color(0xFF282A2D),
              borderRadius: BorderRadius.circular(24),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                const Icon(Icons.search_rounded, color: Color(0xFF9AA0A6), size: 22),
                const SizedBox(width: 14),
                Expanded(
                  child: TextField(
                    controller: _searchCtrl,
                    style: const TextStyle(color: Color(0xFFE8EAED), fontSize: 15),
                    decoration: const InputDecoration(
                      hintText: 'Buscar ajustes',
                      hintStyle: TextStyle(color: Color(0xFF9AA0A6), fontSize: 15),
                      border: InputBorder.none,
                      isDense: true,
                    ),
                  ),
                ),
                if (_searchQuery.isNotEmpty)
                  GestureDetector(
                    onTap: () => _searchCtrl.clear(),
                    child: const Icon(Icons.close_rounded, color: Color(0xFF9AA0A6), size: 20),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Sección: Tú y Google
          if (_matchesQuery('Tú y Google') || _matchesQuery(_config.userName) || _matchesQuery(_config.userEmail) || _matchesQuery('Servicios de Google')) ...[
            _buildSectionHeader('Tú y Google'),
            const SizedBox(height: 8),

            // Tarjeta de cuenta de usuario real y editable
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFF282A2D),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  borderRadius: BorderRadius.circular(16),
                  onTap: () => _showAccountManagementDialog(),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    child: Row(
                      children: [
                        // Avatar dinámico de Google o silueta sin cuenta
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: _config.userEmail.isNotEmpty ? const Color(0xFF1A73E8) : const Color(0xFF3C4043),
                            gradient: _config.userEmail.isNotEmpty
                                ? const LinearGradient(
                                    colors: [Color(0xFF1A73E8), Color(0xFF4285F4)],
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                  )
                                : null,
                            border: Border.all(color: const Color(0xFF5F6368), width: 1.5),
                          ),
                          child: Center(
                            child: _config.userEmail.isNotEmpty
                                ? Text(
                                    _config.userName.isNotEmpty
                                        ? _config.userName[0].toUpperCase()
                                        : _config.userEmail[0].toUpperCase(),
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 20,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  )
                                : const Icon(Icons.person_rounded, color: Color(0xFF9AA0A6), size: 24),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _config.userEmail.isNotEmpty
                                    ? (_config.userName.isNotEmpty ? _config.userName : _config.userEmail.split('@').first)
                                    : 'Activar la sincronización',
                                style: const TextStyle(
                                  color: Color(0xFFE8EAED),
                                  fontSize: 15.5,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              const SizedBox(height: 3),
                              Text(
                                _config.userEmail.isNotEmpty
                                    ? _config.userEmail
                                    : 'Inicia sesión con tu cuenta de Google',
                                style: const TextStyle(
                                  color: Color(0xFF9AA0A6),
                                  fontSize: 13,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  Icon(
                                    _config.syncEnabled ? Icons.sync : Icons.sync_disabled,
                                    size: 13,
                                    color: _config.syncEnabled ? const Color(0xFF81C995) : const Color(0xFF9AA0A6),
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    _config.syncEnabled
                                        ? 'Sincronización activada'
                                        : (_config.userEmail.isNotEmpty ? 'Sincronización desactivada' : 'Sin cuenta activa'),
                                    style: TextStyle(
                                      color: _config.syncEnabled ? const Color(0xFF81C995) : const Color(0xFF9AA0A6),
                                      fontSize: 11.5,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.chevron_right_rounded, color: Color(0xFF9AA0A6), size: 22),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 10),

            // Tarjeta Servicios de Google
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFF282A2D),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  borderRadius: BorderRadius.circular(16),
                  onTap: () => _showGoogleServicesDialog(),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    child: Row(
                      children: [
                        Container(
                          width: 36,
                          height: 36,
                          decoration: const BoxDecoration(
                            shape: BoxShape.circle,
                            color: Color(0xFF1A73E8),
                          ),
                          child: const Center(
                            child: Text(
                              'G',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        const Expanded(
                          child: Text(
                            'Servicios de Google',
                            style: TextStyle(
                              color: Color(0xFFE8EAED),
                              fontSize: 15,
                              fontWeight: FontWeight.w400,
                            ),
                          ),
                        ),
                        const Icon(Icons.chevron_right_rounded, color: Color(0xFF9AA0A6), size: 22),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),
          ],

          // Sección: Configuración básica
          if (_matchesQuery('Configuración básica') || _matchesQuery('Buscador') || _matchesQuery('Barra de direcciones') || _matchesQuery('Privacidad') || _matchesQuery('Comprobación de seguridad') || _matchesQuery('Navegador')) ...[
            _buildSectionHeader('Configuración básica'),
            const SizedBox(height: 8),
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFF282A2D),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  _buildSettingTile(
                    title: 'Buscador',
                    subtitle: _config.searchEngine,
                    onTap: () => _showSearchEngineSelector(),
                  ),
                  _buildDivider(),
                  _buildSettingTile(
                    title: 'Barra de direcciones',
                    badge: 'Novedad',
                    subtitle: _config.addressBarPosition,
                    onTap: () => _showAddressBarSelector(),
                  ),
                  _buildDivider(),
                  _buildSettingTile(
                    title: 'Privacidad y seguridad',
                    subtitle: 'Navegación segura, borrar datos de navegación',
                    onTap: () => _showPrivacyDialog(),
                  ),
                  _buildDivider(),
                  _buildSettingTile(
                    title: 'Comprobación de seguridad',
                    subtitle: 'Comprobación reciente: Todo protegido',
                    onTap: () => _runSafetyCheck(),
                  ),
                  _buildDivider(),
                  _buildSettingTile(
                    title: 'Navegador predeterminado',
                    subtitle: 'Google Chrome',
                    onTap: () => _showDefaultBrowserDialog(),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
          ],

          // Sección: Contraseñas y Autocompletar
          if (_matchesQuery('Contraseñas') || _matchesQuery('Autocompletar') || _matchesQuery('Formas de pago') || _matchesQuery('Direcciones')) ...[
            _buildSectionHeader('Contraseñas y Autocompletar'),
            const SizedBox(height: 8),
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFF282A2D),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  _buildSettingTile(
                    title: 'Administrador de contraseñas',
                    subtitle: _config.savePasswords ? 'Guardar contraseñas: Activado' : 'Guardar contraseñas: Desactivado',
                    onTap: () => _showPasswordsDialog(),
                  ),
                  _buildDivider(),
                  _buildSettingTile(
                    title: 'Formas de pago',
                    subtitle: 'Guardar y autocompletar métodos de pago',
                    onTap: () => _showPaymentMethodsDialog(),
                  ),
                  _buildDivider(),
                  _buildSettingTile(
                    title: 'Direcciones y más',
                    subtitle: 'Guardar y autocompletar direcciones',
                    onTap: () => _showAddressesDialog(),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
          ],

          // Sección: Avanzada
          if (_matchesQuery('Avanzada') || _matchesQuery('Página principal') || _matchesQuery('Accesibilidad') || _matchesQuery('Configuración de sitios') || _matchesQuery('Idiomas') || _matchesQuery('Descargas') || _matchesQuery('Acerca de Chrome')) ...[
            _buildSectionHeader('Avanzada'),
            const SizedBox(height: 8),
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFF282A2D),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  _buildSettingTile(
                    title: 'Página principal',
                    subtitle: 'Activada - ${_config.homepageUrl}',
                    onTap: () => _showHomepageDialog(),
                  ),
                  _buildDivider(),
                  _buildSettingTile(
                    title: 'Accesibilidad',
                    subtitle: 'Escala de texto: 100%',
                    onTap: () => _showAccessibilityDialog(),
                  ),
                  _buildDivider(),
                  _buildSettingTile(
                    title: 'Configuración de sitios',
                    subtitle: 'Cookies permitidas, JavaScript activado',
                    onTap: () => _showSiteSettingsDialog(),
                  ),
                  _buildDivider(),
                  _buildSettingTile(
                    title: 'Idiomas',
                    subtitle: 'Español (Latinoamérica)',
                    onTap: () => _showLanguagesDialog(),
                  ),
                  _buildDivider(),
                  _buildSettingTile(
                    title: 'Descargas',
                    subtitle: '/storage/emulated/0/Download',
                    onTap: () => _showDownloadsDialog(),
                  ),
                  _buildDivider(),
                  _buildSettingTile(
                    title: 'Acerca de Chrome',
                    subtitle: 'Google Chrome 134.0.6998.39',
                    onTap: () => _showAboutChromeDialog(),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
          ],
        ],
      ),
    );
  }

  // --- Diálogos y Modales Interactivos ---

  void _showAccountManagementDialog() {
    final nameController = TextEditingController(text: _config.userName);
    final emailController = TextEditingController(text: _config.userEmail);
    bool syncVal = _config.syncEnabled;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF202124),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: Color(0xFF1A73E8),
                        ),
                        child: Center(
                          child: Text(
                            nameController.text.isNotEmpty ? nameController.text[0].toUpperCase() : 'G',
                            style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                      const SizedBox(width: 14),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Cuenta de Google vinculada',
                              style: TextStyle(color: Color(0xFFE8EAED), fontSize: 17, fontWeight: FontWeight.w600),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Configuración de perfil en Chrome',
                              style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 13),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  const Text('Nombre de Usuario', style: TextStyle(color: Color(0xFF8AB4F8), fontSize: 13)),
                  const SizedBox(height: 6),
                  TextField(
                    controller: nameController,
                    style: const TextStyle(color: Color(0xFFE8EAED)),
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: const Color(0xFF282A2D),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                      hintText: 'Tu nombre',
                      hintStyle: const TextStyle(color: Color(0xFF5F6368)),
                    ),
                  ),
                  const SizedBox(height: 14),

                  const Text('Correo Electrónico', style: TextStyle(color: Color(0xFF8AB4F8), fontSize: 13)),
                  const SizedBox(height: 6),
                  TextField(
                    controller: emailController,
                    style: const TextStyle(color: Color(0xFFE8EAED)),
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: const Color(0xFF282A2D),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                      hintText: 'tu_correo@gmail.com',
                      hintStyle: const TextStyle(color: Color(0xFF5F6368)),
                    ),
                  ),
                  const SizedBox(height: 16),

                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Sincronización de Chrome', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 15)),
                    subtitle: const Text('Sincroniza marcadores, historial y contraseñas', style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 12.5)),
                    value: syncVal,
                    activeThumbColor: const Color(0xFF8AB4F8),
                    onChanged: (val) {
                      setModalState(() => syncVal = val);
                    },
                  ),
                  const SizedBox(height: 20),

                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          style: OutlinedButton.styleFrom(
                            foregroundColor: const Color(0xFFE8EAED),
                            side: const BorderSide(color: Color(0xFF5F6368)),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            padding: const EdgeInsets.symmetric(vertical: 13),
                          ),
                          onPressed: () => Navigator.pop(context),
                          child: const Text('Cancelar'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF8AB4F8),
                            foregroundColor: const Color(0xFF202124),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            padding: const EdgeInsets.symmetric(vertical: 13),
                          ),
                          onPressed: () async {
                            final newName = nameController.text.trim();
                            final newEmail = emailController.text.trim();
                            _config.userName = newName;
                            _config.userEmail = newEmail;
                            _config.syncEnabled = newEmail.isNotEmpty ? syncVal : false;
                            await _config.save();
                            if (mounted) {
                              setState(() {});
                              Navigator.pop(context);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(newEmail.isNotEmpty ? 'Cuenta de Google guardada con éxito' : 'Cuenta cerrada'),
                                  backgroundColor: const Color(0xFF1E3A5F),
                                ),
                              );
                            }
                          },
                          child: const Text('Guardar', style: TextStyle(fontWeight: FontWeight.w600)),
                        ),
                      ),
                    ],
                  ),
                  if (_config.userEmail.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    Center(
                      child: TextButton.icon(
                        icon: const Icon(Icons.logout_rounded, color: Color(0xFFF28B82), size: 18),
                        label: const Text('Cerrar sesión y quitar cuenta de Chrome', style: TextStyle(color: Color(0xFFF28B82), fontSize: 13)),
                        onPressed: () async {
                          _config.userName = '';
                          _config.userEmail = '';
                          _config.syncEnabled = false;
                          await _config.save();
                          if (mounted) {
                            setState(() {});
                            Navigator.pop(context);
                          }
                        },
                      ),
                    ),
                  ],
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showGoogleServicesDialog() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF202124),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Servicios de Google',
                style: TextStyle(color: Color(0xFFE8EAED), fontSize: 18, fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 16),
              _buildSwitchRow('Permitir inicio de sesión en Chrome', 'Inicia sesión automáticamente en tus cuentas de Google.', true),
              const Divider(color: Color(0xFF3C4043), height: 24),
              _buildSwitchRow('Autocompletar búsquedas y URLs', 'Envía consultas de la barra de direcciones al buscador predeterminado.', true),
              const Divider(color: Color(0xFF3C4043), height: 24),
              _buildSwitchRow('Navegación segura y telemetría', 'Protege contra sitios web maliciosos y descargas peligrosas.', true),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSwitchRow(String title, String subtitle, bool value) {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(color: Color(0xFFE8EAED), fontSize: 14.5)),
              const SizedBox(height: 3),
              Text(subtitle, style: const TextStyle(color: Color(0xFF9AA0A6), fontSize: 12)),
            ],
          ),
        ),
        Switch(
          value: value,
          activeColor: const Color(0xFF8AB4F8),
          onChanged: (_) {},
        ),
      ],
    );
  }

  void _showSearchEngineSelector() {
    final engines = ['Google', 'Microsoft Bing', 'Yahoo!', 'DuckDuckGo', 'Ecosia'];
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF202124),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Buscador predeterminado',
                style: TextStyle(color: Color(0xFFE8EAED), fontSize: 18, fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 12),
              ...engines.map((engine) {
                final isSelected = _config.searchEngine.toLowerCase() == engine.toLowerCase();
                return ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: Icon(
                    isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
                    color: isSelected ? const Color(0xFF8AB4F8) : const Color(0xFF9AA0A6),
                  ),
                  title: Text(engine, style: const TextStyle(color: Color(0xFFE8EAED), fontSize: 15)),
                  onTap: () async {
                    setState(() => _config.searchEngine = engine);
                    await _config.save();
                    if (mounted) Navigator.pop(ctx);
                  },
                );
              }),
            ],
          ),
        );
      },
    );
  }

  void _showAddressBarSelector() {
    final positions = ['Arriba', 'Abajo'];
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF202124),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Posición de la barra de direcciones',
                style: TextStyle(color: Color(0xFFE8EAED), fontSize: 18, fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 12),
              ...positions.map((pos) {
                final isSelected = _config.addressBarPosition.toLowerCase() == pos.toLowerCase();
                return ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: Icon(
                    isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
                    color: isSelected ? const Color(0xFF8AB4F8) : const Color(0xFF9AA0A6),
                  ),
                  title: Text(pos, style: const TextStyle(color: Color(0xFFE8EAED), fontSize: 15)),
                  subtitle: Text(
                    pos == 'Arriba' ? 'Diseño estándar tradicional de Chrome' : 'Acceso rápido con una sola mano en pantallas grandes',
                    style: const TextStyle(color: Color(0xFF9AA0A6), fontSize: 12),
                  ),
                  onTap: () async {
                    setState(() => _config.addressBarPosition = pos);
                    await _config.save();
                    if (mounted) Navigator.pop(ctx);
                  },
                );
              }),
            ],
          ),
        );
      },
    );
  }

  void _showPrivacyDialog() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF202124),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Privacidad y seguridad', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 18, fontWeight: FontWeight.w600)),
              const SizedBox(height: 16),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.delete_outline_rounded, color: Color(0xFF8AB4F8)),
                title: const Text('Borrar datos de navegación', style: TextStyle(color: Color(0xFFE8EAED))),
                subtitle: const Text('Historial, cookies, datos de sitios y caché', style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 12)),
                onTap: () {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Datos de navegación borrados')),
                  );
                },
              ),
              const Divider(color: Color(0xFF3C4043), height: 16),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.security_rounded, color: Color(0xFF81C995)),
                title: const Text('Navegación segura', style: TextStyle(color: Color(0xFFE8EAED))),
                subtitle: const Text('Protección estándar activa contra sitios peligrosos', style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 12)),
                onTap: () => Navigator.pop(ctx),
              ),
              const Divider(color: Color(0xFF3C4043), height: 16),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.https_rounded, color: Color(0xFF8AB4F8)),
                title: const Text('Conexiones siempre seguras (HTTPS)', style: TextStyle(color: Color(0xFFE8EAED))),
                subtitle: const Text('Cambiar automáticamente a conexiones seguras', style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 12)),
                onTap: () => Navigator.pop(ctx),
              ),
            ],
          ),
        );
      },
    );
  }

  void _runSafetyCheck() {
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          backgroundColor: const Color(0xFF282A2D),
          title: const Row(
            children: [
              Icon(Icons.verified_user_rounded, color: Color(0xFF81C995)),
              SizedBox(width: 10),
              Text('Comprobación de seguridad', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 18)),
            ],
          ),
          content: const Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  Icon(Icons.check_circle, color: Color(0xFF81C995), size: 20),
                  SizedBox(width: 12),
                  Text('Actualizaciones: Chrome al día', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 14)),
                ],
              ),
              SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.check_circle, color: Color(0xFF81C995), size: 20),
                  SizedBox(width: 12),
                  Text('Contraseñas: Sin vulnerabilidades', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 14)),
                ],
              ),
              SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.check_circle, color: Color(0xFF81C995), size: 20),
                  SizedBox(width: 12),
                  Text('Navegación segura: Activada', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 14)),
                ],
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Aceptar', style: TextStyle(color: Color(0xFF8AB4F8))),
            ),
          ],
        );
      },
    );
  }

  void _showDefaultBrowserDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF282A2D),
        title: const Text('Navegador predeterminado', style: TextStyle(color: Color(0xFFE8EAED))),
        content: const Text(
          'Google Chrome ya está configurado como tu navegador web predeterminado en Android.',
          style: TextStyle(color: Color(0xFF9AA0A6)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Aceptar', style: TextStyle(color: Color(0xFF8AB4F8))),
          ),
        ],
      ),
    );
  }

  void _showPasswordsDialog() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF202124),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Administrador de contraseñas de Google', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 18, fontWeight: FontWeight.w600)),
              const SizedBox(height: 16),
              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('Preguntar si guardar contraseñas', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 14.5)),
                subtitle: const Text('Ofrece guardar claves al iniciar sesión en sitios web', style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 12)),
                value: _config.savePasswords,
                activeColor: const Color(0xFF8AB4F8),
                onChanged: (val) async {
                  setState(() => _config.savePasswords = val);
                  await _config.save();
                  if (mounted) Navigator.pop(ctx);
                },
              ),
              const Divider(color: Color(0xFF3C4043), height: 16),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.lock_rounded, color: Color(0xFF8AB4F8)),
                title: const Text('Contraseñas guardadas (Google Account)', style: TextStyle(color: Color(0xFFE8EAED))),
                subtitle: Text('Protegidas con la cuenta de ${_config.userEmail}', style: const TextStyle(color: Color(0xFF9AA0A6), fontSize: 12)),
                onTap: () => Navigator.pop(ctx),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showPaymentMethodsDialog() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF202124),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Formas de pago', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 18, fontWeight: FontWeight.w600)),
              const SizedBox(height: 16),
              _buildSwitchRow('Guardar y autocompletar formas de pago', 'Completa formularios de pago con información guardada.', true),
              const Divider(color: Color(0xFF3C4043), height: 20),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.credit_card_rounded, color: Color(0xFF8AB4F8)),
                title: const Text('Google Pay', style: TextStyle(color: Color(0xFFE8EAED))),
                subtitle: Text('Sincronizado con ${_config.userEmail}', style: const TextStyle(color: Color(0xFF9AA0A6), fontSize: 12)),
                onTap: () => Navigator.pop(ctx),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showAddressesDialog() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF202124),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Direcciones y más', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 18, fontWeight: FontWeight.w600)),
              const SizedBox(height: 16),
              _buildSwitchRow('Guardar y autocompletar direcciones', 'Incluye información como números de teléfono y correos electrónicos.', true),
            ],
          ),
        );
      },
    );
  }

  void _showHomepageDialog() {
    final urlCtrl = TextEditingController(text: _config.homepageUrl);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF282A2D),
        title: const Text('Página principal', style: TextStyle(color: Color(0xFFE8EAED))),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Introduce la dirección URL de inicio:', style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 13)),
            const SizedBox(height: 10),
            TextField(
              controller: urlCtrl,
              style: const TextStyle(color: Color(0xFFE8EAED)),
              decoration: InputDecoration(
                filled: true,
                fillColor: const Color(0xFF202124),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancelar', style: TextStyle(color: Color(0xFF9AA0A6)))),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF8AB4F8), foregroundColor: const Color(0xFF202124)),
            onPressed: () async {
              if (urlCtrl.text.trim().isNotEmpty) {
                setState(() => _config.homepageUrl = urlCtrl.text.trim());
                await _config.save();
              }
              if (mounted) Navigator.pop(ctx);
            },
            child: const Text('Guardar'),
          ),
        ],
      ),
    );
  }

  void _showAccessibilityDialog() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF202124),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Accesibilidad', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 18, fontWeight: FontWeight.w600)),
              const SizedBox(height: 16),
              const Text('Escala de texto: 100%', style: TextStyle(color: Color(0xFF8AB4F8), fontSize: 14)),
              const Slider(value: 1.0, min: 0.5, max: 2.0, activeColor: Color(0xFF8AB4F8), onChanged: null),
              const SizedBox(height: 8),
              _buildSwitchRow('Forzar vista simplificada', 'Muestra el lector de artículos cuando sea posible.', true),
            ],
          ),
        );
      },
    );
  }

  void _showSiteSettingsDialog() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF202124),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Configuración de sitios', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 18, fontWeight: FontWeight.w600)),
              const SizedBox(height: 16),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.cookie_rounded, color: Color(0xFF8AB4F8)),
                title: const Text('Cookies de terceros', style: TextStyle(color: Color(0xFFE8EAED))),
                subtitle: const Text('Bloquear cookies de terceros en modo Incógnito', style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 12)),
                onTap: () => Navigator.pop(ctx),
              ),
              const Divider(color: Color(0xFF3C4043), height: 16),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.javascript_rounded, color: Color(0xFF8AB4F8)),
                title: const Text('JavaScript', style: TextStyle(color: Color(0xFFE8EAED))),
                subtitle: const Text('Permitido (recomendado)', style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 12)),
                onTap: () => Navigator.pop(ctx),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showLanguagesDialog() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF202124),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Idiomas de Chrome', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 18, fontWeight: FontWeight.w600)),
              const SizedBox(height: 16),
              const ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Icon(Icons.check, color: Color(0xFF8AB4F8)),
                title: Text('Español (Latinoamérica)', style: TextStyle(color: Color(0xFFE8EAED))),
                subtitle: Text('Idioma de la interfaz de Chrome', style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 12)),
              ),
              const Divider(color: Color(0xFF3C4043), height: 16),
              const ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text('English (United States)', style: TextStyle(color: Color(0xFFE8EAED))),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showDownloadsDialog() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF202124),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Descargas', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 18, fontWeight: FontWeight.w600)),
              const SizedBox(height: 16),
              const ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Icon(Icons.folder_rounded, color: Color(0xFF8AB4F8)),
                title: Text('Ubicación de descarga', style: TextStyle(color: Color(0xFFE8EAED))),
                subtitle: Text('/storage/emulated/0/Download', style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 12)),
              ),
              const Divider(color: Color(0xFF3C4043), height: 16),
              _buildSwitchRow('Preguntar dónde guardar cada archivo', 'Muestra un aviso antes de iniciar la descarga.', false),
            ],
          ),
        );
      },
    );
  }

  void _showAboutChromeDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF282A2D),
        title: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                image: DecorationImage(
                  image: AssetImage('assets/icon/chrome_logo.png'),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(width: 10),
            const Text('Google Chrome', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 19)),
          ],
        ),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Aplicación: Google Chrome', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 14)),
            SizedBox(height: 6),
            Text('Versión: 134.0.6998.39 (Versión oficial) (64 bits)', style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 13)),
            SizedBox(height: 6),
            Text('Sistema operativo: Android 14; Build oficial', style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 13)),
            SizedBox(height: 6),
            Text('Motor JavaScript: V8 13.4.114', style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 13)),
            SizedBox(height: 12),
            Text('© 2026 Google LLC. Todos los derechos reservados.', style: TextStyle(color: Color(0xFF5F6368), fontSize: 11.5)),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cerrar', style: TextStyle(color: Color(0xFF8AB4F8))),
          ),
        ],
      ),
    );
  }

  void _showHelpDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF282A2D),
        title: const Text('Ayuda de Google Chrome', style: TextStyle(color: Color(0xFFE8EAED))),
        content: const Text(
          'Explora los artículos de asistencia oficial, solución de problemas de conexión y novedades de Chrome para dispositivos móviles.',
          style: TextStyle(color: Color(0xFF9AA0A6)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Entendido', style: TextStyle(color: Color(0xFF8AB4F8))),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 4),
      child: Text(
        title,
        style: const TextStyle(
          color: Color(0xFF9AA0A6),
          fontSize: 13.5,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return const Divider(color: Color(0xFF3C4043), height: 1, indent: 16, endIndent: 16);
  }

  Widget _buildSettingTile({
    required String title,
    String? subtitle,
    String? badge,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          title,
                          style: const TextStyle(
                            color: Color(0xFFE8EAED),
                            fontSize: 15,
                            fontWeight: FontWeight.w400,
                          ),
                        ),
                        if (badge != null) ...[
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFF1E3A5F),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              badge,
                              style: const TextStyle(
                                color: Color(0xFF8AB4F8),
                                fontSize: 11,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                    if (subtitle != null) ...[
                      const SizedBox(height: 3),
                      Text(
                        subtitle,
                        style: const TextStyle(
                          color: Color(0xFF9AA0A6),
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              const Icon(Icons.chevron_right_rounded, color: Color(0xFF5F6368), size: 20),
            ],
          ),
        ),
      ),
    );
  }
}
