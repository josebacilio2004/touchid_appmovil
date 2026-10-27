import 'package:flutter/material.dart';
import '../widgets/incognito_icon.dart';
import '../models/app_config.dart';
import 'browser_screen.dart';
import 'chrome_clear_data_dialog.dart';
import 'chrome_settings_screen.dart';

class TabGroupData {
  final String id;
  String title;
  final Color color;
  final List<String> tabIds;

  TabGroupData({
    required this.id,
    required this.title,
    required this.color,
    required this.tabIds,
  });
}

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
  final AppConfig? config;
  final Function(AppConfig)? onConfigSaved;

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
    this.config,
    this.onConfigSaved,
  });

  @override
  State<ChromeTabSwitcherScreen> createState() => _ChromeTabSwitcherScreenState();
}

class _ChromeTabSwitcherScreenState extends State<ChromeTabSwitcherScreen> {
  late bool _isIncognitoView;
  late List<BrowserTab> _localRegularTabs;
  late List<BrowserTab> _localIncognitoTabs;
  final List<TabGroupData> _tabGroups = [];
  final TextEditingController _searchCtrl = TextEditingController();
  String _searchQuery = '';
  bool _isSelectionMode = false;
  final Set<String> _selectedTabIds = {};
  bool _isGroupingView = false;

  @override
  void initState() {
    super.initState();
    _localRegularTabs = List.from(widget.regularTabs);
    _localIncognitoTabs = List.from(widget.incognitoTabs);
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

  void _handleCloseTab(int index, bool isIncog) {
    final list = isIncog ? _localIncognitoTabs : _localRegularTabs;
    if (index >= 0 && index < list.length) {
      final removed = list[index];
      setState(() {
        list.removeAt(index);
        for (var g in _tabGroups) {
          g.tabIds.remove(removed.id);
        }
        _tabGroups.removeWhere((g) => g.tabIds.length < 2);
        if (isIncog && _localIncognitoTabs.isEmpty) {
          _isIncognitoView = false;
        }
      });
      widget.onCloseTab(index, isIncog);
    }
  }

  void _createTabGroup() {
    if (_selectedTabIds.length < 2) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Selecciona al menos 2 pestañas para agrupar')),
      );
      return;
    }

    final colors = [
      const Color(0xFF0B57D0),
      const Color(0xFF1E8E3E),
      const Color(0xFFD93025),
      const Color(0xFFE37400),
      const Color(0xFF9334E6),
    ];
    final color = colors[_tabGroups.length % colors.length];

