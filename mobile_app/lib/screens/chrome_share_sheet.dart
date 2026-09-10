import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class ChromeShareSheet extends StatelessWidget {
  final String title;
  final String url;
  final VoidCallback? onFullScreenshot;
  final VoidCallback? onPrint;

  const ChromeShareSheet({
    super.key,
    required this.title,
    required this.url,
    this.onFullScreenshot,
    this.onPrint,
  });

  static void show(BuildContext context, {
    required String title,
    required String url,
    VoidCallback? onFullScreenshot,
    VoidCallback? onPrint,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF242528),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => ChromeShareSheet(
        title: title,
        url: url,
        onFullScreenshot: onFullScreenshot,
        onPrint: onPrint,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 10, 16, 28),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Barra de arrastre superior
          Center(
            child: Container(
              width: 36,
              height: 4,
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: const Color(0xFF5F6368),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),

          // Título de la hoja
          const Text(
            'Compartiendo enlace',
            style: TextStyle(
              color: Color(0xFFE8EAED),
              fontSize: 19,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 16),

          // Tarjeta de previsualización del enlace
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF333538),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: const Color(0xFF424549),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Center(
                    child: Icon(Icons.public_rounded, color: Color(0xFF8AB4F8), size: 24),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title.isEmpty ? 'Página web' : title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: Color(0xFFE8EAED),
                          fontSize: 14.5,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        url,
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
                IconButton(
                  icon: const Icon(Icons.copy_rounded, color: Color(0xFFE8EAED), size: 20),
                  splashRadius: 20,
                  onPressed: () {
                    Clipboard.setData(ClipboardData(text: url));
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Enlace copiado: $url'),
                        duration: const Duration(seconds: 2),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Píldoras de acción rápida horizontales
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildActionPill(
                  icon: Icons.crop_free_rounded,
                  label: 'Captura completa',
                  onTap: () {
                    Navigator.pop(context);
                    if (onFullScreenshot != null) {
                      onFullScreenshot!();
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Captura completa guardada en Galería')),
                      );
                    }
                  },
                ),
                const SizedBox(width: 10),
                _buildActionPill(
                  icon: Icons.print_rounded,
                  label: 'Imprimir',
                  onTap: () {
                    Navigator.pop(context);
                    if (onPrint != null) {
                      onPrint!();
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Preparando documento para imprimir...')),
                      );
                    }
                  },
                ),
                const SizedBox(width: 10),
                _buildActionPill(
                  icon: Icons.devices_rounded,
                  label: 'Enviar a tus dispositivos',
                  onTap: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Enviado a DESKTOP-4DLEUHD (Windows)')),
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Fila de Contactos sugeridos recientes
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildContactAvatar(name: 'LUCERO_ROP...', badgeApp: 'wa', color: Colors.purple.shade300),
                const SizedBox(width: 16),
                _buildContactAvatar(name: 'SHEIN venta...', badgeApp: 'wa', color: Colors.teal.shade300),
                const SizedBox(width: 16),
                _buildContactAvatar(name: 'Lucero.Ropa...', badgeApp: 'wa', color: Colors.pink.shade300),
                const SizedBox(width: 16),
                _buildContactAvatar(name: 'SSAMIRA XI...', badgeApp: 'gmail', color: Colors.orange.shade300),
                const SizedBox(width: 16),
                _buildContactAvatar(name: 'info@univ...', badgeApp: 'gmail', color: Colors.blue.shade300),
              ],
            ),
          ),

          const Divider(color: Color(0xFF3C4043), height: 32),

          // Fila de aplicaciones para compartir
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildAppShareItem(
                  icon: Icons.sync_alt_rounded,
                  iconBg: const Color(0xFF1A73E8),
                  label: 'Quick Share',
                  onTap: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Buscando dispositivos Quick Share cercanos...')),
                    );
                  },
                ),
                const SizedBox(width: 18),
                _buildAppShareItem(
                  icon: Icons.share_rounded,
                  iconBg: const Color(0xFF00897B),
                  label: 'Xiaomi Share',
                  onTap: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Iniciando Mi Share...')),
                    );
                  },
                ),
                const SizedBox(width: 18),
                _buildAppShareItem(
                  icon: Icons.chat_rounded,
                  iconBg: const Color(0xFF25D366),
                  label: 'WhatsApp',
                  onTap: () {
                    Navigator.pop(context);
                    Clipboard.setData(ClipboardData(text: url));
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Compartiendo "$title" en WhatsApp...')),
                    );
                  },
                ),
                const SizedBox(width: 18),
                _buildAppShareItem(
                  icon: Icons.add_to_drive_rounded,
                  iconBg: const Color(0xFFF4B400),
                  label: 'Drive',
                  onTap: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Guardando enlace en Google Drive...')),
                    );
                  },
                ),
                const SizedBox(width: 18),
                _buildAppShareItem(
                  icon: Icons.more_horiz_rounded,
                  iconBg: const Color(0xFF5F6368),
                  label: 'Más',
                  onTap: () {
                    Navigator.pop(context);
                    Clipboard.setData(ClipboardData(text: url));
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Enlace copiado para compartir')),
                    );
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionPill({required IconData icon, required String label, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: const Color(0xFF333538),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFF424549), width: 1),
        ),
        child: Row(
          children: [
            Icon(icon, color: const Color(0xFFC4C7C5), size: 18),
            const SizedBox(width: 8),
            Text(
              label,
              style: const TextStyle(
                color: Color(0xFFE8EAED),
                fontSize: 12.5,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContactAvatar({required String name, required String badgeApp, required Color color}) {
    return Column(
      children: [
        Stack(
          children: [
            CircleAvatar(
              radius: 26,
              backgroundColor: color.withOpacity(0.35),
              child: Text(
                name.substring(0, 1).toUpperCase(),
                style: TextStyle(color: color, fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ),
            Positioned(
              right: 0,
              bottom: 0,
              child: Container(
                width: 18,
                height: 18,
                decoration: BoxDecoration(
                  color: badgeApp == 'wa' ? const Color(0xFF25D366) : const Color(0xFFEA4335),
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFF242528), width: 2),
                ),
                child: Icon(
                  badgeApp == 'wa' ? Icons.chat : Icons.mail,
                  color: Colors.white,
                  size: 9,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        SizedBox(
          width: 68,
          child: Text(
            name,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: Color(0xFF9AA0A6),
              fontSize: 10.5,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildAppShareItem({
    required IconData icon,
    required Color iconBg,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Column(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: iconBg,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Center(
              child: Icon(icon, color: Colors.white, size: 26),
            ),
          ),
          const SizedBox(height: 6),
          SizedBox(
            width: 64,
            child: Text(
              label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Color(0xFFC4C7C5),
                fontSize: 11.5,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
