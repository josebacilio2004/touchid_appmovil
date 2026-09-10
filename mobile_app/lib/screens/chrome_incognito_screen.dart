import 'package:flutter/material.dart';
import '../widgets/incognito_icon.dart';

class ChromeIncognitoScreen extends StatelessWidget {
  final VoidCallback? onSearchTap;

  const ChromeIncognitoScreen({super.key, this.onSearchTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF1F1F1F),
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),
            // Logo circular de Incógnito
            Center(
              child: Container(
                width: 84,
                height: 84,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFF2B2D30),
                  border: Border.all(color: const Color(0xFF3C4043), width: 1.5),
                ),
                child: const Center(
                  child: IncognitoIcon(size: 46, color: Color(0xFFE8EAED)),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Título principal
            const Center(
              child: Text(
                'Estás en modo Incógnito',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Color(0xFFE8EAED),
                  fontSize: 22,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.2,
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Texto explicativo oficial
            const Text(
              'Los demás usuarios de este dispositivo no verán tu actividad, por lo que podrás navegar de forma más privada. Esto no cambiará la forma de recoger datos realizada por los sitios web que visites y los servicios que utilicen, incluido Google. Se guardarán las descargas, los marcadores y los elementos de la lista de lectura.',
              style: TextStyle(
                color: Color(0xFF9AA0A6),
                fontSize: 13.5,
                height: 1.5,
              ),
            ),
            const SizedBox(height: 24),

            // Qué no guardará Chrome
            const Text(
              'Chrome no guardará:',
              style: TextStyle(
                color: Color(0xFFE8EAED),
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            _buildBulletItem('Tu historial de navegación'),
            _buildBulletItem('Cookies y datos de sitios'),
            _buildBulletItem('Información introducida en formularios'),
            const SizedBox(height: 24),

            // Actividad visible para
            const Text(
              'Es posible que tu actividad todavía sea visible para:',
              style: TextStyle(
                color: Color(0xFFE8EAED),
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            _buildBulletItem('Los sitios web que visites'),
            _buildBulletItem('Tu empresa o centro educativo'),
            _buildBulletItem('Tu proveedor de servicios de Internet'),
            const SizedBox(height: 36),

            // Botón interactivo para buscar o abrir URL en modo incógnito
            Center(
              child: OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFF8AB4F8),
                  side: const BorderSide(color: Color(0xFF3C4043)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                ),
                icon: const Icon(Icons.search_rounded, size: 18),
                label: const Text('Escribir URL o buscar en privado'),
                onPressed: onSearchTap,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBulletItem(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6, left: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('•  ', style: TextStyle(color: Color(0xFF9AA0A6), fontSize: 13)),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(color: Color(0xFF9AA0A6), fontSize: 13, height: 1.4),
            ),
          ),
        ],
      ),
    );
  }
}
