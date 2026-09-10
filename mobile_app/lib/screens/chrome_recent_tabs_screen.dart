import 'package:flutter/material.dart';
import 'chrome_history_screen.dart';
import '../models/app_config.dart';

class ChromeRecentTabsScreen extends StatefulWidget {
  final List<ChromeHistoryItem> history;
  final Function(String url) onSelectUrl;
  final AppConfig? config;

  const ChromeRecentTabsScreen({
    Key? key,
    required this.history,
    required this.onSelectUrl,
    this.config,
  }) : super(key: key);

  @override
  State<ChromeRecentTabsScreen> createState() => _ChromeRecentTabsScreenState();
}

class _ChromeRecentTabsScreenState extends State<ChromeRecentTabsScreen> {
  bool _isRecentlyClosedExpanded = true;
  bool _isDesktopExpanded = true;
  late List<Map<String, String>> _recentlyClosed;

  @override
  void initState() {
    super.initState();
    _initTabs();
  }

  void _initTabs() {
    _recentlyClosed = widget.history
        .where((h) => !h.url.startsWith('chrome://') && h.url.isNotEmpty && h.url != 'about:blank')
        .take(6)
        .map((h) {
          final uri = Uri.tryParse(h.url);
          final host = uri?.host ?? '';
          return {
            'title': h.title.isNotEmpty ? h.title : (host.isNotEmpty ? host : h.url),
            'url': h.url,
            'domain': host.isNotEmpty ? host : h.url,
            'time': _formatTimestamp(h.timestamp),
          };
        }).toList();
  }

  String _formatTimestamp(DateTime dt) {
    final diff = DateTime.now().difference(dt);
    if (diff.inMinutes < 1) return 'Hace un momento';
    if (diff.inMinutes < 60) return 'Hace ${diff.inMinutes} min';
    if (diff.inHours < 24) return 'Hace ${diff.inHours} h';
    return 'Hace ${diff.inDays} d';
  }

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
            if (_recentlyClosed.isEmpty)
              const Padding(
                padding: EdgeInsets.only(left: 40, top: 10, bottom: 16),
                child: Text(
                  'No hay pestañas cerradas recientemente',
                  style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 13.5),
                ),
              )
            else ...[
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
          ],

          const Divider(color: Color(0xFF3C4043), height: 24),

          // Sección: Otros dispositivos
          if (widget.config?.syncEnabled == true && (widget.config?.userEmail ?? '').isNotEmpty) ...[
            _buildAccordionHeader(
              icon: Icons.devices_rounded,
              title: 'Otros dispositivos sincronizados',
              subtitle: widget.config!.userEmail,
              isExpanded: _isDesktopExpanded,
              onTap: () {
                setState(() {
                  _isDesktopExpanded = !_isDesktopExpanded;
                });
              },
            ),
            if (_isDesktopExpanded)
              const Padding(
                padding: EdgeInsets.only(left: 40, top: 10, bottom: 16),
                child: Text(
                  'No hay pestañas abiertas en tus otros dispositivos',
                  style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 13.5),
                ),
              ),
          ] else ...[
            // Banner de sincronización auténtico de Chrome
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF282A2D),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF3C4043), width: 0.8),
              ),
              child: Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: Color(0xFF1F1F1F),
                    ),
                    child: const Icon(Icons.sync_problem_rounded, color: Color(0xFF8AB4F8), size: 22),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          'Pestañas de otros dispositivos',
                          style: TextStyle(color: Color(0xFFE8EAED), fontSize: 14, fontWeight: FontWeight.w600),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Inicia sesión en Chrome para ver las pestañas que tienes abiertas en tus otros dispositivos.',
                          style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 12.5),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
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
