import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class BookmarkItem {
  final String id;
  String title;
  String url;
  String folder; // 'mobile', 'other', 'reading_list'
  DateTime date;

  BookmarkItem({
    required this.id,
    required this.title,
    required this.url,
    this.folder = 'mobile',
    DateTime? date,
  }) : date = date ?? DateTime.now();

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'url': url,
    'folder': folder,
    'date': date.toIso8601String(),
  };

  factory BookmarkItem.fromJson(Map<String, dynamic> json) => BookmarkItem(
    id: json['id'] ?? DateTime.now().millisecondsSinceEpoch.toString(),
    title: json['title'] ?? 'Marcador',
    url: json['url'] ?? '',
    folder: json['folder'] ?? 'mobile',
    date: json['date'] != null ? DateTime.parse(json['date']) : DateTime.now(),
  );
}

class ChromeBookmarksScreen extends StatefulWidget {
  final Function(String url) onSelectUrl;

  const ChromeBookmarksScreen({
    super.key,
    required this.onSelectUrl,
  });

  @override
  State<ChromeBookmarksScreen> createState() => _ChromeBookmarksScreenState();
}

class _ChromeBookmarksScreenState extends State<ChromeBookmarksScreen> {
  final List<BookmarkItem> _bookmarks = [];
  final TextEditingController _searchCtrl = TextEditingController();
  String _searchQuery = '';
  String? _currentFolder; // null = vista de carpetas raíz

