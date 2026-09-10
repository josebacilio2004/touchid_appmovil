import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class ChromeHistoryItem {
  final String id;
  final String title;
  final String url;
  final DateTime timestamp;

  ChromeHistoryItem({
    String? id,
    required this.title,
    required this.url,
    required this.timestamp,
  }) : id = id ?? '${timestamp.millisecondsSinceEpoch}_${url.hashCode}';

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'url': url,
        'timestamp': timestamp.toIso8601String(),
      };

  factory ChromeHistoryItem.fromJson(Map<String, dynamic> json) =>
      ChromeHistoryItem(
        id: json['id'],
        title: json['title'] ?? '',
        url: json['url'] ?? '',
        timestamp: json['timestamp'] != null
            ? DateTime.parse(json['timestamp'])
            : DateTime.now(),
      );
}

class ChromeHistoryScreen extends StatefulWidget {
  final List<ChromeHistoryItem> history;
  final Function(String url) onSelectUrl;
  final Function(String id) onDeleteItem;
  final VoidCallback onClearAll;

  const ChromeHistoryScreen({
    super.key,
    required this.history,
    required this.onSelectUrl,
    required this.onDeleteItem,
    required this.onClearAll,
  });

  @override
  State<ChromeHistoryScreen> createState() => _ChromeHistoryScreenState();
}

class _ChromeHistoryScreenState extends State<ChromeHistoryScreen> {
  bool _isSearching = false;
  final TextEditingController _searchCtrl = TextEditingController();
  String _searchQuery = '';

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  String _extractDomain(String url) {
    try {
      final uri = Uri.parse(url);
      if (uri.host.isNotEmpty) {
        return uri.host;
      }
    } catch (_) {}
    return url;
  }

  String _formatDateHeader(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final itemDate = DateTime(date.year, date.month, date.day);
    final difference = today.difference(itemDate).inDays;

    const months = [
      'ene',
      'feb',
      'mar',
      'abr',
      'may',
      'jun',
      'jul',
      'ago',
      'sept',
      'oct',
      'nov',
      'dic'
    ];
    final monthStr = months[date.month - 1];
    final dateStr = '${date.day} $monthStr ${date.year}';

    if (difference == 0) {
      return 'Hoy - $dateStr';
    } else if (difference == 1) {
      return 'Ayer - $dateStr';
    } else {
      return dateStr;
    }
  }

