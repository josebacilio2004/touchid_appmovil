import 'package:flutter/material.dart';
import 'chrome_history_screen.dart';

class ChromeRecentTabsScreen extends StatefulWidget {
  final List<ChromeHistoryItem> history;
  final Function(String url) onSelectUrl;

  const ChromeRecentTabsScreen({
    Key? key,
    required this.history,
    required this.onSelectUrl,
  }) : super(key: key);

  @override
  State<ChromeRecentTabsScreen> createState() => _ChromeRecentTabsScreenState();
}

class _ChromeRecentTabsScreenState extends State<ChromeRecentTabsScreen> {
  bool _isRecentlyClosedExpanded = true;
  bool _isDesktopExpanded = true;

  final List<Map<String, String>> _recentlyClosed = [
    {
      'title': 'Examen de Reglas MTC Perú - Simulacro Oficial',
      'url': 'https://sierdgtt.mtc.gob.pe/',
      'domain': 'sierdgtt.mtc.gob.pe',
      'time': 'Hace 5 min',
    },
    {
      'title': 'Google',
      'url': 'https://www.google.com',
      'domain': 'google.com',
      'time': 'Hace 22 min',
    },
    {
      'title': 'Balotario de Preguntas Licencia de Conducir Clase A',
      'url': 'https://portal.mtc.gob.pe/transportes/terrestre/licencias/balotario.html',
      'domain': 'portal.mtc.gob.pe',
      'time': 'Hace 1 hora',
    },
  ];

  final List<Map<String, String>> _desktopTabs = [
    {
      'title': 'Simulador de Examen Teórico MTC 2024',
      'url': 'https://sierdgtt.mtc.gob.pe/evaluacion',
      'domain': 'sierdgtt.mtc.gob.pe',
    },
    {
      'title': 'Guía de Diagnóstico Clínico en Neumología',
      'url': 'https://minsa.gob.pe/normas/neumologia_guia.pdf',
      'domain': 'minsa.gob.pe',
    },
    {
      'title': 'GitHub - josebacilio2004/touchid_appmovil',
      'url': 'https://github.com/josebacilio2004/touchid_appmovil',
      'domain': 'github.com',
    },
    {
      'title': 'Portal Único del Estado Peruano',
      'url': 'https://www.gob.pe/',
      'domain': 'gob.pe',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1F1F1F),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1F1F1F),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: Color(0xFFE8EAED)),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Pestañas recientes',
          style: TextStyle(
            color: Color(0xFFE8EAED),
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
        ),
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert_rounded, color: Color(0xFFC4C7C5)),
            color: const Color(0xFF282A2D),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            onSelected: (val) {
              if (val == 'clear') {
                setState(() {
                  _recentlyClosed.clear();
                });
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Pestañas recientes borradas')),
                );
              }
            },
            itemBuilder: (ctx) => [
              const PopupMenuItem(
                value: 'clear',
                child: Text('Borrar pestañas recientes', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 13)),
              ),
            ],
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        children: [
          // Sección: Cerrado recientemente
          _buildAccordionHeader(
            icon: Icons.history_rounded,
            title: 'Cerrado recientemente',
            subtitle: null,
            isExpanded: _isRecentlyClosedExpanded,
            onTap: () {
              setState(() {
                _isRecentlyClosedExpanded = !_isRecentlyClosedExpanded;
              });
            },
          ),
          if (_isRecentlyClosedExpanded) ...[
            ..._recentlyClosed.map((tab) => _buildTabItem(tab)),
            Padding(
              padding: const EdgeInsets.only(left: 48, top: 4, bottom: 12),
              child: Align(
                alignment: Alignment.centerLeft,
                child: InkWell(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (ctx) => ChromeHistoryScreen(
                          history: widget.history,
                          onSelectUrl: widget.onSelectUrl,
                          onDeleteItem: (id) {},
                          onClearAll: () {},
                        ),
                      ),
                    );
                  },
                  child: const Text(
                    'Mostrar historial completo',
                    style: TextStyle(
                      color: Color(0xFF8AB4F8),
                      fontSize: 13.5,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ),
            ),
          ],

          const Divider(color: Color(0xFF3C4043), height: 24),

          // Sección: Dispositivo sincronizado (DESKTOP-4DLEUHD)
          _buildAccordionHeader(
            icon: Icons.computer_rounded,
            title: 'DESKTOP-4DLEUHD',
            subtitle: 'Hace 14 min',
            isExpanded: _isDesktopExpanded,
            onTap: () {
              setState(() {
                _isDesktopExpanded = !_isDesktopExpanded;
              });
            },
          ),
          if (_isDesktopExpanded) ...[
            ..._desktopTabs.map((tab) => _buildTabItem(tab)),
          ],
        ],
      ),
    );
  }

  Widget _buildAccordionHeader({
    required IconData icon,
    required String title,
    String? subtitle,
    required bool isExpanded,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
        child: Row(
          children: [
            Icon(icon, color: const Color(0xFF8AB4F8), size: 22),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      color: Color(0xFFE8EAED),
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  if (subtitle != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        color: Color(0xFF9AA0A6),
                        fontSize: 12,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            Icon(
              isExpanded ? Icons.keyboard_arrow_up_rounded : Icons.keyboard_arrow_down_rounded,
              color: const Color(0xFFC4C7C5),
              size: 24,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTabItem(Map<String, String> tab) {
    return InkWell(
      onTap: () {
        widget.onSelectUrl(tab['url'] ?? 'https://google.com');
        Navigator.pop(context);
      },
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
        child: Row(
          children: [
            const SizedBox(width: 36),
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                color: const Color(0xFF282A2D),
                borderRadius: BorderRadius.circular(4),
              ),
              child: const Icon(
                Icons.language_rounded,
                color: Color(0xFF9AA0A6),
                size: 16,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    tab['title'] ?? '',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: Color(0xFFE8EAED),
                      fontSize: 13.5,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    tab['time'] != null ? '${tab['domain']} • ${tab['time']}' : (tab['domain'] ?? ''),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: Color(0xFF9AA0A6),
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