  @override
  void initState() {
    super.initState();
    _loadBookmarks();
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadBookmarks() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final list = prefs.getStringList('chrome_full_bookmarks_list');
      if (list != null && list.isNotEmpty) {
        _bookmarks.clear();
        for (final s in list) {
          try {
            _bookmarks.add(BookmarkItem.fromJson(jsonDecode(s)));
          } catch (_) {}
        }
      } else {
        _seedInitialBookmarks();
      }
      if (mounted) setState(() {});
    } catch (_) {
      _seedInitialBookmarks();
    }
  }

  void _seedInitialBookmarks() {
    _bookmarks.clear();
    // 7 marcadores de móvil
    _bookmarks.addAll([
      BookmarkItem(id: 'b1', title: 'Examen de Reglas MTC - Balotario Oficial', url: 'https://portal.mtc.gob.pe/transportes/terrestre/licencias/balotario.html', folder: 'mobile'),
      BookmarkItem(id: 'b2', title: 'Simulacro de Examen Teórico MTC', url: 'https://sierdgtt.mtc.gob.pe/', folder: 'mobile'),
      BookmarkItem(id: 'b3', title: 'Google', url: 'https://www.google.com', folder: 'mobile'),
      BookmarkItem(id: 'b4', title: 'Plataforma Única del Estado Peruano', url: 'https://www.gob.pe/', folder: 'mobile'),
      BookmarkItem(id: 'b5', title: 'Reglamento Nacional de Tránsito TUO', url: 'https://transparencia.mtc.gob.pe/normas_transito', folder: 'mobile'),
      BookmarkItem(id: 'b6', title: 'SUNARP - Consulta Vehicular', url: 'https://www.sunarp.gob.pe/', folder: 'mobile'),
      BookmarkItem(id: 'b7', title: 'SAT Lima - Consulta de Papeletas', url: 'https://www.sat.gob.pe/', folder: 'mobile'),
      
      // 3 en otros marcadores
      BookmarkItem(id: 'b8', title: 'Guía Clínica de Neumología 2024', url: 'https://minsa.gob.pe/normas/neumologia.pdf', folder: 'other'),
      BookmarkItem(id: 'b9', title: 'ChatGPT / Gemini AI', url: 'https://gemini.google.com', folder: 'other'),
      BookmarkItem(id: 'b10', title: 'GitHub - josebacilio2004/touchid_appmovil', url: 'https://github.com/josebacilio2004/touchid_appmovil', folder: 'other'),
    ]);
    _saveBookmarks();
  }

  Future<void> _saveBookmarks() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final list = _bookmarks.map((e) => jsonEncode(e.toJson())).toList();
      await prefs.setStringList('chrome_full_bookmarks_list', list);
    } catch (_) {}
  }

  int _getCount(String folder) {
    return _bookmarks.where((b) => b.folder == folder).length;
  }

  void _deleteBookmark(String id) {
    setState(() {
      _bookmarks.removeWhere((b) => b.id == id);
    });
    _saveBookmarks();
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Marcador eliminado'), duration: Duration(seconds: 2)),
    );
  }

  void _showAddFolderDialog() {
    final TextEditingController nameCtrl = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF282A2D),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Nueva carpeta', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 18)),
        content: TextField(
          controller: nameCtrl,
          autofocus: true,
          style: const TextStyle(color: Color(0xFFE8EAED)),
          decoration: const InputDecoration(
            hintText: 'Nombre de la carpeta',
            hintStyle: TextStyle(color: Color(0xFF8E918F)),
            focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF8AB4F8))),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancelar', style: TextStyle(color: Color(0xFF8AB4F8))),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Carpeta "${nameCtrl.text}" creada')),
              );
            },
            child: const Text('Guardar', style: TextStyle(color: Color(0xFF8AB4F8), fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool isInsideFolder = _currentFolder != null;
    final folderName = _currentFolder == 'mobile'
        ? 'Marcadores de móvil'
        : _currentFolder == 'other'
            ? 'Otros marcadores'
            : 'Lista de lectura';

    return Scaffold(
      backgroundColor: const Color(0xFF141518),
      appBar: AppBar(
        backgroundColor: const Color(0xFF141518),
        elevation: 0,
        leading: isInsideFolder
            ? IconButton(
                icon: const Icon(Icons.arrow_back_rounded, color: Color(0xFFE8EAED)),
                onPressed: () => setState(() => _currentFolder = null),
              )
            : null,
        title: Text(
          isInsideFolder ? folderName : 'Marcadores',
          style: const TextStyle(
            color: Color(0xFFE8EAED),
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list_rounded, color: Color(0xFFC4C7C5)),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Ordenado por fecha más reciente')),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.create_new_folder_outlined, color: Color(0xFFC4C7C5)),
            onPressed: _showAddFolderDialog,
          ),
          IconButton(
            icon: const Icon(Icons.close_rounded, color: Color(0xFFC4C7C5)),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
      body: Column(
        children: [
          // Barra de búsqueda idéntica a la captura
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Container(
              height: 48,
              decoration: BoxDecoration(
                color: const Color(0xFF232528),
                borderRadius: BorderRadius.circular(24),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 16),
              alignment: Alignment.centerLeft,
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _searchCtrl,
                      style: const TextStyle(color: Color(0xFFE8EAED), fontSize: 15),
                      decoration: const InputDecoration(
                        hintText: 'Buscar en tus marcadores',
                        hintStyle: TextStyle(color: Color(0xFF8E918F), fontSize: 14.5),
                        border: InputBorder.none,
                        isDense: true,
                      ),
                      onChanged: (val) {
                        setState(() {
                          _searchQuery = val.trim().toLowerCase();
                        });
                      },
                    ),
                  ),
                  if (_searchCtrl.text.isNotEmpty)
                    GestureDetector(
                      onTap: () {
                        _searchCtrl.clear();
                        setState(() {
                          _searchQuery = '';
                        });
                      },
                      child: const Icon(Icons.close_rounded, color: Color(0xFF9AA0A6), size: 20),
                    ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 12),

          // Contenido: Lista de Carpetas O Lista de Marcadores de la Carpeta
          Expanded(
            child: _searchQuery.isNotEmpty
                ? _buildSearchResults()
                : isInsideFolder
                    ? _buildFolderItemsList(_currentFolder!)
                    : _buildFoldersList(),
          ),
        ],
      ),
    );
  }

  Widget _buildFoldersList() {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      children: [
        _buildFolderCard(
          icon: Icons.folder_outlined,
          title: 'Marcadores de móvil',
          count: _getCount('mobile'),
          onTap: () => setState(() => _currentFolder = 'mobile'),
        ),
        const SizedBox(height: 14),
        _buildFolderCard(
          icon: Icons.folder_outlined,
          title: 'Otros marcadores',
          count: _getCount('other'),
          onTap: () => setState(() => _currentFolder = 'other'),
        ),
        const SizedBox(height: 14),
        _buildFolderCard(
          icon: Icons.list_alt_rounded,
          title: 'Lista de lectura',
          count: _getCount('reading_list'),
          onTap: () => setState(() => _currentFolder = 'reading_list'),
        ),
      ],
    );
  }

  Widget _buildFolderCard({
    required IconData icon,
    required String title,
    required int count,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Row(
        children: [
          // Contenedor azul cuadrado con esquinas redondeadas y contador en esquina
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              color: const Color(0xFF283A60),
              borderRadius: BorderRadius.circular(18),
            ),
            child: Stack(
              children: [
                Center(
                  child: Icon(icon, color: const Color(0xFFD2E3FC), size: 28),
                ),
                Positioned(
                  right: 10,
                  bottom: 8,
                  child: Text(
                    '$count',
                    style: const TextStyle(
                      color: Color(0xFFD2E3FC),
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Text(
              title,
              style: const TextStyle(
                color: Color(0xFFE8EAED),
                fontSize: 16,
                fontWeight: FontWeight.w400,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFolderItemsList(String folder) {
    final items = _bookmarks.where((b) => b.folder == folder).toList();

    if (items.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Icon(Icons.bookmark_border_rounded, color: Color(0xFF5F6368), size: 48),
            SizedBox(height: 12),
            Text('No hay marcadores en esta carpeta', style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 14)),
          ],
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      itemCount: items.length,
      separatorBuilder: (ctx, i) => const Divider(color: Color(0xFF282A2D), height: 1),
      itemBuilder: (ctx, i) {
        final b = items[i];
        return _buildBookmarkRow(b);
      },
    );
  }

  Widget _buildSearchResults() {
    final results = _bookmarks
        .where((b) => b.title.toLowerCase().contains(_searchQuery) || b.url.toLowerCase().contains(_searchQuery))
        .toList();

    if (results.isEmpty) {
      return Center(
        child: Text(
          'No se encontraron marcadores para "$_searchQuery"',
          style: const TextStyle(color: Color(0xFF9AA0A6), fontSize: 14),
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      itemCount: results.length,
      separatorBuilder: (ctx, i) => const Divider(color: Color(0xFF282A2D), height: 1),
      itemBuilder: (ctx, i) => _buildBookmarkRow(results[i]),
    );
  }

  Widget _buildBookmarkRow(BookmarkItem b) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(vertical: 4),
      leading: Container(
        width: 38,
        height: 38,
        decoration: BoxDecoration(
          color: const Color(0xFF282A2D),
          borderRadius: BorderRadius.circular(8),
        ),
        child: const Icon(Icons.language_rounded, color: Color(0xFF8AB4F8), size: 20),
      ),
      title: Text(
        b.title,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: const TextStyle(color: Color(0xFFE8EAED), fontSize: 14.5, fontWeight: FontWeight.w400),
      ),
      subtitle: Text(
        b.url,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: const TextStyle(color: Color(0xFF9AA0A6), fontSize: 12),
      ),
      trailing: PopupMenuButton<String>(
        icon: const Icon(Icons.more_vert_rounded, color: Color(0xFF9AA0A6), size: 20),
        color: const Color(0xFF282A2D),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        onSelected: (val) {
          if (val == 'delete') {
            _deleteBookmark(b.id);
          } else if (val == 'edit') {
            _showEditBookmarkDialog(b);
          }
        },
        itemBuilder: (ctx) => [
          const PopupMenuItem(
            value: 'edit',
            child: Row(
              children: [
                Icon(Icons.edit_outlined, color: Color(0xFFC4C7C5), size: 18),
                SizedBox(width: 10),
                Text('Editar', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 13)),
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
        widget.onSelectUrl(b.url);
        Navigator.pop(context);
      },
    );
  }

  void _showEditBookmarkDialog(BookmarkItem b) {
    final TextEditingController titleCtrl = TextEditingController(text: b.title);
    final TextEditingController urlCtrl = TextEditingController(text: b.url);

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF282A2D),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Editar marcador', style: TextStyle(color: Color(0xFFE8EAED), fontSize: 17)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: titleCtrl,
              style: const TextStyle(color: Color(0xFFE8EAED), fontSize: 14),
              decoration: const InputDecoration(
                labelText: 'Nombre',
                labelStyle: TextStyle(color: Color(0xFF8E918F)),
                focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF8AB4F8))),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: urlCtrl,
              style: const TextStyle(color: Color(0xFFE8EAED), fontSize: 14),
              decoration: const InputDecoration(
                labelText: 'URL',
                labelStyle: TextStyle(color: Color(0xFF8E918F)),
                focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF8AB4F8))),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancelar', style: TextStyle(color: Color(0xFF8AB4F8))),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                b.title = titleCtrl.text;
                b.url = urlCtrl.text;
              });
              _saveBookmarks();
              Navigator.pop(ctx);
            },
            child: const Text('Guardar', style: TextStyle(color: Color(0xFF8AB4F8), fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