  void _showClearBrowsingDataDialog() {
    String selectedTimeRange = 'always';
    bool clearHistory = true;
    bool clearCookies = true;
    bool clearCache = true;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF202124),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDlgState) => Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  decoration: BoxDecoration(
                    color: const Color(0xFF5F6368),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 18),
              const Text(
                'Borrar datos de navegación',
                style: TextStyle(
                  color: Color(0xFFE8EAED),
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Intervalo de tiempo',
                    style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 13),
                  ),
                  DropdownButton<String>(
                    value: selectedTimeRange,
                    dropdownColor: const Color(0xFF282A2D),
                    underline: const SizedBox(),
                    style: const TextStyle(color: Color(0xFF8AB4F8), fontSize: 13),
                    items: const [
                      DropdownMenuItem(
                        value: 'hour',
                        child: Text('Última hora'),
                      ),
                      DropdownMenuItem(
                        value: 'day',
                        child: Text('Últimas 24 horas'),
                      ),
                      DropdownMenuItem(
                        value: 'week',
                        child: Text('Últimos 7 días'),
                      ),
                      DropdownMenuItem(
                        value: 'always',
                        child: Text('Desde siempre'),
                      ),
                    ],
                    onChanged: (val) {
                      if (val != null) {
                        setDlgState(() => selectedTimeRange = val);
                      }
                    },
                  ),
                ],
              ),
              const Divider(color: Color(0xFF3C4043), height: 20),
              CheckboxListTile(
                contentPadding: EdgeInsets.zero,
                value: clearHistory,
                activeColor: const Color(0xFF8AB4F8),
                checkColor: const Color(0xFF131314),
                title: const Text(
                  'Historial de navegación',
                  style: TextStyle(color: Color(0xFFE8EAED), fontSize: 14),
                ),
                subtitle: const Text(
                  'Borra el historial de todos los dispositivos sincronizados',
                  style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 12),
                ),
                onChanged: (val) => setDlgState(() => clearHistory = val ?? true),
              ),
              CheckboxListTile(
                contentPadding: EdgeInsets.zero,
                value: clearCookies,
                activeColor: const Color(0xFF8AB4F8),
                checkColor: const Color(0xFF131314),
                title: const Text(
                  'Cookies y datos de sitios',
                  style: TextStyle(color: Color(0xFFE8EAED), fontSize: 14),
                ),
                subtitle: const Text(
                  'Cierra sesión en la mayoría de los sitios web',
                  style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 12),
                ),
                onChanged: (val) => setDlgState(() => clearCookies = val ?? true),
              ),
              CheckboxListTile(
                contentPadding: EdgeInsets.zero,
                value: clearCache,
                activeColor: const Color(0xFF8AB4F8),
                checkColor: const Color(0xFF131314),
                title: const Text(
                  'Archivos e imágenes en caché',
                  style: TextStyle(color: Color(0xFFE8EAED), fontSize: 14),
                ),
                subtitle: const Text(
                  'Libera espacio de almacenamiento local',
                  style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 12),
                ),
                onChanged: (val) => setDlgState(() => clearCache = val ?? true),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => Navigator.pop(ctx),
                    child: const Text('Cancelar',
                        style: TextStyle(color: Color(0xFF9AA0A6))),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF8AB4F8),
                      foregroundColor: const Color(0xFF131314),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(18),
                      ),
                    ),
                    onPressed: () {
                      Navigator.pop(ctx);
                      widget.onClearAll();
                      setState(() {});
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Datos de navegación borrados'),
                          backgroundColor: Color(0xFF1E8E3E),
                          duration: Duration(seconds: 2),
                        ),
                      );
                    },
                    child: const Text('Borrar datos'),
                  ),
                ],
              ),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFavicon(String url, String domain) {
    final isGoogle = domain.contains('google.com');

    return Container(
      width: 40,
      height: 40,
      decoration: const BoxDecoration(
        color: Color(0xFF282A2D),
        shape: BoxShape.circle,
      ),
      child: Center(
        child: isGoogle
            ? _buildGoogleIcon()
            : ClipOval(
                child: Image.network(
                  'https://www.google.com/s2/favicons?domain=$domain&sz=64',
                  width: 20,
                  height: 20,
                  fit: BoxFit.contain,
                  errorBuilder: (context, error, stackTrace) {
                    final initial = domain.isNotEmpty
                        ? domain.replaceAll(RegExp(r'^www\.'), '')[0].toUpperCase()
                        : '?';
                    return Text(
                      initial,
                      style: const TextStyle(
                        color: Color(0xFF8AB4F8),
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    );
                  },
                ),
              ),
      ),
    );
  }

  Widget _buildGoogleIcon() {
    return Container(
      width: 20,
      height: 20,
      alignment: Alignment.center,
      child: const Text(
        'G',
        style: TextStyle(
          color: Color(0xFF8AB4F8),
          fontSize: 16,
          fontWeight: FontWeight.w800,
          fontFamily: 'sans-serif',
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // Filtrar elementos si hay búsqueda activa
    final filteredHistory = widget.history.where((item) {
      if (_searchQuery.isEmpty) return true;
      final query = _searchQuery.toLowerCase();
      return item.title.toLowerCase().contains(query) ||
          item.url.toLowerCase().contains(query);
    }).toList();

    // Agrupar por fecha
    final Map<String, List<ChromeHistoryItem>> groupedHistory = {};
    for (final item in filteredHistory) {
      final header = _formatDateHeader(item.timestamp);
      if (!groupedHistory.containsKey(header)) {
        groupedHistory[header] = [];
      }
      groupedHistory[header]!.add(item);
    }

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: Color(0xFF131314),
        statusBarIconBrightness: Brightness.light,
        systemNavigationBarColor: Color(0xFF131314),
        systemNavigationBarIconBrightness: Brightness.light,
      ),
      child: Scaffold(
        backgroundColor: const Color(0xFF131314),
        body: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Barra superior idéntica a Google Chrome
              Container(
                height: 56,
                padding: const EdgeInsets.symmetric(horizontal: 8),
                child: _isSearching
                    ? Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.arrow_back_rounded,
                                color: Color(0xFFC4C7C5), size: 24),
                            onPressed: () {
                              setState(() {
                                _isSearching = false;
                                _searchQuery = '';
                                _searchCtrl.clear();
                              });
                            },
                          ),
                          Expanded(
                            child: TextField(
                              controller: _searchCtrl,
                              autofocus: true,
                              style: const TextStyle(
                                  color: Color(0xFFE8EAED), fontSize: 16),
                              decoration: const InputDecoration(
                                hintText: 'Buscar en el historial',
                                hintStyle: TextStyle(
                                    color: Color(0xFF9AA0A6), fontSize: 16),
                                border: InputBorder.none,
                              ),
                              onChanged: (val) {
                                setState(() {
                                  _searchQuery = val.trim();
                                });
                              },
                            ),
                          ),
                          if (_searchQuery.isNotEmpty)
                            IconButton(
                              icon: const Icon(Icons.close_rounded,
                                  color: Color(0xFFC4C7C5), size: 22),
                              onPressed: () {
                                setState(() {
                                  _searchCtrl.clear();
                                  _searchQuery = '';
                                });
                              },
                            ),
                        ],
                      )
                    : Row(
                        children: [
                          const SizedBox(width: 8),
                          const Text(
                            'Historial',
                            style: TextStyle(
                              color: Color(0xFFE8EAED),
                              fontSize: 22,
                              fontWeight: FontWeight.w400,
                              letterSpacing: 0.1,
                            ),
                          ),
                          const Spacer(),
                          IconButton(
                            icon: const Icon(Icons.search_rounded,
                                color: Color(0xFFC4C7C5), size: 24),
                            onPressed: () {
                              setState(() {
                                _isSearching = true;
                              });
                            },
                          ),
                          IconButton(
                            icon: const Icon(Icons.close_rounded,
                                color: Color(0xFFC4C7C5), size: 24),
                            onPressed: () => Navigator.pop(context),
                          ),
                        ],
                      ),
              ),

              // Cabecera descriptiva y enlace de borrado (solo visible si no está buscando)
              if (!_isSearching) ...[
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Es posible que veas el historial de otras aplicaciones que abren enlaces en Chrome.',
                        style: TextStyle(
                          color: Color(0xFF9AA0A6),
                          fontSize: 14,
                          height: 1.35,
                        ),
                      ),
                      const SizedBox(height: 14),
                      GestureDetector(
                        onTap: _showClearBrowsingDataDialog,
                        child: const Text(
                          'Eliminar datos de navegación...',
                          style: TextStyle(
                            color: Color(0xFF8AB4F8),
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),
                    ],
                  ),
                ),
              ],

              // Lista de historial agrupada por fechas
              Expanded(
                child: groupedHistory.isEmpty
                    ? Center(
                        child: Text(
                          _searchQuery.isNotEmpty
                              ? 'No se encontraron resultados para "$_searchQuery"'
                              : 'No hay historial disponible',
                          style: const TextStyle(
                            color: Color(0xFF9AA0A6),
                            fontSize: 14,
                          ),
                        ),
                      )
                    : ListView.builder(
                        itemCount: groupedHistory.keys.length,
                        itemBuilder: (context, groupIndex) {
                          final header = groupedHistory.keys.elementAt(groupIndex);
                          final items = groupedHistory[header]!;

                          return Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Encabezado de fecha
                              Padding(
                                padding: const EdgeInsets.only(
                                  left: 16,
                                  right: 16,
                                  top: 18,
                                  bottom: 10,
                                ),
                                child: Text(
                                  header,
                                  style: const TextStyle(
                                    color: Color(0xFF9AA0A6),
                                    fontSize: 13.5,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),

                              // Elementos de ese día
                              ...items.map((item) {
                                final domain = _extractDomain(item.url);
                                return InkWell(
                                  onTap: () {
                                    widget.onSelectUrl(item.url);
                                    Navigator.pop(context);
                                  },
                                  child: Padding(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 16,
                                      vertical: 10,
                                    ),
                                    child: Row(
                                      children: [
                                        _buildFavicon(item.url, domain),
                                        const SizedBox(width: 14),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                item.title.isNotEmpty
                                                    ? item.title
                                                    : item.url,
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                                style: const TextStyle(
                                                  color: Color(0xFFE8EAED),
                                                  fontSize: 14.5,
                                                  fontWeight: FontWeight.w400,
                                                ),
                                              ),
                                              const SizedBox(height: 2),
                                              Text(
                                                domain,
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                                style: const TextStyle(
                                                  color: Color(0xFF9AA0A6),
                                                  fontSize: 12.5,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        GestureDetector(
                                          behavior: HitTestBehavior.opaque,
                                          onTap: () {
                                            widget.onDeleteItem(item.id);
                                            setState(() {});
                                          },
                                          child: const Padding(
                                            padding: EdgeInsets.all(8),
                                            child: Icon(
                                              Icons.cancel,
                                              color: Color(0xFF9AA0A6),
                                              size: 20,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              }),
                            ],
                          );
                        },
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
