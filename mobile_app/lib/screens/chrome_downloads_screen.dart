import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ChromeDownloadItem {
  final String id;
  final String title;
  final String url;
  final String domain;
  final String size;
  final String category; // 'Documentos', 'Imágenes', 'Páginas', 'Audio', 'Vídeos', 'Otro'
  final DateTime date;

  ChromeDownloadItem({
    required this.id,
    required this.title,
    required this.url,
    required this.domain,
    required this.size,
    required this.category,
    required this.date,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'url': url,
    'domain': domain,
    'size': size,
    'category': category,
    'date': date.toIso8601String(),
  };

  factory ChromeDownloadItem.fromJson(Map<String, dynamic> json) => ChromeDownloadItem(
    id: json['id'] ?? DateTime.now().millisecondsSinceEpoch.toString(),
    title: json['title'] ?? 'Archivo descargado',
    url: json['url'] ?? '',
    domain: json['domain'] ?? 'google.com',
    size: json['size'] ?? '1.2 MB',
    category: json['category'] ?? 'Otro',
    date: json['date'] != null ? DateTime.parse(json['date']) : DateTime.now(),
  );
}

class ChromeDownloadsScreen extends StatefulWidget {
  const ChromeDownloadsScreen({Key? key}) : super(key: key);

  @override
  State<ChromeDownloadsScreen> createState() => _ChromeDownloadsScreenState();
}

class _ChromeDownloadsScreenState extends State<ChromeDownloadsScreen> {
  final List<ChromeDownloadItem> _items = [];
  String _selectedCategory = 'Todo';
  bool _isSearching = false;
  final TextEditingController _searchCtrl = TextEditingController();
  String _searchQuery = '';

  final List<String> _categories = [
    'Todo',
    'Imágenes',
    'Páginas',
    'Audio',
    'Vídeos',
    'Documentos',
    'Otro',
  ];

  @override
  void initState() {
    super.initState();
    _loadDownloads();
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadDownloads() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final list = prefs.getStringList('chrome_downloads_items');
      if (list != null && list.isNotEmpty) {
        _items.clear();
        for (final s in list) {
          try {
            final item = ChromeDownloadItem.fromJson(jsonDecode(s));
            if (!item.url.contains('mtc.gob.pe') && !item.url.contains('minsa.gob.pe')) {
              _items.add(item);
            }
          } catch (_) {}
        }
      }
      if (mounted) setState(() {});
    } catch (_) {}
  }

  Future<void> _saveDownloads() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final list = _items.map((e) => jsonEncode(e.toJson())).toList();
      await prefs.setStringList('chrome_downloads_items', list);
    } catch (_) {}
  }

  void _deleteItem(String id) {
    setState(() {
      _items.removeWhere((item) => item.id == id);
    });
    _saveDownloads();
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Descarga eliminada'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  IconData _getCategoryIcon(String cat) {
    switch (cat) {
      case 'Documentos':
        return Icons.description_rounded;
      case 'Imágenes':
        return Icons.image_rounded;
      case 'Páginas':
        return Icons.language_rounded;
      case 'Audio':
        return Icons.audiotrack_rounded;
      case 'Vídeos':
        return Icons.videocam_rounded;
      default:
        return Icons.insert_drive_file_rounded;
    }
  }

  Color _getCategoryColor(String cat) {
    switch (cat) {
      case 'Documentos':
        return const Color(0xFFEA4335); // Rojo PDF
      case 'Imágenes':
        return const Color(0xFF34A853); // Verde imagen
      case 'Páginas':
        return const Color(0xFF8AB4F8); // Azul Google
      case 'Audio':
        return const Color(0xFFFBBC04); // Amarillo
      case 'Vídeos':
        return const Color(0xFFFF6D00); // Naranja
      default:
        return const Color(0xFF9AA0A6);
    }
  }

  @override
  Widget build(BuildContext context) {
    final filteredItems = _items.where((item) {
      final matchesCategory = _selectedCategory == 'Todo' || item.category == _selectedCategory;
      final matchesQuery = _searchQuery.isEmpty ||
          item.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          item.domain.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFF1F1F1F),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1F1F1F),
        elevation: 0,
        leading: _isSearching
            ? IconButton(
                icon: const Icon(Icons.arrow_back_rounded, color: Color(0xFFE8EAED)),
                onPressed: () {
                  setState(() {
                    _isSearching = false;
                    _searchQuery = '';
                    _searchCtrl.clear();
                  });
                },
              )
            : null,
        title: _isSearching
            ? TextField(
                controller: _searchCtrl,
                autofocus: true,
                style: const TextStyle(color: Color(0xFFE8EAED), fontSize: 16),
                decoration: const InputDecoration(
                  hintText: 'Buscar en descargas...',
                  hintStyle: TextStyle(color: Color(0xFF8E918F), fontSize: 15),
                  border: InputBorder.none,
                ),
                onChanged: (val) {
                  setState(() {
                    _searchQuery = val;
                  });
                },
              )
            : const Text(
                'Descargas',
                style: TextStyle(
                  color: Color(0xFFE8EAED),
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                ),
              ),
        actions: [
          if (!_isSearching)
            IconButton(
              icon: const Icon(Icons.search_rounded, color: Color(0xFFC4C7C5)),
              onPressed: () {
                setState(() {
                  _isSearching = true;
                });
              },
            ),
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: Color(0xFFC4C7C5)),
            onPressed: () {
              _showDownloadSettings(context);
            },
          ),
          IconButton(
            icon: const Icon(Icons.close_rounded, color: Color(0xFFC4C7C5)),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
      body: Column(
        children: [
          // Barra de almacenamiento idéntica al screenshot
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: const [
                    Text(
                      'Usando 73,84 MB de 241,88 GB',
                      style: TextStyle(
                        color: Color(0xFFE8EAED),
                        fontSize: 13.5,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                // Barra de progreso multi-color
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: Container(
                    height: 5,
                    color: const Color(0xFF3C4043),
                    child: Row(
                      children: [
                        // Descargas Chrome (Azul)
                        Container(
                          width: 35,
                          color: const Color(0xFF8AB4F8),
                        ),
                        const SizedBox(width: 2),
                        // Otros archivos (Gris claro)
                        Container(
                          width: 80,
                          color: const Color(0xFF9AA0A6),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Chips de categorías horizontales (Todo, Imágenes, Páginas, etc.)
          SizedBox(
            height: 44,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _categories.length,
              separatorBuilder: (ctx, i) => const SizedBox(width: 8),
              itemBuilder: (ctx, i) {
                final cat = _categories[i];
                final isSelected = _selectedCategory == cat;
                return ChoiceChip(
                  label: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (isSelected) ...[
                        const Icon(Icons.check_rounded, size: 16, color: Color(0xFF8AB4F8)),
                        const SizedBox(width: 4),
                      ],
                      Text(
                        cat,
                        style: TextStyle(
                          color: isSelected ? const Color(0xFF8AB4F8) : const Color(0xFFC4C7C5),
                          fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                  selected: isSelected,
                  onSelected: (selected) {
                    if (selected) {
                      setState(() {
                        _selectedCategory = cat;
                      });
                    }
                  },
                  backgroundColor: const Color(0xFF282A2D),
                  selectedColor: const Color(0xFF283A4F),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                    side: BorderSide(
                      color: isSelected ? const Color(0xFF8AB4F8) : const Color(0xFF3C4043),
                      width: 1,
                    ),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                );
              },
            ),
          ),

          const SizedBox(height: 8),

          // Lista de descargas agrupadas
          Expanded(
            child: filteredItems.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Icon(Icons.download_done_rounded, color: Color(0xFF5F6368), size: 54),
                        SizedBox(height: 14),
                        Text(
                          'Los archivos que descargues aparecerán aquí',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Color(0xFFE8EAED), fontSize: 15, fontWeight: FontWeight.w500),
                        ),
                        SizedBox(height: 6),
                        Text(
                          'Puedes descargar páginas web, fotos y otros archivos',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 13),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    itemCount: filteredItems.length,
                    itemBuilder: (ctx, i) {
                      final item = filteredItems[i];
                      return _buildDownloadItemCard(item);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildDownloadItemCard(ChromeDownloadItem item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF282A2D),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF3C4043), width: 0.8),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: _getCategoryColor(item.category).withOpacity(0.15),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: _getCategoryColor(item.category).withOpacity(0.3),
              width: 1,
            ),
          ),
          child: Icon(
            _getCategoryIcon(item.category),
            color: _getCategoryColor(item.category),
            size: 24,
          ),
        ),
        title: Text(
          item.title,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
            color: Color(0xFFE8EAED),
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Text(
            '${item.size} • ${item.domain}',
            style: const TextStyle(
              color: Color(0xFF9AA0A6),
              fontSize: 12,
            ),
          ),
        ),
        trailing: PopupMenuButton<String>(
          icon: const Icon(Icons.more_vert_rounded, color: Color(0xFF9AA0A6), size: 20),
          color: const Color(0xFF282A2D),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          onSelected: (val) {
            if (val == 'delete') {
              _deleteItem(item.id);
            } else if (val == 'share') {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Compartiendo ${item.title}...')),
              );
            }
          },
          itemBuilder: (ctx) => [
            const PopupMenuItem(
              value: 'share',
              child: Row(
                children: [
                  Icon(Icons.share_outlined, color: Color(0xFFC4C7C5), size: 18),
                  SizedBox(width: 10),
                  Text('Compartir', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 13)),
                ],
              ),
            ),
            const PopupMenuItem(
              value: 'delete',
              child: Row(
                children: [
                  Icon(Icons.delete_outline_rounded, color: Color(0xFFF28B82), size: 18),
                  SizedBox(width: 10),
                  Text('Eliminar', style: TextStyle(color: Color(0xFFF28B82), fontSize: 13)),
                ],
              ),
            ),
          ],
        ),
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Abriendo ${item.title}...')),
          );
        },
      ),
    );
  }

  void _showDownloadSettings(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF282A2D),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
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
            const Text(
              'Configuración de descargas',
              style: TextStyle(
                color: Color(0xFFE8EAED),
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 16),
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Ubicación de las descargas', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 14)),
              subtitle: const Text('/storage/emulated/0/Download', style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 12)),
              trailing: const Icon(Icons.folder_open_rounded, color: Color(0xFF8AB4F8)),
              onTap: () => Navigator.pop(ctx),
            ),
            const Divider(color: Color(0xFF3C4043)),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Preguntar dónde guardar los archivos', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 14)),
              subtitle: const Text('Confirmar ruta antes de comenzar la descarga', style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 12)),
              value: false,
              activeColor: const Color(0xFF8AB4F8),
              onChanged: (v) {},
            ),
          ],
        ),
      ),
    );
  }
}
