import 'package:flutter/material.dart';

class IncognitoIcon extends StatelessWidget {
  final double size;
  final Color color;

  const IncognitoIcon({
    super.key,
    this.size = 24,
    this.color = const Color(0xFFC4C7C5),
  });

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: Size(size, size),
      painter: _IncognitoPainter(color),
    );
  }
}

class _IncognitoPainter extends CustomPainter {
  final Color color;

  _IncognitoPainter(this.color);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill
      ..strokeCap = StrokeCap.round
      ..isAntiAlias = true;

    final strokePaint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.width * 0.08
      ..strokeCap = StrokeCap.round
      ..isAntiAlias = true;

    final w = size.width;
    final h = size.height;

    // 1. Ala del sombrero (Brim)
    final brimPath = Path();
    brimPath.moveTo(w * 0.1, h * 0.42);
    brimPath.quadraticBezierTo(w * 0.5, h * 0.34, w * 0.9, h * 0.42);
    brimPath.quadraticBezierTo(w * 0.5, h * 0.40, w * 0.1, h * 0.42);
    brimPath.close();
    canvas.drawPath(brimPath, paint);

    // 2. Copa del sombrero (Crown)
    final crownPath = Path();
    crownPath.moveTo(w * 0.26, h * 0.36);
    crownPath.cubicTo(
      w * 0.24, h * 0.18, // Control 1
      w * 0.38, h * 0.10, // Control 2
      w * 0.50, h * 0.14, // Centro con hendidura
    );
    crownPath.cubicTo(
      w * 0.62, h * 0.10, // Control 1
      w * 0.76, h * 0.18, // Control 2
      w * 0.74, h * 0.36, // Fin
    );
    crownPath.close();
    canvas.drawPath(crownPath, paint);

    // 3. Gafas (Glasses - dos círculos con puente)
    final radius = w * 0.14;
    final leftCenter = Offset(w * 0.34, h * 0.68);
    final rightCenter = Offset(w * 0.66, h * 0.68);

    canvas.drawCircle(leftCenter, radius, strokePaint);
    canvas.drawCircle(rightCenter, radius, strokePaint);

    // Puente de las gafas
    final bridgePath = Path();
    bridgePath.moveTo(w * 0.46, h * 0.67);
    bridgePath.quadraticBezierTo(w * 0.50, h * 0.63, w * 0.54, h * 0.67);
    canvas.drawPath(bridgePath, strokePaint);
  }

  @override
  bool shouldRepaint(covariant _IncognitoPainter oldDelegate) => oldDelegate.color != color;
}
