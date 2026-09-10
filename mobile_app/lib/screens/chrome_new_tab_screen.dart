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

class ChromeNewTabScreen extends StatelessWidget {
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
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF141518),
      child: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        children: [
          // 0. Top Right: Botón / Avatar de Cuenta de Google del usuario actual
          Align(
            alignment: Alignment.centerRight,
            child: GestureDetector(
              onTap: onAccountTap,
              child: userEmail.isNotEmpty
                  ? Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: const Color(0xFF1A73E8),
                        border: Border.all(color: const Color(0xFF5F6368), width: 1.2),
                      ),
                      child: Center(
                        child: Text(
                          userName.isNotEmpty ? userName[0].toUpperCase() : userEmail[0].toUpperCase(),
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                        ),
                      ),
                    )
                  : Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFF282A2D),
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: const Color(0xFF3C4043), width: 0.8),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.account_circle_outlined, color: Color(0xFF8AB4F8), size: 18),
                          SizedBox(width: 6),
                          Text(
                            'Acceder',
                            style: TextStyle(color: Color(0xFF8AB4F8), fontSize: 12.5, fontWeight: FontWeight.w500),
                          ),
                        ],
                      ),
                    ),
            ),
          ),
          const SizedBox(height: 16),

          // 1. Logo Oficial de Google
          Center(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildGoogleLetter('G', const Color(0xFF4285F4)),
                _buildGoogleLetter('o', const Color(0xFFEA4335)),
                _buildGoogleLetter('o', const Color(0xFFFBBC05)),
                _buildGoogleLetter('g', const Color(0xFF4285F4)),
                _buildGoogleLetter('l', const Color(0xFF34A853)),
                _buildGoogleLetter('e', const Color(0xFFEA4335)),
              ],
            ),
          ),
          const SizedBox(height: 30),

          // 2. Barra de Búsqueda Omnibox Central
          GestureDetector(
            onTap: onSearchTap,
            child: Container(
              height: 52,
              decoration: BoxDecoration(
                color: const Color(0xFF282A2D),
                borderRadius: BorderRadius.circular(26),
                border: Border.all(color: const Color(0xFF3C4043), width: 0.6),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.2),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  // Icono G multicolor
                  _buildGoogleIcon(),
                  const SizedBox(width: 14),
                  const Expanded(
                    child: Text(
                      'Busca en Google o escribe...',
                      style: TextStyle(
                        color: Color(0xFF9AA0A6),
                        fontSize: 15,
                        fontWeight: FontWeight.w400,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const Icon(Icons.mic_rounded, color: Color(0xFFE8EAED), size: 22),
                  const SizedBox(width: 16),
                  const Icon(Icons.camera_alt_outlined, color: Color(0xFFE8EAED), size: 21),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // 3. Botones de Acción Rápida: [Modo IA] y [Incógnito]
          Row(
            children: [
              Expanded(
                child: InkWell(
                  borderRadius: BorderRadius.circular(24),
                  onTap: onModoIA,
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
                  onTap: onOpenIncognito,
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
          const SizedBox(height: 24),

          // 4. Accesos Directos Dinámicos (Shortcuts)
          if (shortcuts.isNotEmpty) ...[
            Container(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: shortcuts.map((item) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 6),
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
                        label: item.label.length > 10 ? '${item.label.substring(0, 8)}...' : item.label,
                        onTap: () => onOpenUrl(item.url),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),
            const SizedBox(height: 20),
          ],

          // 5. Sección: Continuar con esta pestaña (sólo si hay pestaña previa real)
          if (lastVisitedUrl.isNotEmpty && 
              lastVisitedUrl != 'chrome://newtab' && 
              lastVisitedUrl != 'chrome://incognito' &&
              lastVisitedUrl != 'about:blank') ...[
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFF202124),
                borderRadius: BorderRadius.circular(16),
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
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      InkWell(
                        onTap: () => onOpenUrl(lastVisitedUrl),
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
                    borderRadius: BorderRadius.circular(12),
                    onTap: () => onOpenUrl(lastVisitedUrl),
                    child: Row(
                      children: [
                        Container(
                          width: 54,
                          height: 54,
                          decoration: BoxDecoration(
                            color: const Color(0xFF2D2F31),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFF3C4043), width: 0.8),
                          ),
                          child: Center(
                            child: Text(
                              (Uri.tryParse(lastVisitedUrl)?.host ?? 'W').isNotEmpty
                                  ? (Uri.tryParse(lastVisitedUrl)?.host ?? 'W')[0].toUpperCase()
                                  : 'W',
                              style: const TextStyle(
                                color: Color(0xFF8AB4F8),
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                lastVisitedTitle.isNotEmpty ? lastVisitedTitle : (Uri.tryParse(lastVisitedUrl)?.host ?? lastVisitedUrl),
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
                                Uri.tryParse(lastVisitedUrl)?.host ?? lastVisitedUrl,
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
            ),
            const SizedBox(height: 20),
          ],

          // 6. Sección: Feed de Noticias (Discover)
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF202124),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF282A2D), width: 1),
            ),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
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
                              fontSize: 15,
                              fontWeight: FontWeight.w500,
                              height: 1.3,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Container(
                                width: 16,
                                height: 16,
                                decoration: const BoxDecoration(
                                  color: Color(0xFFE50914),
                                  shape: BoxShape.circle,
                                ),
                                child: const Center(
                                  child: Text('N', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                                ),
                              ),
                              const SizedBox(width: 8),
                              const Expanded(
                                child: Text(
                                  'Netflix Latinoamérica • YouTube • 2d',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 11.5),
                                ),
                              ),
                              const Icon(Icons.share_outlined, color: Color(0xFF9AA0A6), size: 18),
                              const SizedBox(width: 8),
                              const Icon(Icons.more_vert_rounded, color: Color(0xFF9AA0A6), size: 18),
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
              ],
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildGoogleLetter(String letter, Color color) {
    return Text(
      letter,
      style: TextStyle(
        color: color,
        fontSize: 44,
        fontWeight: FontWeight.w600,
        fontFamily: 'sans-serif',
      ),
    );
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

  Widget _buildShortcutItem({
    required Widget iconWidget,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      borderRadius: BorderRadius.circular(12),
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.all(6),
        child: Column(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFF282A2D),
                border: Border.all(color: const Color(0xFF3C4043), width: 0.8),
              ),
              child: iconWidget,
            ),
            const SizedBox(height: 6),
            Text(
              label,
              style: const TextStyle(
                color: Color(0xFFE8EAED),
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