    setState(() {
      _tabGroups.add(TabGroupData(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        title: 'Grupo de ${_selectedTabIds.length} pestañas',
        color: color,
        tabIds: List.from(_selectedTabIds),
      ));
      _isSelectionMode = false;
      _selectedTabIds.clear();
      _isGroupingView = true;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Pestañas agrupadas con éxito'),
        backgroundColor: Color(0xFF0B57D0),
      ),
    );
  }

  void _showTabSwitcherMenu(BuildContext context) {
    showGeneralDialog(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'TabSwitcherMenu',
      barrierColor: Colors.black.withValues(alpha: 0.3),
      transitionDuration: const Duration(milliseconds: 200),
      transitionBuilder: (ctx, anim1, anim2, child) {
        return ScaleTransition(
          alignment: Alignment.topRight,
          scale: CurvedAnimation(parent: anim1, curve: Curves.easeOutCubic),
          child: FadeTransition(opacity: anim1, child: child),
        );
      },
      pageBuilder: (ctx, _, __) {
        return SafeArea(
          child: Align(
            alignment: Alignment.topRight,
            child: Container(
              width: 295,
              margin: const EdgeInsets.only(top: 52, right: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(26),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.15),
                    blurRadius: 20,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Material(
                color: Colors.transparent,
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // 1. Nueva pestaña (Captura 4)
                      _buildMenuItem(
                        icon: Icons.add_box_outlined,
                        title: 'Nueva pestaña',
                        onTap: () {
                          Navigator.pop(ctx);
                          widget.onAddNewTab(false);
                          Navigator.pop(context);
                        },
                      ),
                      // 2. Nueva pestaña de incógnito (Captura 4)
                      _buildMenuItem(
                        iconWidget: const IncognitoIcon(size: 20, color: Color(0xFF444746)),
                        title: 'Nueva pestaña de incógnito',
                        onTap: () {
                          Navigator.pop(ctx);
                          widget.onAddNewTab(true);
                          Navigator.pop(context);
                        },
                      ),
                      // 3. Nuevo grupo de pestañas (Captura 4)
                      _buildMenuItem(
                        icon: Icons.grid_view_rounded,
                        title: 'Nuevo grupo de pestañas',
                        onTap: () {
                          Navigator.pop(ctx);
                          setState(() {
                            _isSelectionMode = true;
                          });
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Selecciona las pestañas para crear el nuevo grupo'),
                              duration: Duration(seconds: 2),
                            ),
                          );
                        },
                      ),
                      // 4. Cerrar todas las pestañas (Captura 4)
                      _buildMenuItem(
                        icon: Icons.close_rounded,
                        title: 'Cerrar todas las pestañas',
                        onTap: () {
                          Navigator.pop(ctx);
                          _confirmCloseAllTabs();
                        },
                      ),
                      // 5. Seleccionar pestañas (Captura 4)
                      _buildMenuItem(
                        icon: Icons.check_box_outlined,
                        title: 'Seleccionar pestañas',
                        onTap: () {
                          Navigator.pop(ctx);
                          setState(() {
                            _isSelectionMode = !_isSelectionMode;
                            _selectedTabIds.clear();
                          });
                        },
                      ),
                      // 6. Borrar datos de navegación (Captura 4)
                      _buildMenuItem(
                        icon: Icons.delete_outline_rounded,
                        title: 'Borrar datos de navegación',
                        onTap: () {
                          Navigator.pop(ctx);
                          _showClearDataModal();
                        },
                      ),
                      // 7. Configuración (Captura 4)
                      _buildMenuItem(
                        icon: Icons.settings_outlined,
                        title: 'Configuración',
                        onTap: () {
                          Navigator.pop(ctx);
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => ChromeSettingsScreen(
                                config: widget.config,
                                onConfigSaved: widget.onConfigSaved,
                              ),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildMenuItem({
    IconData? icon,
    Widget? iconWidget,
    required String title,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
        child: Row(
          children: [
            iconWidget ?? Icon(icon, color: const Color(0xFF444746), size: 22),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  color: Color(0xFF1F1F1F),
                  fontSize: 15,
                  fontWeight: FontWeight.w400,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _confirmCloseAllTabs() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text(
          '¿Cerrar todas las pestañas?',
          style: TextStyle(color: Color(0xFF1F1F1F), fontSize: 18, fontWeight: FontWeight.bold),
        ),
        content: const Text(
          'Se cerrarán todas las pestañas abiertas y se iniciará una nueva pestaña limpia.',
          style: TextStyle(color: Color(0xFF444746), fontSize: 14),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancelar', style: TextStyle(color: Color(0xFF0B57D0))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFB3261E),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            onPressed: () {
              Navigator.pop(ctx);
              widget.onCloseAllTabs(_isIncognitoView);
              Navigator.pop(context);
            },
            child: const Text('Cerrar todas'),
          ),
        ],
      ),
    );
  }

  void _showClearDataModal() {
    showDialog(
      context: context,
      builder: (_) => ChromeClearDataDialog(
        onConfirm: ({
          required bool clearHistory,
          required bool clearCookies,
          required bool clearCache,
          required String timeRange,
        }) async {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Datos de navegación eliminados correctamente'),
              backgroundColor: Color(0xFF0B57D0),
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final hasIncognitoTabs = _localIncognitoTabs.isNotEmpty;
    final activeList = _isIncognitoView ? _localIncognitoTabs : _localRegularTabs;
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

    final totalCount = _localRegularTabs.isNotEmpty ? _localRegularTabs.length : 1;

    final isDark = _isIncognitoView && !_isGroupingView;
    final bgColor = isDark ? const Color(0xFF141518) : const Color(0xFFEDEFF6);
    final primaryTextColor = isDark ? const Color(0xFFE8EAED) : const Color(0xFF1F1F1F);
    final secondaryTextColor = isDark ? const Color(0xFF9AA0A6) : const Color(0xFF444746);
    final searchBgColor = isDark ? const Color(0xFF282A2D) : const Color(0xFFE0E3EB);

    return Scaffold(
      backgroundColor: bgColor,
      body: SafeArea(
        child: Column(
          children: [
            // 1. Top Bar del Tab Switcher (Captura 2 y Captura 3)
            Container(
              height: 58,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  // Botón Nueva Pestaña [+] en círculo
                  GestureDetector(
                    onTap: () {
                      widget.onAddNewTab(_isIncognitoView);
                      Navigator.pop(context);
                    },
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF2B2D30) : const Color(0xFF385E9D),
                        shape: BoxShape.circle,
                      ),
                      child: const Center(
                        child: Icon(Icons.add_rounded, color: Colors.white, size: 28),
                      ),
                    ),
                  ),

                  const Spacer(),

                  // Cápsula Segmentada Central (Captura 2 y Captura 3 de Chrome)
                  Container(
                    height: 38,
                    padding: const EdgeInsets.all(3),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF2B2D30) : const Color(0xFFDCE1EC),
                      borderRadius: BorderRadius.circular(19),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Pestaña Incógnito (si hay pestañas de incógnito abiertas o si está en vista incógnito)
                        if (hasIncognitoTabs || _isIncognitoView)
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                _isIncognitoView = true;
                                _isGroupingView = false;
                              });
                            },
                            child: Container(
                              height: 32,
                              padding: const EdgeInsets.symmetric(horizontal: 12),
                              decoration: BoxDecoration(
                                color: (_isIncognitoView && !_isGroupingView)
                                    ? (isDark ? const Color(0xFF3C4043) : Colors.white)
                                    : Colors.transparent,
                                borderRadius: BorderRadius.circular(16),
                                boxShadow: (_isIncognitoView && !_isGroupingView)
                                    ? [
                                        BoxShadow(
                                          color: Colors.black.withValues(alpha: 0.12),
                                          blurRadius: 4,
                                          offset: const Offset(0, 1),
                                        ),
                                      ]
                                    : null,
                              ),
                              child: Center(
                                child: IncognitoIcon(
                                  size: 18,
                                  color: (_isIncognitoView && !_isGroupingView)
                                      ? (isDark ? const Color(0xFFE8EAED) : const Color(0xFF1F1F1F))
                                      : (isDark ? const Color(0xFF9AA0A6) : const Color(0xFF5F6368)),
                                ),
                              ),
                            ),
                          ),

                        // Pestañas Regulares [N]
                        GestureDetector(
                          onTap: () {
                            setState(() {
                              _isIncognitoView = false;
                              _isGroupingView = false;
                            });
                          },
                          child: Container(
                            height: 32,
                            padding: const EdgeInsets.symmetric(horizontal: 14),
                            decoration: BoxDecoration(
                              color: (!_isIncognitoView && !_isGroupingView)
                                  ? Colors.white
                                  : Colors.transparent,
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: (!_isIncognitoView && !_isGroupingView)
                                  ? [
                                      BoxShadow(
                                        color: Colors.black.withValues(alpha: 0.12),
                                        blurRadius: 4,
                                        offset: const Offset(0, 1),
                                      ),
                                    ]
                                  : null,
                            ),
                            child: Center(
                              child: Container(
                                width: 20,
                                height: 20,
                                decoration: BoxDecoration(
                                  border: Border.all(
                                    color: (!_isIncognitoView && !_isGroupingView)
                                        ? const Color(0xFF1F1F1F)
                                        : (isDark ? const Color(0xFF9AA0A6) : const Color(0xFF5F6368)),
                                    width: 1.6,
                                  ),
                                  borderRadius: BorderRadius.circular(5.5),
                                ),
                                child: Center(
                                  child: Text(
                                    '$totalCount',
                                    style: TextStyle(
                                      color: (!_isIncognitoView && !_isGroupingView)
                                          ? const Color(0xFF1F1F1F)
                                          : (isDark ? const Color(0xFF9AA0A6) : const Color(0xFF5F6368)),
                                      fontSize: 10.5,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),

                        // Grupos de Pestañas ⊞ (Captura 2)
                        GestureDetector(
                          onTap: () {
                            setState(() {
                              _isGroupingView = true;
                            });
                          },
                          child: Container(
                            height: 32,
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            decoration: BoxDecoration(
                              color: _isGroupingView
                                  ? Colors.white
                                  : Colors.transparent,
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: _isGroupingView
                                  ? [
                                      BoxShadow(
                                        color: Colors.black.withValues(alpha: 0.12),
                                        blurRadius: 4,
                                        offset: const Offset(0, 1),
                                      ),
                                    ]
                                  : null,
                            ),
                            child: Center(
                              child: Icon(
                                Icons.grid_view_rounded,
                                color: _isGroupingView
                                    ? const Color(0xFF1F1F1F)
                                    : (isDark ? const Color(0xFF9AA0A6) : const Color(0xFF5F6368)),
                                size: 19,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const Spacer(),

                  // Menú de 3 puntos (Captura 3 / Captura 4)
                  IconButton(
                    icon: Icon(Icons.more_vert_rounded, color: secondaryTextColor, size: 24),
                    splashRadius: 20,
                    onPressed: () => _showTabSwitcherMenu(context),
                  ),
                ],
              ),
            ),

            // 2. Barra de Búsqueda: "Realiza búsquedas en las pestañas" (Captura 3)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              child: Container(
                height: 48,
                decoration: BoxDecoration(
                  color: searchBgColor,
                  borderRadius: BorderRadius.circular(24),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _searchCtrl,
                        style: TextStyle(color: primaryTextColor, fontSize: 15),
                        decoration: InputDecoration(
                          hintText: 'Realiza búsquedas en las pestañas',
                          hintStyle: TextStyle(
                            color: secondaryTextColor,
                            fontSize: 15,
                            fontWeight: FontWeight.w400,
                          ),
                          border: InputBorder.none,
                          isDense: true,
                          contentPadding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                      ),
                    ),
                    if (_searchQuery.isNotEmpty)
                      GestureDetector(
                        onTap: () => _searchCtrl.clear(),
                        child: Icon(Icons.close_rounded, color: secondaryTextColor, size: 20),
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 8),

            // Vista de Grupos de Pestañas (Captura 2)
            if (_isGroupingView)
              _buildTabGroupsEmptyView()
            else ...[
              // Barra de acción en Modo Selección
              if (_isSelectionMode)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  color: const Color(0xFFD3E3FD),
                  child: Row(
                    children: [
                      Text(
                        '${_selectedTabIds.length} seleccionadas',
                        style: const TextStyle(color: Color(0xFF041E49), fontWeight: FontWeight.bold),
                      ),
                      const Spacer(),
                      TextButton.icon(
                        icon: const Icon(Icons.grid_view_rounded, size: 18),
                        label: const Text('Agrupar'),
                        onPressed: _selectedTabIds.length < 2 ? null : _createTabGroup,
                      ),
                      TextButton.icon(
                        icon: const Icon(Icons.close_rounded, size: 18, color: Color(0xFFB3261E)),
                        label: const Text('Cerrar', style: TextStyle(color: Color(0xFFB3261E))),
                        onPressed: _selectedTabIds.isEmpty
                            ? null
                            : () {
                                for (var id in _selectedTabIds) {
                                  final idx = activeList.indexWhere((t) => t.id == id);
                                  if (idx != -1) widget.onCloseTab(idx, _isIncognitoView);
                                }
                                setState(() {
                                  _isSelectionMode = false;
                                  _selectedTabIds.clear();
                                });
                              },
                      ),
                    ],
                  ),
                ),

              // 3. Grid de Pestañas en 2 Columnas (Captura 3)
              Expanded(
                child: activeList.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            if (_isIncognitoView) ...[
                              const IncognitoIcon(size: 64, color: Color(0xFFC4C7C5)),
                              const SizedBox(height: 18),
                              const Text(
                                'No tienes pestañas de incógnito abiertas',
                                style: TextStyle(color: Color(0xFFE8EAED), fontSize: 16, fontWeight: FontWeight.w500),
                              ),
                              const SizedBox(height: 18),
                              ElevatedButton.icon(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF385E9D),
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                                ),
                                icon: const Icon(Icons.add_rounded, size: 18),
                                label: const Text('Nueva pestaña de incógnito'),
                                onPressed: () {
                                  widget.onAddNewTab(true);
                                  Navigator.pop(context);
                                },
                              ),
                            ] else ...[
                              const Icon(Icons.tab_unselected_rounded, size: 56, color: Color(0xFF747775)),
                              const SizedBox(height: 16),
                              const Text(
                                'No tienes pestañas abiertas',
                                style: TextStyle(color: Color(0xFF444746), fontSize: 16),
                              ),
                              const SizedBox(height: 16),
                              ElevatedButton.icon(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF385E9D),
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                                ),
                                icon: const Icon(Icons.add_rounded, size: 18),
                                label: const Text('Abrir nueva pestaña'),
                                onPressed: () {
                                  widget.onAddNewTab(false);
                                  Navigator.pop(context);
                                },
                              ),
                            ],
                          ],
                        ),
                      )
                    : GridView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 12,
                          childAspectRatio: 0.74, // Proporción exacta de tarjeta vertical Chrome Mobile
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
                              if (_isSelectionMode) {
                                setState(() {
                                  if (_selectedTabIds.contains(tab.id)) {
                                    _selectedTabIds.remove(tab.id);
                                  } else {
                                    _selectedTabIds.add(tab.id);
                                  }
                                });
                                return;
                              }
                              widget.onSelectTab(realIndex, _isIncognitoView);
                              Navigator.pop(context);
                            },
                            onClose: () => _handleCloseTab(realIndex, _isIncognitoView),
                          );
                        },
                      ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  // Vista vacía de Grupos de Pestañas idéntica a la Captura 2
  Widget _buildTabGroupsEmptyView() {
    if (_tabGroups.isNotEmpty) {
      return Expanded(
        child: ListView.builder(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          itemCount: _tabGroups.length,
          itemBuilder: (context, index) {
            final group = _tabGroups[index];
            final groupTabs = _localRegularTabs.where((t) => group.tabIds.contains(t.id)).toList();

            return Container(
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: group.color.withValues(alpha: 0.35), width: 1.5),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 12,
                        height: 12,
                        decoration: BoxDecoration(
                          color: group.color,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          group.title,
                          style: const TextStyle(
                            color: Color(0xFF1F1F1F),
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      Text(
                        '${groupTabs.length} pestañas',
                        style: const TextStyle(color: Color(0xFF747775), fontSize: 13),
                      ),
                      const SizedBox(width: 8),
                      IconButton(
                        icon: const Icon(Icons.close_rounded, color: Color(0xFF444746), size: 20),
                        onPressed: () {
                          setState(() {
                            _tabGroups.removeAt(index);
                          });
                        },
                      ),
                    ],
                  ),
                  const Divider(height: 18),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: groupTabs.map((t) {
                      return ActionChip(
                        avatar: const Icon(Icons.public_rounded, size: 16, color: Color(0xFF0B57D0)),
                        label: Text(
                          t.title.isNotEmpty ? t.title : 'Pestaña',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        backgroundColor: const Color(0xFFEDEFF6),
                        onPressed: () {
                          final realIdx = _localRegularTabs.indexWhere((tab) => tab.id == t.id);
                          if (realIdx != -1) {
                            widget.onSelectTab(realIdx, false);
                            Navigator.pop(context);
                          }
                        },
                      );
                    }).toList(),
                  ),
                ],
              ),
            );
          },
        ),
      );
    }

    return Expanded(
      child: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Ilustración tablet con 4 paneles de pestañas (Captura 2)
              Container(
                width: 90,
                height: 110,
                decoration: BoxDecoration(
                  color: const Color(0xFFC7D8F9),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFF85A7E9), width: 2.2),
                ),
                padding: const EdgeInsets.fromLTRB(10, 10, 10, 12),
                child: Column(
                  children: [
                    // Indicador de barra superior / cámara
                    Row(
                      children: [
                        Container(
                          width: 14,
                          height: 3,
                          decoration: BoxDecoration(
                            color: const Color(0xFF385E9D),
                            borderRadius: BorderRadius.circular(1.5),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    // 4 paneles agrupados
                    Expanded(
                      child: GridView.count(
                        crossAxisCount: 2,
                        crossAxisSpacing: 6,
                        mainAxisSpacing: 6,
                        physics: const NeverScrollableScrollPhysics(),
                        children: List.generate(4, (index) {
                          return Container(
                            decoration: BoxDecoration(
                              color: const Color(0xFF385E9D),
                              borderRadius: BorderRadius.circular(5.5),
                            ),
                          );
                        }),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 36),
              const Text(
                'Encontrarás tus grupos de pestañas aquí',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Color(0xFF1F1F1F),
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  letterSpacing: -0.2,
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Los grupos de pestañas se guardan y actualizan automáticamente en todos tus dispositivos',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Color(0xFF444746),
                  fontSize: 13.5,
                  height: 1.45,
                ),
              ),
              const SizedBox(height: 60),
            ],
          ),
        ),
      ),
    );
  }

  // Tarjeta de Pestaña según la Captura 3
  // IMPORTANTE: "no debe haber un enmarque en la pestaña que se situa el usuario"
  Widget _buildTabCard({
    required BrowserTab tab,
    required bool isSelected,
    required VoidCallback onTap,
    required VoidCallback onClose,
  }) {
    final bool isIncog = tab.isIncognito;
    final bool isNewTabPage = tab.url == 'chrome://newtab' || tab.url == 'about:blank' || tab.title == 'Nueva pestaña' || (isIncog && tab.url == 'chrome://incognito');
    final bool isSelectedInMultiMode = _selectedTabIds.contains(tab.id);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: isIncog ? const Color(0xFF282A2D) : Colors.white,
          borderRadius: BorderRadius.circular(22),
          // Borde sutil y limpio SIN enmarque azul invasivo para la pestaña activa
          border: Border.all(
            color: _isSelectionMode && isSelectedInMultiMode
                ? const Color(0xFF0B57D0)
                : Colors.black.withValues(alpha: 0.07),
            width: _isSelectionMode && isSelectedInMultiMode ? 2.0 : 1.0,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Cabecera de la Tarjeta
            Container(
              height: 42,
              color: isIncog ? const Color(0xFF2B2D30) : (isNewTabPage ? const Color(0xFF385E9D) : Colors.white),
              padding: const EdgeInsets.only(left: 10, right: 4),
              child: Row(
                children: [
                  if (_isSelectionMode)
                    Padding(
                      padding: const EdgeInsets.only(right: 6),
                      child: Icon(
                        isSelectedInMultiMode ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded,
                        color: isSelectedInMultiMode ? const Color(0xFF0B57D0) : const Color(0xFF747775),
                        size: 20,
                      ),
                    )
                  else ...[
                    if (isIncog)
                      const IncognitoIcon(size: 16, color: Color(0xFFC4C7C5))
                    else if (isNewTabPage)
                      const Icon(Icons.public_rounded, color: Colors.white, size: 18)
                    else
                      _buildFavicon(tab),
                    const SizedBox(width: 8),
                  ],
                  Expanded(
                    child: Text(
                      tab.title.isNotEmpty ? tab.title : (isNewTabPage ? 'Nueva pestaña' : 'Página web'),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        color: isIncog ? const Color(0xFFE8EAED) : (isNewTabPage ? Colors.white : const Color(0xFF1F1F1F)),
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: Icon(
                      Icons.close_rounded,
                      color: isIncog ? const Color(0xFFC4C7C5) : (isNewTabPage ? Colors.white : const Color(0xFF444746)),
                      size: 18,
                    ),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                    splashRadius: 16,
                    onPressed: onClose,
                  ),
                ],
              ),
            ),

            // Vista Previa de la Página Web (Mockup idéntico a las capturas)
            Expanded(
              child: Container(
                color: isIncog ? const Color(0xFF1F1F1F) : (isNewTabPage ? const Color(0xFFEDEFF6) : Colors.white),
                child: isNewTabPage
                    ? _buildNewTabPreviewMockup()
                    : _buildPageContentPreview(tab),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFavicon(BrowserTab tab) {
    if (tab.url.contains('google.com')) {
      return SizedBox(
        width: 16,
        height: 16,
        child: CustomPaint(painter: _MiniGoogleGPainter()),
      );
    }
    return const Icon(Icons.public_rounded, color: Color(0xFF444746), size: 16);
  }

  // Vista previa realista de la Nueva Pestaña (Captura 3, tarjeta inferior izquierda)
  Widget _buildNewTabPreviewMockup() {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Logo Google en miniatura
          RichText(
            text: const TextSpan(
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
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
          const SizedBox(height: 10),
          // Barra de búsqueda miniatura
          Container(
            height: 22,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(11),
              border: Border.all(color: Colors.black.withValues(alpha: 0.08)),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 6),
            child: const Row(
              children: [
                Icon(Icons.search, size: 11, color: Color(0xFF747775)),
                SizedBox(width: 4),
                Expanded(
                  child: Text(
                    'Buscar en Google...',
                    style: TextStyle(fontSize: 8.5, color: Color(0xFF747775)),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          // Accesos directos miniatura
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(4, (index) => Container(
              width: 18,
              height: 18,
              margin: const EdgeInsets.symmetric(horizontal: 3),
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                border: Border.all(color: Colors.black.withValues(alpha: 0.06)),
              ),
              child: Center(
                child: Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: [Colors.black, const Color(0xFF10A37F), const Color(0xFF0B57D0), const Color(0xFFE50914)][index % 4],
                    shape: BoxShape.circle,
                  ),
                ),
              ),
            )),
          ),
        ],
      ),
    );
  }

  // Vista previa realista de búsquedas web / contenidos (Captura 3)
  Widget _buildPageContentPreview(BrowserTab tab) {
    return Container(
      padding: const EdgeInsets.all(8),
      color: Colors.white,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Barra superior de búsqueda simulada de la página
          Container(
            height: 16,
            decoration: BoxDecoration(
              color: const Color(0xFFF1F3F4),
              borderRadius: BorderRadius.circular(8),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 6),
            child: Row(
              children: [
                const Icon(Icons.search, size: 10, color: Color(0xFF747775)),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    tab.title.isNotEmpty ? tab.title : 'Búsqueda de Google',
                    style: const TextStyle(fontSize: 8, color: Color(0xFF1F1F1F)),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 6),
          // Miniatura de imágenes / resultados estilo Google Images (Captura 3)
          Expanded(
            child: GridView.count(
              crossAxisCount: 2,
              crossAxisSpacing: 4,
              mainAxisSpacing: 4,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFFE2E8F0),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Center(child: Icon(Icons.image, size: 18, color: Color(0xFF94A3B8))),
                ),
                Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFFCBD5E1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Center(child: Icon(Icons.photo_library_outlined, size: 18, color: Color(0xFF64748B))),
                ),
                Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFFE2E8F0),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Center(child: Icon(Icons.article_outlined, size: 18, color: Color(0xFF94A3B8))),
                ),
                Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Center(child: Icon(Icons.feed_outlined, size: 18, color: Color(0xFF94A3B8))),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _MiniGoogleGPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final double w = size.width;
    final double h = size.height;
    final Rect rect = Rect.fromLTWH(0, 0, w, h);

    final bluePaint = Paint()..color = const Color(0xFF4285F4);
    final redPaint = Paint()..color = const Color(0xFFEA4335);
    final yellowPaint = Paint()..color = const Color(0xFFFBBC05);
    final greenPaint = Paint()..color = const Color(0xFF34A853);

    final center = Offset(w / 2, h / 2);
    final radius = w / 2;

    canvas.drawArc(rect, -0.785, 1.57, true, bluePaint);
    canvas.drawArc(rect, 0.785, 1.57, true, greenPaint);
    canvas.drawArc(rect, 2.356, 1.57, true, yellowPaint);
    canvas.drawArc(rect, 3.927, 1.57, true, redPaint);

    final whitePaint = Paint()..color = Colors.white;
    canvas.drawCircle(center, radius * 0.58, whitePaint);

    final barRect = Rect.fromLTWH(w * 0.42, h * 0.38, w * 0.58, h * 0.24);
    canvas.drawRect(barRect, bluePaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
