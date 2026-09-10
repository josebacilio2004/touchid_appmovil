import 'package:flutter/material.dart';
import '../widgets/incognito_icon.dart';

class ChromeNewTabScreen extends StatelessWidget {
  final Function(String) onOpenUrl;
  final VoidCallback onSearchTap;
  final VoidCallback onModoIA;
  final VoidCallback onOpenIncognito;
  final String lastVisitedTitle;
  final String lastVisitedUrl;

  const ChromeNewTabScreen({
    super.key,
    required this.onOpenUrl,
    required this.onSearchTap,
    required this.onModoIA,
    required this.onOpenIncognito,
    this.lastVisitedTitle = 'Examen de Reglas MTC Perú - Simulacro Oficial',
    this.lastVisitedUrl = 'https://sierdgtt.mtc.gob.pe/',
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF141518),
      child: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
        children: [
          const SizedBox(height: 24),

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

          // 4. Accesos Directos (Shortcuts)
          Container(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildShortcutItem(
                  iconWidget: Container(
                    decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFFC5221F)),
                    child: const Center(
                      child: Text('I', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
                    ),
                  ),
                  label: 'ICPNARC I...',
                  onTap: () => onOpenUrl('https://icpna.edu.pe'),
                ),
                _buildShortcutItem(
                  iconWidget: Container(
                    decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFF1A73E8)),
                    child: const Center(
                      child: Text('MTC', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                    ),
                  ),
                  label: 'Inicio',
                  onTap: () => onOpenUrl('https://sierdgtt.mtc.gob.pe/'),
                ),
                _buildShortcutItem(
                  iconWidget: Container(
                    decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFF10A37F)),
                    child: const Center(
                      child: Icon(Icons.chat_bubble_outline_rounded, color: Colors.white, size: 20),
                    ),
                  ),
                  label: 'ChatGPT',
                  onTap: () => onOpenUrl('https://chatgpt.com'),
                ),
                _buildShortcutItem(
                  iconWidget: Container(
                    decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFF1A73E8)),
                    child: const Center(
                      child: Text('G', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
                    ),
                  ),
                  label: 'Acceso Ind...',
                  onTap: () => onOpenUrl('https://accounts.google.com'),
                ),
                _buildShortcutItem(
                  iconWidget: Container(
                    decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFF2D8CFF)),
                    child: const Center(
                      child: Icon(Icons.videocam_rounded, color: Colors.white, size: 20),
                    ),
                  ),
                  label: 'Reuni...',
                  onTap: () => onOpenUrl('https://meet.google.com'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // 5. Sección: Continuar con esta pestaña
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
                        width: 58,
                        height: 58,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF6B21A8), Color(0xFF3B82F6)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Center(
                          child: Icon(Icons.description_outlined, color: Colors.white, size: 28),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              lastVisitedTitle,
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
