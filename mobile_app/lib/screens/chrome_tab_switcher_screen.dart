import 'package:flutter/material.dart';
import '../widgets/incognito_icon.dart';
import 'browser_screen.dart';

class ChromeTabSwitcherScreen extends StatefulWidget {
  final List<BrowserTab> regularTabs;
  final List<BrowserTab> incognitoTabs;
  final int currentRegularIndex;
  final int currentIncognitoIndex;
  final bool initialIsIncognito;
  final Function(int, bool) onSelectTab;
  final Function(int, bool) onCloseTab;
  final Function(bool) onAddNewTab;
  final Function(bool) onCloseAllTabs;

  const ChromeTabSwitcherScreen({
    super.key,
    required this.regularTabs,
    required this.incognitoTabs,
    required this.currentRegularIndex,
    required this.currentIncognitoIndex,
    this.initialIsIncognito = false,
    required this.onSelectTab,
    required this.onCloseTab,
    required this.onAddNewTab,
    required this.onCloseAllTabs,
  });

  @override
  State<ChromeTabSwitcherScreen> createState() => _ChromeTabSwitcherScreenState();
}

class _ChromeTabSwitcherScreenState extends State<ChromeTabSwitcherScreen> {
  late bool _isIncognitoView;
  final TextEditingController _searchCtrl = TextEditingController();
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _isIncognitoView = widget.initialIsIncognito;
    _searchCtrl.addListener(() {
      setState(() {
        _searchQuery = _searchCtrl.text.trim().toLowerCase();
      });
    });
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final activeList = _isIncognitoView ? widget.incognitoTabs : widget.regularTabs;
    final activeIndex = _isIncognitoView ? widget.currentIncognitoIndex : widget.currentRegularIndex;

    final filteredIndices = <int>[];
    for (int i = 0; i < activeList.length; i++) {
      final tab = activeList[i];
      if (_searchQuery.isEmpty ||
          tab.title.toLowerCase().contains(_searchQuery) ||
          tab.url.toLowerCase().contains(_searchQuery)) {
        filteredIndices.add(i);
      }
    }

