import 'package:flutter/material.dart';

class ChromeAddShortcutDialog extends StatefulWidget {
  final String title;
  final String url;
  final String? faviconUrl;

  const ChromeAddShortcutDialog({
    super.key,
    required this.title,
    required this.url,
    this.faviconUrl,
  });

  static Future<bool?> show(BuildContext context, {
    required String title,
    required String url,
    String? faviconUrl,
  }) {
    return showDialog<bool>(
      context: context,
      barrierColor: Colors.black.withOpacity(0.65),
      builder: (ctx) => ChromeAddShortcutDialog(
        title: title,
        url: url,
        faviconUrl: faviconUrl,
      ),
    );
  }

  @override
  State<ChromeAddShortcutDialog> createState() => _ChromeAddShortcutDialogState();
}

class _ChromeAddShortcutDialogState extends State<ChromeAddShortcutDialog> {
  late TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    String initialText = widget.title.trim();
    if (initialText.isEmpty || initialText == 'about:blank' || initialText.startsWith('http')) {
      try {
        final uri = Uri.parse(widget.url);
        initialText = uri.host.isNotEmpty ? uri.host : 'Página web';
      } catch (_) {
        initialText = 'Página web';
      }
    }
    _controller = TextEditingController(text: initialText);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: const Color(0xFF282A2D),
      elevation: 6,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
      ),
      insetPadding: const EdgeInsets.symmetric(horizontal: 28, vertical: 24),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(24, 24, 24, 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Crear acceso directo',
              style: TextStyle(
                color: Color(0xFFE8EAED),
                fontSize: 20,
                fontWeight: FontWeight.w400,
                letterSpacing: 0.15,
              ),
            ),
            const SizedBox(height: 24),
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: const BoxDecoration(
                    color: Color(0xFF3C4043),
                    shape: BoxShape.circle,
                  ),
                  clipBehavior: Clip.antiAlias,
                  child: widget.faviconUrl != null && widget.faviconUrl!.isNotEmpty
                      ? Image.network(
                          widget.faviconUrl!,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => const Center(
                            child: Icon(Icons.language_rounded, color: Color(0xFFE8EAED), size: 20),
                          ),
                        )
                      : const Center(
                          child: Icon(Icons.language_rounded, color: Color(0xFFE8EAED), size: 20),
                        ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: TextField(
                    controller: _controller,
                    autofocus: true,
                    style: const TextStyle(
                      color: Color(0xFFE8EAED),
                      fontSize: 15,
                    ),
                    cursorColor: const Color(0xFF8AB4F8),
                    decoration: const InputDecoration(
                      isDense: true,
                      contentPadding: EdgeInsets.symmetric(vertical: 4),
                      enabledBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Color(0xFF8E918F), width: 1.0),
                      ),
                      focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Color(0xFF8AB4F8), width: 2.0),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 28),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () => Navigator.pop(context, false),
                  style: TextButton.styleFrom(
                    foregroundColor: const Color(0xFF8AB4F8),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  ),
                  child: const Text(
                    'Cancelar',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                TextButton(
                  onPressed: () {
                    Navigator.pop(context, true);
                  },
                  style: TextButton.styleFrom(
                    foregroundColor: const Color(0xFF8AB4F8),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  ),
                  child: const Text(
                    'Añadir',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
