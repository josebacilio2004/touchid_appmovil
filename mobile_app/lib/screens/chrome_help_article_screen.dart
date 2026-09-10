import 'package:flutter/material.dart';

class ChromeHelpArticleScreen extends StatefulWidget {
  final String title;

  const ChromeHelpArticleScreen({
    super.key,
    this.title = 'Cambiar permisos en la configuración de sitios',
  });

  @override
  State<ChromeHelpArticleScreen> createState() => _ChromeHelpArticleScreenState();
}

class _ChromeHelpArticleScreenState extends State<ChromeHelpArticleScreen> {
  int _selectedTabIndex = 0; // 0: Android, 1: Ordenador, 2: iPhone y iPad

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1F1F1F),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1F1F1F),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFFE8EAED)),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Ayuda',
          style: TextStyle(
            color: Color(0xFFE8EAED),
            fontSize: 20,
            fontWeight: FontWeight.w400,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.close, color: Color(0xFFE8EAED)),
            onPressed: () => Navigator.pop(context),
          ),
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert, color: Color(0xFFE8EAED)),
            color: const Color(0xFF282A2D),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'browse',
                child: Text('Abrir en el navegador', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 14)),
              ),
              const PopupMenuItem(
                value: 'feedback',
                child: Text('Enviar comentarios', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 14)),
              ),
            ],
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.title,
              style: const TextStyle(
                color: Color(0xFFE8EAED),
                fontSize: 26,
                fontWeight: FontWeight.w400,
                height: 1.25,
                letterSpacing: -0.2,
              ),
            ),
            const SizedBox(height: 14),
            const Text(
              'Puedes definir los permisos de un sitio sin cambiar tu configuración predeterminada.',
              style: TextStyle(
                color: Color(0xFF9AA0A6),
                fontSize: 16,
                height: 1.45,
              ),
            ),
            const SizedBox(height: 20),
            // Pestañas del Sistema Operativo
            Row(
              children: [
                _buildOsTab(0, 'Android'),
                const SizedBox(width: 24),
                _buildOsTab(1, 'Ordenador'),
                const SizedBox(width: 24),
                _buildOsTab(2, 'iPhone y iPad'),
              ],
            ),
            const Divider(color: Color(0xFF3C4043), height: 1, thickness: 1),
            const SizedBox(height: 28),
            // Contenido según pestaña
            if (_selectedTabIndex == 0) ...[
              _buildAndroidContent(),
            ] else if (_selectedTabIndex == 1) ...[
              _buildDesktopContent(),
            ] else ...[
              _buildIosContent(),
            ],
            const SizedBox(height: 36),
            const Divider(color: Color(0xFF3C4043), height: 1),
            const SizedBox(height: 20),
            const Text(
              '¿Te ha resultado útil?',
              style: TextStyle(color: Color(0xFFE8EAED), fontSize: 16, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                OutlinedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Gracias por tus comentarios')),
                    );
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFF8AB4F8),
                    side: const BorderSide(color: Color(0xFF5F6368)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  ),
                  child: const Text('Sí'),
                ),
                const SizedBox(width: 12),
                OutlinedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Gracias por tus comentarios')),
                    );
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFF8AB4F8),
                    side: const BorderSide(color: Color(0xFF5F6368)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  ),
                  child: const Text('No'),
                ),
              ],
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildOsTab(int index, String label) {
    final isSelected = _selectedTabIndex == index;
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedTabIndex = index;
        });
      },
      child: Container(
        padding: const EdgeInsets.only(bottom: 8),
        decoration: BoxDecoration(
          border: Border(
            bottom: BorderSide(
              color: isSelected ? const Color(0xFF8AB4F8) : Colors.transparent,
              width: 3.0,
            ),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? const Color(0xFF8AB4F8) : const Color(0xFF9AA0A6),
            fontSize: 15,
            fontWeight: isSelected ? FontWeight.w500 : FontWeight.w400,
          ),
        ),
      ),
    );
  }

  Widget _buildAndroidContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Gestionar permisos de sitios',
          style: TextStyle(
            color: Color(0xFFE8EAED),
            fontSize: 22,
            fontWeight: FontWeight.w400,
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          'Puedes dar o denegar permisos de sitios fácilmente, así como conceder permisos para una vez en funciones específicas.',
          style: TextStyle(
            color: Color(0xFFE8EAED),
            fontSize: 15.5,
            height: 1.5,
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          'Cuando un sitio te pida permiso para usar funciones como la cámara, la ubicación o el micrófono, puedes seleccionar el permiso que quieras.',
          style: TextStyle(
            color: Color(0xFFE8EAED),
            fontSize: 15.5,
            height: 1.5,
          ),
        ),
        const SizedBox(height: 20),
        _buildBulletPoint(
          boldPrefix: 'Permitir esta vez: ',
          text: 'el sitio puede usar la función solo durante tu visita actual. Volverá a pedirte permiso la próxima vez que lo visites.',
        ),
        const SizedBox(height: 14),
        _buildBulletPoint(
          boldPrefix: 'Permitir mientras se visita el sitio: ',
          text: 'el sitio puede usar la función durante tu visita actual y también en tus futuras visitas.',
        ),
        const SizedBox(height: 14),
        _buildBulletPoint(
          boldPrefix: 'No permitir nunca: ',
          text: 'el sitio no puede usar la función.',
        ),
      ],
    );
  }

  Widget _buildDesktopContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Cambiar la configuración de todos los sitios',
          style: TextStyle(
            color: Color(0xFFE8EAED),
            fontSize: 22,
            fontWeight: FontWeight.w400,
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          '1. En tu ordenador, abre Chrome.',
          style: TextStyle(color: Color(0xFFE8EAED), fontSize: 15.5, height: 1.5),
        ),
        const SizedBox(height: 8),
        const Text(
          '2. Arriba a la derecha, haz clic en Más > Configuración.',
          style: TextStyle(color: Color(0xFFE8EAED), fontSize: 15.5, height: 1.5),
        ),
        const SizedBox(height: 8),
        const Text(
          '3. Haz clic en Privacidad y seguridad > Configuración de sitios.',
          style: TextStyle(color: Color(0xFFE8EAED), fontSize: 15.5, height: 1.5),
        ),
        const SizedBox(height: 8),
        const Text(
          '4. Selecciona el permiso que quieras actualizar.',
          style: TextStyle(color: Color(0xFFE8EAED), fontSize: 15.5, height: 1.5),
        ),
      ],
    );
  }

  Widget _buildIosContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Cambiar permisos de sitios en iOS',
          style: TextStyle(
            color: Color(0xFFE8EAED),
            fontSize: 22,
            fontWeight: FontWeight.w400,
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          'En tu iPhone o iPad, puedes conceder acceso a la cámara o el micrófono a sitios individuales en Chrome.',
          style: TextStyle(color: Color(0xFFE8EAED), fontSize: 15.5, height: 1.5),
        ),
        const SizedBox(height: 12),
        const Text(
          '1. Abre la app Chrome en tu dispositivo.',
          style: TextStyle(color: Color(0xFFE8EAED), fontSize: 15.5, height: 1.5),
        ),
        const SizedBox(height: 8),
        const Text(
          '2. Ve al sitio web cuyos permisos quieras cambiar.',
          style: TextStyle(color: Color(0xFFE8EAED), fontSize: 15.5, height: 1.5),
        ),
        const SizedBox(height: 8),
        const Text(
          '3. A la izquierda de la barra de direcciones, toca Bloqueo o Información del sitio > Permisos.',
          style: TextStyle(color: Color(0xFFE8EAED), fontSize: 15.5, height: 1.5),
        ),
      ],
    );
  }

  Widget _buildBulletPoint({required String boldPrefix, required String text}) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '• ',
          style: TextStyle(
            color: Color(0xFFE8EAED),
            fontSize: 16,
            fontWeight: FontWeight.bold,
            height: 1.5,
          ),
        ),
        Expanded(
          child: RichText(
            text: TextSpan(
              style: const TextStyle(
                color: Color(0xFFE8EAED),
                fontSize: 15.5,
                height: 1.5,
              ),
              children: [
                TextSpan(
                  text: boldPrefix,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                TextSpan(text: text),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