    return Scaffold(
      backgroundColor: const Color(0xFF141518),
      body: SafeArea(
        child: Column(
          children: [
            // 1. Top Bar del Tab Switcher
            Container(
              height: 56,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Botón Nueva Pestaña [+] en caja redondeada celeste
                  InkWell(
                    borderRadius: BorderRadius.circular(16),
                    onTap: () {
                      widget.onAddNewTab(_isIncognitoView);
                      Navigator.pop(context);
                    },
                    child: Container(
                      width: 42,
                      height: 42,
                      decoration: BoxDecoration(
                        color: const Color(0xFF8AB4F8),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: const Center(
                        child: Icon(Icons.add_rounded, color: Color(0xFF141518), size: 26),
                      ),
                    ),
                  ),

                  // Conmutador Central: [Pestañas Regulares N] vs [Incógnito]
                  Container(
                    height: 38,
                    padding: const EdgeInsets.all(3),
                    decoration: BoxDecoration(
                      color: const Color(0xFF282A2D),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Botón Pestañas Regulares
                        GestureDetector(
                          onTap: () => setState(() => _isIncognitoView = false),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                            decoration: BoxDecoration(
                              color: !_isIncognitoView ? const Color(0xFF3C4043) : Colors.transparent,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 20,
                                  height: 20,
                                  decoration: BoxDecoration(
                                    border: Border.all(
                                      color: !_isIncognitoView ? const Color(0xFFE8EAED) : const Color(0xFF9AA0A6),
                                      width: 1.5,
                                    ),
                                    borderRadius: BorderRadius.circular(5),
                                  ),
                                  child: Center(
                                    child: Text(
                                      '${widget.regularTabs.isNotEmpty ? widget.regularTabs.length : 1}',
                                      style: TextStyle(
                                        color: !_isIncognitoView ? const Color(0xFFE8EAED) : const Color(0xFF9AA0A6),
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),

                        // Botón Pestañas de Incógnito
                        GestureDetector(
                          onTap: () => setState(() => _isIncognitoView = true),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                            decoration: BoxDecoration(
                              color: _isIncognitoView ? const Color(0xFF3C4043) : Colors.transparent,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Row(
                              children: [
                                IncognitoIcon(
                                  size: 19,
                                  color: _isIncognitoView ? const Color(0xFFE8EAED) : const Color(0xFF9AA0A6),
                                ),
                                if (widget.incognitoTabs.isNotEmpty) ...[
                                  const SizedBox(width: 5),
                                  Text(
                                    '${widget.incognitoTabs.length}',
                                    style: TextStyle(
                                      color: _isIncognitoView ? const Color(0xFFE8EAED) : const Color(0xFF9AA0A6),
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Menú de Tres Puntos
                  PopupMenuButton<String>(
                    icon: const Icon(Icons.more_vert_rounded, color: Color(0xFFE8EAED), size: 24),
                    color: const Color(0xFF282A2D),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    onSelected: (value) {
                      if (value == 'close_all') {
                        widget.onCloseAllTabs(_isIncognitoView);
                        Navigator.pop(context);
                      } else if (value == 'new_tab') {
                        widget.onAddNewTab(_isIncognitoView);
                        Navigator.pop(context);
                      }
                    },
                    itemBuilder: (ctx) => [
                      PopupMenuItem(
                        value: 'new_tab',
                        child: Text(
                          _isIncognitoView ? 'Nueva pestaña de incógnito' : 'Nueva pestaña',
                          style: const TextStyle(color: Color(0xFFE8EAED), fontSize: 14),
                        ),
                      ),
                      PopupMenuItem(
                        value: 'close_all',
                        child: Text(
                          _isIncognitoView ? 'Cerrar pestañas de incógnito' : 'Cerrar todas las pestañas',
                          style: const TextStyle(color: Color(0xFFE8EAED), fontSize: 14),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),

            // 2. Barra de Búsqueda: "Busca en tus pestañas"
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Container(
                height: 46,
                decoration: BoxDecoration(
                  color: const Color(0xFF282A2D),
                  borderRadius: BorderRadius.circular(24),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    const Icon(Icons.search_rounded, color: Color(0xFF9AA0A6), size: 20),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextField(
                        controller: _searchCtrl,
                        style: const TextStyle(color: Color(0xFFE8EAED), fontSize: 14.5),
                        decoration: const InputDecoration(
                          hintText: 'Busca en tus pestañas',
                          hintStyle: TextStyle(color: Color(0xFF9AA0A6), fontSize: 14.5),
                          border: InputBorder.none,
                          isDense: true,
                        ),
                      ),
                    ),
                    if (_searchQuery.isNotEmpty)
                      GestureDetector(
                        onTap: () => _searchCtrl.clear(),
                        child: const Icon(Icons.close_rounded, color: Color(0xFF9AA0A6), size: 18),
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // 3. Grid de Pestañas en 2 Columnas
            Expanded(
              child: activeList.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          if (_isIncognitoView)
                            const IncognitoIcon(size: 56, color: Color(0xFF5F6368))
                          else
                            const Icon(Icons.tab_unselected_rounded, size: 56, color: Color(0xFF5F6368)),
                          const SizedBox(height: 16),
                          Text(
                            _isIncognitoView
                                ? 'No tienes pestañas de incógnito abiertas'
                                : 'No tienes pestañas abiertas',
                            style: const TextStyle(color: Color(0xFF9AA0A6), fontSize: 15),
                          ),
                          const SizedBox(height: 16),
                          ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF8AB4F8),
                              foregroundColor: const Color(0xFF141518),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                            ),
                            icon: const Icon(Icons.add_rounded, size: 18),
                            label: Text(_isIncognitoView ? 'Abrir pestaña de incógnito' : 'Abrir nueva pestaña'),
                            onPressed: () {
                              widget.onAddNewTab(_isIncognitoView);
                              Navigator.pop(context);
                            },
                          ),
                        ],
                      ),
                    )
                  : GridView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 14,
                        mainAxisSpacing: 14,
                        childAspectRatio: 0.72, // Relación de aspecto idéntica a Google Chrome Mobile
                      ),
                      itemCount: filteredIndices.length,
                      itemBuilder: (context, gridIndex) {
                        final realIndex = filteredIndices[gridIndex];
                        final tab = activeList[realIndex];
                        final isSelected = realIndex == activeIndex;

                        return _buildTabCard(
                          tab: tab,
                          isSelected: isSelected,
                          onTap: () {
                            widget.onSelectTab(realIndex, _isIncognitoView);
                            Navigator.pop(context);
                          },
                          onClose: () {
                            widget.onCloseTab(realIndex, _isIncognitoView);
                            setState(() {});
                          },
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTabCard({
    required BrowserTab tab,
    required bool isSelected,
    required VoidCallback onTap,
    required VoidCallback onClose,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        decoration: BoxDecoration(
          color: const Color(0xFF282A2D),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: isSelected ? const Color(0xFF8AB4F8) : const Color(0xFF3C4043),
            width: isSelected ? 2.5 : 1.0,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: const Color(0xFF8AB4F8).withOpacity(0.25),
                    blurRadius: 10,
                    spreadRadius: 1,
                  )
                ]
              : null,
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          children: [
            // Cabecera de la tarjeta: Favicon + Título + Botón Cerrar [X]
            Container(
              height: 40,
              padding: const EdgeInsets.symmetric(horizontal: 10),
              color: const Color(0xFF202124),
              child: Row(
                children: [
                  // Favicon
                  if (tab.isIncognito)
                    const IncognitoIcon(size: 16, color: Color(0xFF9AA0A6))
                  else if (tab.url.contains('google.com'))
                    const Icon(Icons.search_rounded, size: 16, color: Color(0xFF8AB4F8))
                  else if (tab.url.contains('mtc.gob.pe'))
                    Container(
                      width: 16,
                      height: 16,
                      decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFFC5221F)),
                      child: const Center(
                        child: Text('M', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                    )
                  else
                    const Icon(Icons.language_rounded, size: 16, color: Color(0xFF9AA0A6)),
                  const SizedBox(width: 8),

                  // Título de la pestaña
                  Expanded(
                    child: Text(
                      tab.title.isNotEmpty ? tab.title : 'Nueva pestaña',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        color: isSelected ? const Color(0xFF8AB4F8) : const Color(0xFFE8EAED),
                        fontSize: 12.5,
                        fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                      ),
                    ),
                  ),

                  // Botón Cerrar [X]
                  InkWell(
                    borderRadius: BorderRadius.circular(14),
                    onTap: onClose,
                    child: const Padding(
                      padding: EdgeInsets.all(4),
                      child: Icon(Icons.close_rounded, color: Color(0xFF9AA0A6), size: 16),
                    ),
                  ),
                ],
              ),
            ),

            // Cuerpo / Miniatura de la tarjeta
            Expanded(
              child: Container(
                color: const Color(0xFF141518),
                child: _buildCardThumbnail(tab),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCardThumbnail(BrowserTab tab) {
    if (tab.isIncognito && (tab.url.isEmpty || tab.url.startsWith('chrome://') || tab.url.contains('google.com'))) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFF282A2D)),
              child: const Center(child: IncognitoIcon(size: 24, color: Color(0xFF9AA0A6))),
            ),
            const SizedBox(height: 8),
            const Text(
              'Modo Incógnito',
              style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 11, fontWeight: FontWeight.w500),
            ),
          ],
        ),
      );
    }

    if (tab.url.contains('sierdgtt.mtc.gob.pe') || tab.url.contains('mtc')) {
      return Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 18,
              padding: const EdgeInsets.symmetric(horizontal: 6),
              decoration: BoxDecoration(
                color: const Color(0xFFC5221F).withOpacity(0.2),
                borderRadius: BorderRadius.circular(4),
              ),
              child: const Text('MTC Perú • Simulacro', style: TextStyle(color: Color(0xFFF28B82), fontSize: 9.5)),
            ),
            const SizedBox(height: 12),
            const Center(
              child: Icon(Icons.assignment_turned_in_rounded, size: 38, color: Color(0xFF8AB4F8)),
            ),
            const Spacer(),
            Text(
              tab.title,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(color: Color(0xFFE8EAED), fontSize: 11),
            ),
          ],
        ),
      );
    }

    // Default New Tab preview
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Center(
            child: Text(
              'Google',
              style: TextStyle(
                color: Color(0xFF5F6368),
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(height: 10),
          Container(
            height: 22,
            decoration: BoxDecoration(
              color: const Color(0xFF282A2D),
              borderRadius: BorderRadius.circular(11),
            ),
            child: const Center(
              child: Text(
                'Buscar en Google...',
                style: TextStyle(color: Color(0xFF5F6368), fontSize: 9.5),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
