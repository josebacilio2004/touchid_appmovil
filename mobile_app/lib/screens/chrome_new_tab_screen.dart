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
    var trimmed = query.trim().replaceAll(RegExp(r'[\u200B-\u200D\uFEFF]'), '').trim();
    if (trimmed.isEmpty) return;

    final lower = trimmed.toLowerCase();
    final String target;
    if (lower == 'udabol' || lower.contains('virtual.udabol') || lower.contains('carpetaverde') || lower.contains('udabol.edu.bo')) {
      target = 'https://virtual.udabol.edu.bo/carpetaverde/general/modulos';
    } else if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      target = trimmed;
    } else if (trimmed.contains('.') && !trimmed.contains(' ')) {
      target = 'https://$trimmed';
    } else {
      target = 'https://www.google.com/search?q=${Uri.encodeComponent(trimmed)}';
    }
    widget.onOpenUrl(target);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFFEDEFF6), // Tono auténtico grisáceo/lavanda claro de Google Chrome Mobile
      child: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        children: [
          const SizedBox(height: 20),

          // 1. Logo Oficial de Google Multicolor Centrado
          Center(
            child: RichText(
              text: const TextSpan(
                style: TextStyle(
                  fontSize: 52,
                  fontWeight: FontWeight.w600,
                  letterSpacing: -1.2,
                  fontFamily: 'Roboto',
                ),
                children: [
                  TextSpan(text: 'G', style: TextStyle(color: Color(0xFF4285F4))),
                  TextSpan(text: 'o', style: TextStyle(color: Color(0xFFEA4335))),
                  TextSpan(text: 'o', style: TextStyle(color: Color(0xFFFBBC05))),
                  TextSpan(text: 'g', style: TextStyle(color: Color(0xFF4285F4))),
                  TextSpan(text: 'l', style: TextStyle(color: Color(0xFF34A853))),
                  TextSpan(text: 'e', style: TextStyle(color: Color(0xFFEA4335))),
                ],
              ),
            ),
          ),
          const SizedBox(height: 26),

          // 2. Barra de Búsqueda Omnibox en Cápsula Blanca Redondeada (Captura 1)
          Container(
            height: 56,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(28),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                // G de Google
                _buildGoogleGIcon(),
                const SizedBox(width: 12),
                Expanded(
                  child: TextField(
                    controller: _searchCtrl,
                    focusNode: _searchFocus,
                    keyboardType: TextInputType.url,
                    textInputAction: TextInputAction.go,
                    autocorrect: false,
                    enableSuggestions: false,
                    style: const TextStyle(
                      color: Color(0xFF1F1F1F),
                      fontSize: 15,
                      fontWeight: FontWeight.w400,
                    ),
                    decoration: const InputDecoration(
                      hintText: 'Buscar en Google o es...',
                      hintStyle: TextStyle(
                        color: Color(0xFF747775),
                        fontSize: 15,
                        fontWeight: FontWeight.w400,
                      ),
                      border: InputBorder.none,
                      isDense: true,
                      contentPadding: EdgeInsets.symmetric(vertical: 12),
                    ),
                    onChanged: (_) => setState(() {}),
                    onSubmitted: _submitSearch,
                  ),
                ),
                // Icono Micrófono
                GestureDetector(
                  onTap: () {
                    if (_searchCtrl.text.trim().isNotEmpty) {
                      _submitSearch(_searchCtrl.text);
                    } else {
                      _searchFocus.requestFocus();
                    }
                  },
                  child: Icon(
                    _searchCtrl.text.trim().isNotEmpty ? Icons.arrow_forward_rounded : Icons.mic_none_rounded,
                    color: _searchCtrl.text.trim().isNotEmpty ? const Color(0xFF0B57D0) : const Color(0xFF444746),
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                // Icono Google Lens
                GestureDetector(
                  onTap: () => widget.onOpenUrl('https://lens.google.com'),
                  child: _buildGoogleLensIcon(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // 3. Dos Cápsulas de Acción Rápida: [✨ Modo IA] y [🕵️ Incógnito] (Captura 1)
          Row(
            children: [
              Expanded(
                child: InkWell(
                  borderRadius: BorderRadius.circular(22),
                  onTap: widget.onModoIA,
                  child: Container(
                    height: 44,
                    decoration: BoxDecoration(
                      color: const Color(0xFFE0E3EB),
                      borderRadius: BorderRadius.circular(22),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.auto_awesome, color: Color(0xFF1F1F1F), size: 18),
                        SizedBox(width: 8),
                        Text(
                          'Modo IA',
                          style: TextStyle(
                            color: Color(0xFF1F1F1F),
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
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
                  borderRadius: BorderRadius.circular(22),
                  onTap: widget.onOpenIncognito,
                  child: Container(
                    height: 44,
                    decoration: BoxDecoration(
                      color: const Color(0xFFE0E3EB),
                      borderRadius: BorderRadius.circular(22),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        IncognitoIcon(size: 20, color: Color(0xFF1F1F1F)),
                        SizedBox(width: 8),
                        Text(
                          'Incógnito',
                          style: TextStyle(
                            color: Color(0xFF1F1F1F),
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
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

          // 4. Tarjeta Blanca Contenedora de Accesos Directos (Cápsulas como en el original)
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              physics: const BouncingScrollPhysics(),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: (widget.shortcuts.isNotEmpty ? widget.shortcuts : _buildOriginalShortcuts()).map((item) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    child: _buildShortcutItem(
                      iconWidget: item.iconWidget ?? const SizedBox(),
                      label: item.label,
                      onTap: () => widget.onOpenUrl(item.url),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // 5. Tarjeta "Retomar esta pestaña" (Captura 1)
          _buildResumeTabSection(),
          const SizedBox(height: 16),

          // 6. Sección: Feed de Noticias / Discover (Captura 1)
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
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
                        'Lula da Silva es reelecto como presidente de Brasil: superó en el ba...',
                        maxLines: 3,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: Color(0xFF1F1F1F),
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          height: 1.25,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Container(
                            width: 18,
                            height: 18,
                            decoration: const BoxDecoration(
                              color: Color(0xFFFFCC00),
                              shape: BoxShape.circle,
                            ),
                            child: const Center(
                              child: Text(
                                'rpp',
                                style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 8,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 6),
                          const Expanded(
                            child: Text(
                              'RPP Noticias · 2h',
                              style: TextStyle(color: Color(0xFF747775), fontSize: 12),
                            ),
                          ),
                          const Icon(Icons.share_outlined, color: Color(0xFF747775), size: 18),
                          const SizedBox(width: 12),
                          const Icon(Icons.more_vert_rounded, color: Color(0xFF747775), size: 18),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 14),
                ClipRRect(
                  borderRadius: BorderRadius.circular(14),
                  child: Container(
                    width: 84,
                    height: 84,
                    color: const Color(0xFFE0E3EB),
                    child: Image.network(
                      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=200&auto=format&fit=crop&q=80',
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => const Center(
                        child: Icon(Icons.public_rounded, color: Color(0xFF747775), size: 36),
                      ),
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

  // Lista de accesos directos oficiales (Captura 1 del usuario: UDABOL, Google, YouTube, Wikipedia, Noticias)
  List<ChromeShortcutItem> _buildOriginalShortcuts() {
    return [
      ChromeShortcutItem(
        label: 'UDABOL',
        url: 'https://virtual.udabol.edu.bo/login/index.php',
        iconWidget: Container(
          width: 48,
          height: 48,
          decoration: const BoxDecoration(
            color: Color(0xFF263238),
            shape: BoxShape.circle,
          ),
          child: const Center(
            child: Icon(Icons.school_rounded, color: Color(0xFF10A37F), size: 24),
          ),
        ),
      ),
      ChromeShortcutItem(
        label: 'Google',
        url: 'https://www.google.com',
        iconWidget: Container(
          width: 48,
          height: 48,
          decoration: const BoxDecoration(
            color: Color(0xFF2B3A60),
            shape: BoxShape.circle,
          ),
          child: const Center(
            child: Text('G', style: TextStyle(color: Color(0xFF4285F4), fontWeight: FontWeight.bold, fontSize: 22)),
          ),
        ),
      ),
      ChromeShortcutItem(
        label: 'YouTube',
        url: 'https://www.youtube.com',
        iconWidget: Container(
          width: 48,
          height: 48,
          decoration: const BoxDecoration(
            color: Color(0xFF2B2D30),
            shape: BoxShape.circle,
          ),
          child: const Center(
            child: Icon(Icons.play_arrow_rounded, color: Color(0xFFFF0000), size: 26),
          ),
        ),
      ),
      ChromeShortcutItem(
        label: 'Wikipedia',
        url: 'https://es.wikipedia.org',
        iconWidget: Container(
          width: 48,
          height: 48,
          decoration: const BoxDecoration(
            color: Color(0xFF2B2D30),
            shape: BoxShape.circle,
          ),
          child: const Center(
            child: Text('W', style: TextStyle(color: Color(0xFFE8EAED), fontWeight: FontWeight.bold, fontSize: 20)),
          ),
        ),
      ),
      ChromeShortcutItem(
        label: 'Noticias',
        url: 'https://news.google.com',
        iconWidget: Container(
          width: 48,
          height: 48,
          decoration: const BoxDecoration(
            color: Color(0xFF2B2D30),
            shape: BoxShape.circle,
          ),
          child: const Center(
            child: Icon(Icons.newspaper_rounded, color: Color(0xFFFBBC05), size: 24),
          ),
        ),
      ),
    ];
  }

  Widget _buildShortcutItem({
    required Widget iconWidget,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: onTap,
      child: Container(
        width: 72,
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            iconWidget,
            const SizedBox(height: 8),
            Text(
              label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Color(0xFF1F1F1F),
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Tarjeta "Continuar con esta pestaña" (Discreta y sutil para entorno universitario)
  Widget _buildResumeTabSection() {
    final hasHistory = widget.lastVisitedTitle.isNotEmpty;
    final title = hasHistory ? widget.lastVisitedTitle : 'Portal Académico - Estudiantes';
    final url = hasHistory ? widget.lastVisitedUrl : 'https://virtual.udabol.edu.bo/carpetaverde/general/modulos';
    final domain = hasHistory ? (Uri.tryParse(url)?.host ?? 'udabol.edu.bo') : 'virtual.udabol.edu.bo';

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
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
                  color: Color(0xFF1F1F1F),
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                ),
              ),
              InkWell(
                onTap: () => widget.onOpenUrl(url),
                child: const Text(
                  'Ver más',
                  style: TextStyle(
                    color: Color(0xFF0B57D0),
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          InkWell(
            borderRadius: BorderRadius.circular(14),
            onTap: () => widget.onOpenUrl(url),
            child: Row(
              children: [
                Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE8F0FE), // Fondo sutil azul académico
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFFD2E3FC), width: 1.0),
                  ),
                  child: const Center(
                    child: Icon(Icons.school_rounded, color: Color(0xFF1967D2), size: 26),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: Color(0xFF1F1F1F),
                          fontSize: 14.5,
                          fontWeight: FontWeight.w600,
                          height: 1.25,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        domain,
                        style: const TextStyle(
                          color: Color(0xFF747775),
                          fontSize: 13,
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

  Widget _buildGoogleGIcon() {
    return SizedBox(
      width: 22,
      height: 22,
      child: CustomPaint(
        painter: _GoogleGLogoPainter(),
      ),
    );
  }

  Widget _buildGoogleLensIcon() {
    return const Icon(
      Icons.camera_alt_outlined,
      color: Color(0xFF444746),
      size: 24,
    );
  }
}

// Pintor vectorial oficial para la letra 'G' de Google
class _GoogleGLogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final double w = size.width;
    final double h = size.height;
    final Rect rect = Rect.fromLTWH(0, 0, w, h);

    // Azul (derecha y barra horizontal)
    final bluePaint = Paint()..color = const Color(0xFF4285F4);
    // Rojo (arriba)
    final redPaint = Paint()..color = const Color(0xFFEA4335);
    // Amarillo (izquierda)
    final yellowPaint = Paint()..color = const Color(0xFFFBBC05);
    // Verde (abajo)
    final greenPaint = Paint()..color = const Color(0xFF34A853);

    final center = Offset(w / 2, h / 2);
    final radius = w / 2;

    // Pintar los arcos de color característicos de Google
    canvas.drawArc(rect, -0.785, 1.57, true, bluePaint);
    canvas.drawArc(rect, 0.785, 1.57, true, greenPaint);
    canvas.drawArc(rect, 2.356, 1.57, true, yellowPaint);
    canvas.drawArc(rect, 3.927, 1.57, true, redPaint);

    // Círculo central blanco para hacer el aro
    final whitePaint = Paint()..color = Colors.white;
    canvas.drawCircle(center, radius * 0.58, whitePaint);

    // Barra horizontal azul en el medio
    final barRect = Rect.fromLTWH(w * 0.42, h * 0.38, w * 0.58, h * 0.24);
    canvas.drawRect(barRect, bluePaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
