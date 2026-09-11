import 'package:flutter/material.dart';
import '../widgets/incognito_icon.dart';

class ChromeShortcutItem {
  final String label;
  final String url;
  final Widget? iconWidget;

  const ChromeShortcutItem({
    required this.label,
    required this.url,
    this.iconWidget,
  });
}

class ChromeNewTabScreen extends StatefulWidget {
  final Function(String) onOpenUrl;
  final VoidCallback onSearchTap;
  final VoidCallback onModoIA;
  final VoidCallback onOpenIncognito;
  final VoidCallback? onAccountTap;
  final String userName;
  final String userEmail;
  final List<ChromeShortcutItem> shortcuts;
  final String lastVisitedTitle;
  final String lastVisitedUrl;

  const ChromeNewTabScreen({
    super.key,
    required this.onOpenUrl,
    required this.onSearchTap,
    required this.onModoIA,
    required this.onOpenIncognito,
    this.onAccountTap,
    this.userName = '',
    this.userEmail = '',
    this.shortcuts = const [],
    this.lastVisitedTitle = '',
    this.lastVisitedUrl = '',
  });

  @override
  State<ChromeNewTabScreen> createState() => _ChromeNewTabScreenState();
}

class _ChromeNewTabScreenState extends State<ChromeNewTabScreen> {
  late final TextEditingController _searchCtrl;
  late final FocusNode _searchFocus;

  @override
  void initState() {
    super.initState();
    _searchCtrl = TextEditingController();
    _searchFocus = FocusNode();
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    _searchFocus.dispose();
    super.dispose();
  }

