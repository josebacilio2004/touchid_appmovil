import 'package:flutter/material.dart';

class ChromeClearDataDialog extends StatefulWidget {
  final Future<void> Function({
    required bool clearHistory,
    required bool clearCookies,
    required bool clearCache,
    required String timeRange,
  }) onConfirm;

  const ChromeClearDataDialog({
    Key? key,
    required this.onConfirm,
  }) : super(key: key);

  @override
  State<ChromeClearDataDialog> createState() => _ChromeClearDataDialogState();
}

class _ChromeClearDataDialogState extends State<ChromeClearDataDialog> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _timeRange = 'Desde siempre';
  bool _clearHistory = true;
  bool _clearCookies = true;
  bool _clearCache = true;
  bool _isClearing = false;

  final List<String> _timeRanges = [
    'Últimos 15 minutos',
    'Última hora',
    'Últimas 24 horas',
    'Últimos 7 días',
    'Últimas 4 semanas',
    'Desde siempre',
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: const Color(0xFF282A2D),
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 420),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Borrar datos de navegación',
                style: TextStyle(
                  color: Color(0xFFE8EAED),
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 16),

              // Pestañas Básicas / Avanzadas
              TabBar(
                controller: _tabController,
                indicatorColor: const Color(0xFF8AB4F8),
                indicatorWeight: 3,
                labelColor: const Color(0xFF8AB4F8),
                unselectedLabelColor: const Color(0xFF9AA0A6),
                labelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                tabs: const [
                  Tab(text: 'Básicas'),
                  Tab(text: 'Avanzadas'),
                ],
              ),
              const SizedBox(height: 16),

              // Selector de intervalo de tiempo
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Intervalo de tiempo',
                    style: TextStyle(color: Color(0xFFE8EAED), fontSize: 13.5),
                  ),
                  DropdownButton<String>(
                    value: _timeRange,
                    dropdownColor: const Color(0xFF2B2D30),
                    underline: const SizedBox(),
                    icon: const Icon(Icons.arrow_drop_down, color: Color(0xFF8AB4F8)),
                    style: const TextStyle(color: Color(0xFF8AB4F8), fontSize: 13.5, fontWeight: FontWeight.w500),
                    items: _timeRanges.map((val) {
                      return DropdownMenuItem<String>(
                        value: val,
                        child: Text(val),
                      );
                    }).toList(),
                    onChanged: (newVal) {
                      if (newVal != null) {
                        setState(() {
                          _timeRange = newVal;
                        });
                      }
                    },
                  ),
                ],
              ),
              const SizedBox(height: 8),

              // Opciones con Checkboxes
              _buildOption(
                icon: Icons.history_rounded,
                title: 'Historial de navegación',
                subtitle: 'Borra el historial de todos los dispositivos sincronizados.',
                value: _clearHistory,
                onChanged: (v) => setState(() => _clearHistory = v ?? false),
              ),
              _buildOption(
                icon: Icons.cookie_outlined,
                title: 'Cookies y datos de sitios',
                subtitle: 'Cierra la sesión en la mayoría de los sitios web.',
                value: _clearCookies,
                onChanged: (v) => setState(() => _clearCookies = v ?? false),
              ),
              _buildOption(
                icon: Icons.cached_rounded,
                title: 'Archivos e imágenes almacenados en caché',
                subtitle: 'Libera memoria caché. Es posible que algunos sitios carguen más lento.',
                value: _clearCache,
                onChanged: (v) => setState(() => _clearCache = v ?? false),
              ),

              const SizedBox(height: 12),
              const Text(
                'Para borrar tu actividad de la cuenta de Google, visita myactivity.google.com.',
                style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 11, height: 1.3),
              ),
              const SizedBox(height: 24),

              // Botones de acción
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: _isClearing ? null : () => Navigator.pop(context),
                    style: TextButton.styleFrom(
                      foregroundColor: const Color(0xFF8AB4F8),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    ),
                    child: const Text('Cancelar', style: TextStyle(fontWeight: FontWeight.w600)),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: _isClearing || (!_clearHistory && !_clearCookies && !_clearCache)
                        ? null
                        : () async {
                            final nav = Navigator.of(context);
                            setState(() => _isClearing = true);
                            await widget.onConfirm(
                              clearHistory: _clearHistory,
                              clearCookies: _clearCookies,
                              clearCache: _clearCache,
                              timeRange: _timeRange,
                            );
                            if (mounted) nav.pop();
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF8AB4F8),
                      foregroundColor: const Color(0xFF1F1F1F),
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      elevation: 0,
                    ),
                    child: _isClearing
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF1F1F1F)),
                          )
                        : const Text(
                            'Borrar datos',
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOption({
    required IconData icon,
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool?> onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Icon(icon, color: const Color(0xFF9AA0A6), size: 22),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Color(0xFFE8EAED),
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(
                    color: Color(0xFF9AA0A6),
                    fontSize: 12,
                    height: 1.25,
                  ),
                ),
              ],
            ),
          ),
          Checkbox(
            value: value,
            activeColor: const Color(0xFF8AB4F8),
            checkColor: const Color(0xFF1F1F1F),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }
}
