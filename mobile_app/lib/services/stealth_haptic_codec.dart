import 'package:flutter/services.dart';

/// Códec háptico discreto para retroalimentación táctil codificada en la palma de la mano.
/// Diseñado para transmitir la respuesta correcta (A, B, C, D, E) de manera 100% indetectable
/// sin requerir mirar la pantalla ni emitir sonidos o alertas visuales.
class StealthHapticCodec {
  /// Emite una secuencia de pulsos hápticos reconocible al tacto según la alternativa:
  /// - Opción A: 1 pulso firme (Heavy)
  /// - Opción B: 2 pulsos continuos (Medium - Medium)
  /// - Opción C: 3 pulsos continuos (Medium - Medium - Medium)
  /// - Opción D: 2 pulsos + pausa + 2 pulsos (Doble patrón rítmico)
  /// - Opción E: 3 pulsos pesados sostenidos (Heavy x 3)
  static Future<void> playOptionPattern(String optionLetter) async {
    final letter = optionLetter.trim().toUpperCase();
    try {
      switch (letter) {
        case 'A':
          await HapticFeedback.heavyImpact();
          break;

        case 'B':
          await HapticFeedback.mediumImpact();
          await Future.delayed(const Duration(milliseconds: 140));
          await HapticFeedback.mediumImpact();
          break;

        case 'C':
          await HapticFeedback.mediumImpact();
          await Future.delayed(const Duration(milliseconds: 120));
          await HapticFeedback.mediumImpact();
          await Future.delayed(const Duration(milliseconds: 120));
          await HapticFeedback.mediumImpact();
          break;

        case 'D':
          await HapticFeedback.mediumImpact();
          await Future.delayed(const Duration(milliseconds: 90));
          await HapticFeedback.mediumImpact();
          await Future.delayed(const Duration(milliseconds: 260));
          await HapticFeedback.mediumImpact();
          await Future.delayed(const Duration(milliseconds: 90));
          await HapticFeedback.mediumImpact();
          break;

        case 'E':
          await HapticFeedback.heavyImpact();
          await Future.delayed(const Duration(milliseconds: 150));
          await HapticFeedback.heavyImpact();
          await Future.delayed(const Duration(milliseconds: 150));
          await HapticFeedback.heavyImpact();
          break;

        default:
          await HapticFeedback.selectionClick();
      }
    } catch (_) {}
  }

  /// Feedback háptico discreto de error o timeout (doble pulso corto)
  static Future<void> playErrorPattern() async {
    try {
      await HapticFeedback.mediumImpact();
      await Future.delayed(const Duration(milliseconds: 160));
      await HapticFeedback.mediumImpact();
    } catch (_) {}
  }
}
