import 'package:flutter/material.dart';

class ChromeSettingsScreen extends StatefulWidget {
  const ChromeSettingsScreen({super.key});

  @override
  State<ChromeSettingsScreen> createState() => _ChromeSettingsScreenState();
}

class _ChromeSettingsScreenState extends State<ChromeSettingsScreen> {
  final TextEditingController _searchCtrl = TextEditingController();

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
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
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Ayuda de Google Chrome')),
              );
            },
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
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Sección: Tú y Google
          _buildSectionHeader('Tú y Google'),
          const SizedBox(height: 8),

          // Tarjeta de cuenta de usuario
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF282A2D),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                borderRadius: BorderRadius.circular(16),
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Gestionar cuenta de Google')),
                  );
                },
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  child: Row(
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: const Color(0xFF8AB4F8),
                          image: const DecorationImage(
                            image: NetworkImage('https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=100&auto=format&fit=crop&q=80'),
                            fit: BoxFit.cover,
                          ),
                          border: Border.all(color: const Color(0xFF5F6368), width: 1),
                        ),
                      ),
                      const SizedBox(width: 16),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'SSAMIRA XIOMARA CHECYA PEA',
                              style: TextStyle(
                                color: Color(0xFFE8EAED),
                                fontSize: 15,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            SizedBox(height: 3),
                            Text(
                              'sxchecya-es@udabol.edu.bo',
                              style: TextStyle(
                                color: Color(0xFF9AA0A6),
                                fontSize: 13,
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
                onTap: () {},
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
                      const Text(
                        'Servicios de Google',
                        style: TextStyle(
                          color: Color(0xFFE8EAED),
                          fontSize: 15,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Sección: Configuración básica
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
                  subtitle: 'Google',
                  onTap: () {},
                ),
                _buildDivider(),
                _buildSettingTile(
                  title: 'Barra de direcciones',
                  badge: 'Novedad',
                  subtitle: 'Arriba',
                  onTap: () {},
                ),
                _buildDivider(),
                _buildSettingTile(
                  title: 'Privacidad y seguridad',
                  onTap: () {},
                ),
                _buildDivider(),
                _buildSettingTile(
                  title: 'Comprobación de seguridad',
                  onTap: () {},
                ),
                _buildDivider(),
                _buildSettingTile(
                  title: 'Navegador predeterminado',
                  onTap: () {},
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Sección: Contraseñas y Autocompletar
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
                  onTap: () {},
                ),
                _buildDivider(),
                _buildSettingTile(
                  title: 'Formas de pago',
                  onTap: () {},
                ),
                _buildDivider(),
                _buildSettingTile(
                  title: 'Direcciones y más',
                  onTap: () {},
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Sección: Avanzada
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
                  subtitle: 'Activada',
                  onTap: () {},
                ),
                _buildDivider(),
                _buildSettingTile(
                  title: 'Accesibilidad',
                  onTap: () {},
                ),
                _buildDivider(),
                _buildSettingTile(
                  title: 'Configuración de sitios',
                  onTap: () {},
                ),
                _buildDivider(),
                _buildSettingTile(
                  title: 'Idiomas',
                  subtitle: 'Español',
                  onTap: () {},
                ),
                _buildDivider(),
                _buildSettingTile(
                  title: 'Descargas',
                  onTap: () {},
                ),
                _buildDivider(),
                _buildSettingTile(
                  title: 'Acerca de Chrome',
                  subtitle: 'Google Chrome 134.0.6998.39',
                  onTap: () {},
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
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
            ],
          ),
        ),
      ),
    );
  }
}
