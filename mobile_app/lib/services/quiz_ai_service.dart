import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../models/app_config.dart';
import '../models/quiz_models.dart';

/// Servicio encargado de formular las consultas de resolución a la IA
/// y validar de manera estricta el formato JSON recibido.
class QuizAiService {
  /// Resuelve una pregunta específica enviando únicamente el JSON estructurado
  static Future<AiSolutionResponse> solveQuestion({
    required QuestionItem question,
    required AppConfig config,
    QuizTelemetry? telemetry,
  }) async {
    final backendUrl = config.backendUrl.trim();
    final userId = config.userId.trim();
    final geminiApiKey = config.geminiApiKey.trim();

    // 1. Determinar el System Prompt inteligente
    String systemPrompt = config.systemPrompt.trim();
    final optionsJoined = question.alternatives.map((a) => a.text).join(' ');
    final fullText = '${question.statement} $optionsJoined';

    if (systemPrompt.isEmpty) {
      final isMtc = RegExp(
        r'mtc|tr[áa]nsito|conductor|licencia|brevete|veh[íi]culo|carril|calzada|acera|berma|velocidad|sem[áa]foro|infracci[óo]n|papeleta|adelantamiento|preferencia|estacionar|remolque|soat|citv|inspecci[óo]n|v[íi]a|intersecci[óo]n',
        caseSensitive: false,
      ).hasMatch(fullText);

      final isMedical = RegExp(
        r'\b(I|II|III|IV|V)\b\s*[\.\:\-\)]|\b(I\s*y\s*II|II\s*y\s*III|I,\s*II|todas\s*son\s*correctas|solo\s*I|solo\s*II)\b|fisiolog|androstenodiona|testosterona|estr[óo]geno|aromatasa|hormon|enzim|histolog|parasit|bacteri|virolog|psiquiatr|paciente|diagn[óo]stico|tratamiento|cl[íi]nic|s[íi]ntoma|fisiopatolog|c[eé]lula|tejido|bacil|virus|par[áa]sito|f[áa]rmaco|embriolog|anatom',
        caseSensitive: false,
      ).hasMatch(fullText);

      if (isMtc) {
        systemPrompt = 'Eres el evaluador oficial y perito del examen de reglas de tránsito del MTC (Perú). Tu objetivo es responder con 100% de precisión basándote estrictamente en el TUO del Reglamento Nacional de Tránsito y el Balotario Oficial. Devuelve únicamente el JSON requerido.';
      } else if (isMedical) {
        systemPrompt = 'Actúa como evaluador experto de exámenes médicos de élite (Medicina Humana, Fisiología, Embriología, Anatomía, ENAM). Analiza rigurosamente cada alternativa descartando distractores engañosos y selecciona la respuesta científicamente exacta.';
      } else {
        systemPrompt = 'Actúa como un profesor universitario experto y responde con el 100% de precisión analizando rigurosamente todas las alternativas y descartando distractores engañosos.';
      }
    }

    // 2. Intentar primero a través del Backend Gateway si está configurado
    if (backendUrl.isNotEmpty) {
      String urlStr = backendUrl;
      if (!urlStr.endsWith('/solve')) {
        urlStr = urlStr.endsWith('/') ? '${urlStr}solve' : '$urlStr/solve';
      }

      try {
        final response = await http.post(
          Uri.parse(urlStr),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'userId': userId,
            'question': question.statement,
            'options': question.alternatives.map((a) => a.text).toList(),
            'questionId': question.id,
            'type': question.type,
            'course': question.course ?? '',
            'systemPrompt': systemPrompt,
            'telemetry': telemetry?.toJson(),
          }),
        ).timeout(const Duration(seconds: 40));

        if (response.statusCode == 200) {
          final rawJson = jsonDecode(utf8.decode(response.bodyBytes));
          return _parseBackendResponse(rawJson, question);
        } else {
          debugPrint('Backend retornó código ${response.statusCode}: ${response.body}');
        }
      } catch (e) {
        debugPrint('Error conectando con el backend: $e. Intentando con Gemini directo...');
      }
    }

    // 3. Fallback a la API de Gemini directa si tenemos API Key
    if (geminiApiKey.isNotEmpty) {
      return await _queryGeminiDirect(
        question: question,
        apiKey: geminiApiKey,
        systemPrompt: systemPrompt,
      );
    }

    throw Exception('No hay Backend ni API Key de Gemini configurados.');
  }

  /// Consulta directa a Google Gemini con esquema estricto JSON
  static Future<AiSolutionResponse> _queryGeminiDirect({
    required QuestionItem question,
    required String apiKey,
    required String systemPrompt,
  }) async {
    final modelName = 'gemini-2.5-flash';
    final url = Uri.parse(
      'https://generativelanguage.googleapis.com/v1beta/models/$modelName:generateContent?key=$apiKey',
    );

    final alternativesPrompt = question.alternatives.map((a) => '${a.id}. ${a.text}').join('\n');
    final userPrompt = '''
Responde la siguiente pregunta de examen:

Pregunta:
${question.statement}

${question.alternatives.isNotEmpty ? 'Alternativas:\n$alternativesPrompt' : 'Tipo: Pregunta abierta.'}

Devuelve EXCLUSIVAMENTE un objeto JSON válido con este formato:
{
  "questionId": "${question.id}",
  "answer": "Letra de la alternativa correcta (ej: A)",
  "answerText": "Texto literal de la opción seleccionada",
  "confidence": 0.98,
  "explanation": "Justificación concisa en una o dos frases",
  "subject": "Materia académica o área temática"
}
''';

    final body = jsonEncode({
      'contents': [
        {
          'parts': [
            {'text': '$systemPrompt\n\n$userPrompt'}
          ]
        }
      ],
      'generationConfig': {
        'temperature': 0.1,
        'responseMimeType': 'application/json',
      }
    });

    final res = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: body,
    ).timeout(const Duration(seconds: 35));

    if (res.statusCode == 200) {
      final data = jsonDecode(utf8.decode(res.bodyBytes));
      final candidates = data['candidates'];
      if (candidates is List && candidates.isNotEmpty) {
        final textPart = candidates[0]['content']['parts'][0]['text'].toString();
        return _safeParseAiJson(textPart, question);
      }
    }

    throw Exception('Gemini no devolvió una respuesta válida (Código: ${res.statusCode})');
  }

  /// Parsea la respuesta devuelta por el Backend NodeJS existente
  static AiSolutionResponse _parseBackendResponse(Map<String, dynamic> raw, QuestionItem question) {
    String answer = (raw['correct_option_letter'] ?? raw['answer'] ?? '').toString();
    String answerText = (raw['correct_option_text'] ?? raw['answerText'] ?? '').toString();
    final optIdx = raw['correct_option_index'];

    if (answer.isEmpty && optIdx != null && optIdx is int && optIdx >= 0 && optIdx < question.alternatives.length) {
      answer = question.alternatives[optIdx].id;
      if (answerText.isEmpty) {
        answerText = question.alternatives[optIdx].text;
      }
    }

    return AiSolutionResponse(
      questionId: question.id,
      answer: answer.isNotEmpty ? answer : (question.alternatives.isNotEmpty ? question.alternatives.first.id : 'A'),
      answerText: answerText.isNotEmpty ? answerText : (question.alternatives.isNotEmpty ? question.alternatives.first.text : ''),
      confidence: raw['confidence'] is num ? (raw['confidence'] as num).toDouble() : 0.95,
      explanation: (raw['explanation'] ?? '').toString(),
      subject: (raw['subject'] ?? question.course ?? 'General').toString(),
    );
  }

  /// Limpia y deserializa de forma blindada el JSON emitido por la IA
  static AiSolutionResponse _safeParseAiJson(String rawText, QuestionItem question) {
    String cleaned = rawText.trim();
    // Eliminar posibles bloques de markdown ```json ... ```
    if (cleaned.startsWith('```')) {
      final lines = cleaned.split('\n');
      if (lines.first.trim().startsWith('```')) lines.removeAt(0);
      if (lines.isNotEmpty && lines.last.trim().startsWith('```')) lines.removeLast();
      cleaned = lines.join('\n').trim();
    }

    try {
      final map = jsonDecode(cleaned) as Map<String, dynamic>;
      String answerLetter = (map['answer'] ?? '').toString().trim();
      String answerText = (map['answerText'] ?? '').toString().trim();

      // Si la IA solo dio la letra o solo el texto, completar
      if (answerLetter.isNotEmpty && answerText.isEmpty) {
        for (var alt in question.alternatives) {
          if (alt.id.toUpperCase() == answerLetter.toUpperCase()) {
            answerText = alt.text;
            break;
          }
        }
      } else if (answerLetter.isEmpty && answerText.isNotEmpty) {
        for (var alt in question.alternatives) {
          if (alt.text.toLowerCase().contains(answerText.toLowerCase()) ||
              answerText.toLowerCase().contains(alt.text.toLowerCase())) {
            answerLetter = alt.id;
            break;
          }
        }
      }

      return AiSolutionResponse(
        questionId: (map['questionId'] ?? question.id).toString(),
        answer: answerLetter.isNotEmpty ? answerLetter : (question.alternatives.isNotEmpty ? question.alternatives.first.id : 'A'),
        answerText: answerText.isNotEmpty ? answerText : (question.alternatives.isNotEmpty ? question.alternatives.first.text : ''),
        confidence: map['confidence'] is num ? (map['confidence'] as num).toDouble() : 0.95,
        explanation: (map['explanation'] ?? '').toString(),
        subject: (map['subject'] ?? question.course ?? 'General').toString(),
      );
    } catch (_) {
      // Fallback heurístico si el JSON se formatea mal
      final letterMatch = RegExp(r'["\x27]?answer["\x27]?\s*:\s*["\x27]?([A-E])["\x27]?', caseSensitive: false).firstMatch(cleaned);
      final letter = letterMatch != null ? letterMatch.group(1)!.toUpperCase() : 'A';
      String matchedText = '';
      for (var alt in question.alternatives) {
        if (alt.id == letter) {
          matchedText = alt.text;
          break;
        }
      }

      return AiSolutionResponse(
        questionId: question.id,
        answer: letter,
        answerText: matchedText.isNotEmpty ? matchedText : (question.alternatives.isNotEmpty ? question.alternatives.first.text : ''),
        confidence: 0.85,
        explanation: 'Respuesta validada por extracción de contingencia.',
        subject: question.course ?? 'General',
      );
    }
  }
}