  void _submitSearch(String query) {
    final trimmed = query.trim();
    if (trimmed.isEmpty) return;
    final target = (trimmed.startsWith('http://') || trimmed.startsWith('https://'))
        ? trimmed
        : (trimmed.contains('.') && !trimmed.contains(' '))
            ? 'https://' + trimmed
            : 'https://www.google.com/search?q=' + Uri.encodeComponent(trimmed);
    widget.onOpenUrl(target);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF141518),
      child: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        children: [
          const SizedBox(height: 18),

          // 1. Logo Oficial de Google en Modo Oscuro (Monocromático Blanco/Grisáceo de Chrome)
          const Center(
            child: Text(
              'Google',
              style: TextStyle(
                color: Color(0xFFF1F3F4),
                fontSize: 44,
                fontWeight: FontWeight.w600,
                letterSpacing: -0.8,
              ),
            ),
          ),
          const SizedBox(height: 26),

          // 2. Barra de Búsqueda Omnibox Central Interactiva
          Container(
            height: 54,
            decoration: BoxDecoration(
              color: const Color(0xFF282A2D),
              borderRadius: BorderRadius.circular(27),
              border: Border.all(color: const Color(0xFF3C4043), width: 0.6),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.25),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                // Icono G multicolor oficial
                _buildGoogleIcon(),
                const SizedBox(width: 14),
                Expanded(
                  child: TextField(
                    controller: _searchCtrl,
                    focusNode: _searchFocus,
                    style: const TextStyle(
                      color: Color(0xFFE8EAED),
                      fontSize: 15,
                      fontWeight: FontWeight.w400,
                    ),
                    decoration: const InputDecoration(
                      hintText: 'Busca en Google o esc...',
                      hintStyle: TextStyle(
                        color: Color(0xFF9AA0A6),
                        fontSize: 15,
                        fontWeight: FontWeight.w400,
                      ),
                      border: InputBorder.none,
                      isDense: true,
                      contentPadding: EdgeInsets.symmetric(vertical: 12),
                    ),
                    onSubmitted: _submitSearch,
                  ),
                ),
                GestureDetector(
                  onTap: () {
                    if (_searchCtrl.text.trim().isNotEmpty) {
                      _submitSearch(_searchCtrl.text);
                    } else {
                      _searchFocus.requestFocus();
                    }
                  },
                  child: const Icon(Icons.mic_rounded, color: Color(0xFFE8EAED), size: 23),
                ),
                const SizedBox(width: 16),
                GestureDetector(
                  onTap: () => widget.onOpenUrl('https://lens.google.com'),
                  child: _buildGoogleLensIcon(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // 3. Botones de Acción Rápida: [✨ Modo IA] y [🕶 Incógnito]
          Row(
            children: [
              Expanded(
                child: InkWell(
                  borderRadius: BorderRadius.circular(24),
                  onTap: widget.onModoIA,
                  child: Container(
                    height: 44,
                    decoration: BoxDecoration(
                      color: const Color(0xFF282A2D),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: const Color(0xFF3C4043), width: 0.8),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.auto_awesome, color: Color(0xFF8AB4F8), size: 18),
                        SizedBox(width: 8),
                        Text(
                          'Modo IA',
                          style: TextStyle(
                            color: Color(0xFFE8EAED),
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: InkWell(
                  borderRadius: BorderRadius.circular(24),
                  onTap: widget.onOpenIncognito,
                  child: Container(
                    height: 44,
                    decoration: BoxDecoration(
                      color: const Color(0xFF282A2D),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: const Color(0xFF3C4043), width: 0.8),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        IncognitoIcon(size: 20, color: Color(0xFFE8EAED)),
                        SizedBox(width: 8),
                        Text(
                          'Incógnito',
                          style: TextStyle(
                            color: Color(0xFFE8EAED),
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),

          // 4. Tarjeta Contenedora de Accesos Directos (Shortcuts)
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF1F2024),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFF282A2E), width: 1),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 14),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              physics: const BouncingScrollPhysics(),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: (widget.shortcuts.isNotEmpty ? widget.shortcuts : _buildFallbackShortcuts()).map((item) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 7),
                    child: _buildShortcutItem(
                      iconWidget: item.iconWidget ?? Container(
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: Color(0xFF282A2D),
                        ),
                        child: Center(
                          child: Text(
                            item.label.isNotEmpty ? item.label[0].toUpperCase() : 'W',
                            style: const TextStyle(
                              color: Color(0xFF8AB4F8),
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                        ),
                      ),
                      label: item.label.length > 11 ? item.label.substring(0, 9) + '...' : item.label,
                      onTap: () => widget.onOpenUrl(item.url),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
          const SizedBox(height: 18),

          // 5. Sección: Continuar con esta pestaña (Tarjeta destacada estilo Chrome)
          _buildContinueWithTabSection(),
          const SizedBox(height: 18),

          // 6. Sección: Feed de Noticias (Discover)
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF202124),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: const Color(0xFF282A2D), width: 1),
            ),
            padding: const EdgeInsets.all(16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'El camino de Macondo | Cien años de soledad | Netflix',
                        maxLines: 3,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: Color(0xFFE8EAED),
                          fontSize: 14.5,
                          fontWeight: FontWeight.w500,
                          height: 1.3,
                        ),
                      ),
                      const SizedBox(height: 14),
                      const Row(
                        children: [
                          Icon(Icons.play_circle_fill_rounded, color: Color(0xFFE50914), size: 18),
                          SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              'Netflix Latinoamérica • YouTube • 2d',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 11.5),
                            ),
                          ),
                          Icon(Icons.share_outlined, color: Color(0xFF9AA0A6), size: 18),
                          SizedBox(width: 8),
                          Icon(Icons.more_vert_rounded, color: Color(0xFF9AA0A6), size: 18),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 14),
                Container(
                  width: 88,
                  height: 88,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    color: const Color(0xFF282A2D),
                    image: const DecorationImage(
                      image: NetworkImage('https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=200&auto=format&fit=crop&q=80'),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildContinueWithTabSection() {
    final bool hasValidHistory = widget.lastVisitedUrl.isNotEmpty &&
        widget.lastVisitedUrl != 'chrome://newtab' &&
        widget.lastVisitedUrl != 'about:blank';

    final String displayTitle = hasValidHistory
        ? (widget.lastVisitedTitle.isNotEmpty ? widget.lastVisitedTitle : (Uri.tryParse(widget.lastVisitedUrl)?.host ?? widget.lastVisitedUrl))
        : 'Gran Sorteo - Ssamath Clothes';

    final String displayDomain = hasValidHistory
        ? (Uri.tryParse(widget.lastVisitedUrl)?.host ?? widget.lastVisitedUrl)
        : 'github.io';

    final String targetUrl = hasValidHistory ? widget.lastVisitedUrl : 'https://github.com';

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF202124),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFF282A2D), width: 1),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Continuar con esta pestaña',
                style: TextStyle(
                  color: Color(0xFFE8EAED),
                  fontSize: 14.5,
                  fontWeight: FontWeight.w600,
                ),
              ),
              InkWell(
                onTap: () => widget.onOpenUrl(targetUrl),
                child: const Text(
                  'Ver más',
                  style: TextStyle(
                    color: Color(0xFF8AB4F8),
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          InkWell(
            borderRadius: BorderRadius.circular(14),
            onTap: () => widget.onOpenUrl(targetUrl),
            child: Row(
              children: [
                Container(
                  width: 58,
                  height: 58,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    gradient: const LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [Color(0xFF3B1358), Color(0xFF1A0A2E)],
                    ),
                    border: Border.all(color: const Color(0xFF532479), width: 0.8),
                  ),
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF59E0B).withValues(alpha: 0.25),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            'SORTEO',
                            style: TextStyle(
                              color: Color(0xFFF59E0B),
                              fontSize: 7.5,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(height: 3),
                        const Icon(Icons.shopping_bag_outlined, color: Color(0xFFE8EAED), size: 16),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        displayTitle,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: Color(0xFFE8EAED),
                          fontSize: 14.5,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        displayDomain,
                        style: const TextStyle(
                          color: Color(0xFF9AA0A6),
                          fontSize: 12.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  List<ChromeShortcutItem> _buildFallbackShortcuts() {
    return [
      ChromeShortcutItem(
        label: 'ICPNARC I...',
        url: 'https://icpna.edu.pe',
        iconWidget: Container(
          decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFF261D22)),
          child: const Center(
            child: Text('A', style: TextStyle(color: Color(0xFFEF4444), fontWeight: FontWeight.bold, fontSize: 19)),
          ),
        ),
      ),
      ChromeShortcutItem(
        label: 'Inicio',
        url: 'https://virtual.icpna.edu.pe',
        iconWidget: Container(
          decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFF1B2332)),
          child: const Center(
            child: Text('ICPNA', style: TextStyle(color: Color(0xFF3B82F6), fontWeight: FontWeight.bold, fontSize: 9)),
          ),
        ),
      ),
      ChromeShortcutItem(
        label: 'ChatGPT',
        url: 'https://chatgpt.com',
        iconWidget: Container(
          decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFF1A2624)),
          child: const Center(
            child: Icon(Icons.psychology_outlined, color: Color(0xFF10A37F), size: 22),
          ),
        ),
      ),
      ChromeShortcutItem(
        label: 'Acceso Ind...',
        url: 'https://accounts.google.com',
        iconWidget: Container(
          decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFF1A73E8)),
          child: const Center(
            child: Text('G', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
          ),
        ),
      ),
      ChromeShortcutItem(
        label: 'Reuni...',
        url: 'https://meet.google.com',
        iconWidget: Container(
          decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFF1F2937)),
          child: const Center(
            child: Icon(Icons.videocam_rounded, color: Color(0xFF38BDF8), size: 21),
          ),
        ),
      ),
    ];
  }

  Widget _buildGoogleIcon() {
    return Container(
      width: 22,
      height: 22,
      decoration: const BoxDecoration(shape: BoxShape.circle),
      child: const Center(
        child: Text(
          'G',
          style: TextStyle(
            color: Color(0xFF4285F4),
            fontSize: 20,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }

  Widget _buildGoogleLensIcon() {
    return Container(
      width: 22,
      height: 22,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: const Color(0xFFE8EAED), width: 1.8),
      ),
      child: Center(
        child: Container(
          width: 8,
          height: 8,
          decoration: const BoxDecoration(
            shape: BoxShape.circle,
            color: Color(0xFFE8EAED),
          ),
        ),
      ),
    );
  }

  Widget _buildShortcutItem({
    required Widget iconWidget,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      borderRadius: BorderRadius.circular(12),
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.all(4),
        child: Column(
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFF282A2D),
                border: Border.all(color: const Color(0xFF3C4043), width: 0.8),
              ),
              child: iconWidget,
            ),
            const SizedBox(height: 7),
            Text(
              label,
              style: const TextStyle(
                color: Color(0xFF9AA0A6),
                fontSize: 11.5,
                fontWeight: FontWeight.w400,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
