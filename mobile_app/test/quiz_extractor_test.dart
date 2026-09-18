import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/models/quiz_models.dart';
import 'package:mobile_app/services/quiz_ai_service.dart';

void main() {
  group('Modelos Fuertemente Tipados (QuizModels)', () {
    test('1. Deserialización de QuestionItem con estructura de Radio Buttons tipo UDABOL', () {
      final json = {
        'id': 'q1',
        'number': 1,
        'type': 'single_choice',
        'statement': '¿Cuál es la función principal de los neumocitos tipo II?',
        'course': 'MED-202: Embriología II - NM - A',
        'confidence': 0.98,
        'alternatives': [
          {'id': 'A', 'text': 'Difusión pasiva de oxígeno y dióxido de carbono'},
          {'id': 'B', 'text': 'Producción y secreción de surfactante pulmonar', 'isInputChecked': true},
          {'id': 'C', 'text': 'Fagocitosis de partículas nocivas en el alveolo'},
          {'id': 'D', 'text': 'Mantenimiento del tono vascular alveolar'}
        ],
        'images': [
          {
            'src': 'https://virtual.udabol.edu.bo/docente/question_attachment_storage/alveolo.png',
            'alt': 'Corte histológico alveolar'
          }
        ]
      };

      final question = QuestionItem.fromJson(json);

      expect(question.id, 'q1');
      expect(question.number, 1);
      expect(question.type, 'single_choice');
      expect(question.course, 'MED-202: Embriología II - NM - A');
      expect(question.statement, contains('neumocitos tipo II'));
      expect(question.alternatives.length, 4);
      expect(question.alternatives[1].id, 'B');
      expect(question.alternatives[1].isInputChecked, isTrue);
      expect(question.images.length, 1);
      expect(question.images.first.src, contains('question_attachment_storage'));

      // Verificar serialización simétrica toJson()
      final serialized = question.toJson();
      expect(serialized['id'], 'q1');
      expect(serialized['alternatives'].length, 4);
      expect(serialized['images'].length, 1);
    });

    test('2. Deserialización de QuizTelemetry y QuizExtractionResult', () {
      final jsonTelemetry = {
        'url': 'https://virtual.udabol.edu.bo/carpetaverde/#examenes/intento/1248/1',
        'title': 'Carpeta Pedagógica Digital - UDABOL',
        'formsCount': 1,
        'inputsCount': 6,
        'radiosCount': 4,
        'checkboxesCount': 0,
        'labelsCount': 4,
        'candidatesCount': 1,
        'rawHtmlLength': 28540,
        'strategy': 'radios_estructural (UDABOL/Web)',
        'domPath': 'div#content > div.col-sm-6 > div.left',
        'rawQuestionHtml': '<div class="col-sm-6"><p>Enunciado...</p></div>'
      };

      final telemetry = QuizTelemetry.fromJson(jsonTelemetry);
      expect(telemetry.radiosCount, 4);
      expect(telemetry.strategyUsed, contains('UDABOL'));
      expect(telemetry.formsCount, 1);

      final fullResult = QuizExtractionResult(
        url: telemetry.url,
        title: telemetry.title,
        course: 'Embriología II',
        questions: [
          QuestionItem(
            id: 'q1',
            number: 1,
            type: 'single_choice',
            statement: 'Pregunta de prueba',
            alternatives: [
              AlternativeItem(id: 'A', text: 'Opción 1'),
              AlternativeItem(id: 'B', text: 'Opción 2'),
            ],
          )
        ],
        telemetry: telemetry,
        isSuccess: true,
      );

      final resultJson = fullResult.toJson();
      expect(resultJson['isSuccess'], isTrue);
      expect(resultJson['questions'].length, 1);
      expect(resultJson['telemetry']['radiosCount'], 4);
    });

    test('3. Generación de telemetría en caso de fallo (Sin descarte silencioso)', () {
      final emptyResult = QuizExtractionResult.empty(
        url: 'https://virtual.udabol.edu.bo/materias',
        title: 'Materias Inscritas',
        reason: 'No hay cuestionarios activos en la página actual.',
      );

      expect(emptyResult.isSuccess, isFalse);
      expect(emptyResult.questions, isEmpty);
      expect(emptyResult.errorMessage, contains('No hay cuestionarios'));
      expect(emptyResult.telemetry.errorReason, contains('No hay cuestionarios'));
    });
  });

  group('Servicio de IA y Validación Blindada (QuizAiService)', () {
    test('4. Parseo correcto de respuesta limpia JSON de la IA', () {
      final mockAiJson = '''
      {
        "questionId": "q12",
        "answer": "B",
        "answerText": "50 km/h",
        "confidence": 0.99,
        "explanation": "El D.S. 025-2021-MTC redujo la velocidad máxima en avenidas a 50 km/h.",
        "subject": "Tránsito MTC"
      }
      ''';

      final parsed = jsonDecode(mockAiJson);
      final response = AiSolutionResponse.fromJson(parsed);

      expect(response.questionId, 'q12');
      expect(response.answer, 'B');
      expect(response.answerText, '50 km/h');
      expect(response.confidence, 0.99);
      expect(response.subject, 'Tránsito MTC');
    });

    test('5. Tolerancia a respuestas de IA envueltas en markdown (```json ... ```)', () {
      final rawWithMarkdown = '''
      ```json
      {
        "questionId": "q12",
        "answer": "B",
        "answerText": "50 km/h",
        "confidence": 0.95,
        "explanation": "Regulado por MTC.",
        "subject": "Tránsito"
      }
      ```
      ''';

      // Simulamos la limpieza que realiza QuizAiService
      String cleaned = rawWithMarkdown.trim();
      if (cleaned.startsWith('```')) {
        final lines = cleaned.split('\n');
        if (lines.first.trim().startsWith('```')) lines.removeAt(0);
        if (lines.isNotEmpty && lines.last.trim().startsWith('```')) lines.removeLast();
        cleaned = lines.join('\n').trim();
      }

      final parsed = jsonDecode(cleaned);
      final response = AiSolutionResponse.fromJson(parsed);

      expect(response.answer, 'B');
      expect(response.answerText, '50 km/h');
    });

    test('6. Manejo de preguntas con comillas y caracteres especiales', () {
      final questionWithQuotes = QuestionItem(
        id: 'q5',
        number: 5,
        type: 'single_choice',
        statement: 'El término "apoptosis" hace referencia a:',
        alternatives: [
          AlternativeItem(id: 'A', text: 'Muerte celular "programada"'),
          AlternativeItem(id: 'B', text: 'Necrosis por isquemia'),
        ],
      );

      final serialized = jsonEncode(questionWithQuotes.toJson());
      expect(serialized, contains(r'\"apoptosis\"'));

      // Verificar deserialización sin error de comillas
      final deserialized = QuestionItem.fromJson(jsonDecode(serialized));
      expect(deserialized.statement, contains('"apoptosis"'));
      expect(deserialized.alternatives.first.text, contains('"programada"'));
    });
  });

  group('Validación de los Escenarios de Extracción Heurística', () {
    test('7. Preguntas de opción múltiple (Checkbox)', () {
      final question = QuestionItem(
        id: 'q1',
        number: 1,
        type: 'multiple_choice',
        statement: 'Seleccione los órganos derivados del endodermo:',
        alternatives: [
          AlternativeItem(id: 'A', text: 'Hígado', isInputChecked: true),
          AlternativeItem(id: 'B', text: 'Páncreas', isInputChecked: true),
          AlternativeItem(id: 'C', text: 'Epidermis'),
          AlternativeItem(id: 'D', text: 'Revestimiento epitelial del tubo digestivo', isInputChecked: true),
        ],
      );

      expect(question.type, 'multiple_choice');
      expect(question.alternatives.where((a) => a.isInputChecked).length, 3);
    });

    test('8. Preguntas abiertas (Textarea)', () {
      final openQ = QuestionItem(
        id: 'q3',
        number: 3,
        type: 'open_question',
        statement: 'Describa brevemente la secuencia de cierre del tubo neural.',
        alternatives: [],
      );

      expect(openQ.type, 'open_question');
      expect(openQ.alternatives, isEmpty);
    });

    test('9. Pregunta con baja confianza o no identificable (unknown)', () {
      final unknownQ = QuestionItem(
        id: 'unknown_1',
        number: 1,
        type: 'unknown',
        statement: 'Texto ambiguo capturado',
        alternatives: [],
        confidence: 0.32,
      );

      expect(unknownQ.type, 'unknown');
      expect(unknownQ.confidence, 0.32);
    });

    test('10. Múltiples preguntas en un mismo examen (sin duplicados)', () {
      final quizResult = QuizExtractionResult(
        url: 'https://plataforma.edu/examen',
        title: 'Examen de Admisión',
        questions: [
          QuestionItem(
            id: 'q1',
            number: 1,
            type: 'single_choice',
            statement: 'Pregunta 1',
            alternatives: [AlternativeItem(id: 'A', text: 'Op 1'), AlternativeItem(id: 'B', text: 'Op 2')],
          ),
          QuestionItem(
            id: 'q2',
            number: 2,
            type: 'single_choice',
            statement: 'Pregunta 2',
            alternatives: [AlternativeItem(id: 'A', text: 'Op 1'), AlternativeItem(id: 'B', text: 'Op 2')],
          ),
        ],
        telemetry: QuizTelemetry(url: 'https://plataforma.edu/examen', title: 'Examen'),
        isSuccess: true,
      );

      expect(quizResult.questions.length, 2);
      expect(quizResult.questions[0].number, 1);
      expect(quizResult.questions[1].number, 2);
      expect(quizResult.questions[0].id != quizResult.questions[1].id, isTrue);
    });

    test('11. Serialización y deserialización de AutoMarkResult (Éxito y Fallo)', () {
      final successJson = {
        'success': true,
        'markedIndex': 1,
        'markedLetter': 'B',
        'targetText': 'Producción y secreción de surfactante pulmonar',
        'targetTag': 'INPUT',
        'targetId': 'resp_1234_2',
        'hasLabel': true,
        'details': 'Elemento #resp_1234_2 marcado exitosamente con eventos change/click'
      };

      final autoMarkSuccess = AutoMarkResult.fromJson(successJson);
      expect(autoMarkSuccess.success, isTrue);
      expect(autoMarkSuccess.targetIndex, 1);
      expect(autoMarkSuccess.targetLetter, 'B');
      expect(autoMarkSuccess.targetId, 'resp_1234_2');
      expect(autoMarkSuccess.hasLabel, isTrue);
      expect(autoMarkSuccess.details, contains('resp_1234_2'));
      expect(autoMarkSuccess.toString(), contains('AutoMark éxito [B]'));

      final failJson = {
        'success': false,
        'targetIndex': 3,
        'targetLetter': 'D',
        'error': 'No se encontró el elemento input'
      };

      final autoMarkFail = AutoMarkResult.fromJson(failJson);
      expect(autoMarkFail.success, isFalse);
      expect(autoMarkFail.error, contains('No se encontró'));
      expect(autoMarkFail.toString(), contains('AutoMark fallo [D]'));
    });

    test('12. Telemetría de auto-marcado en QuizTelemetry', () {
      final telJson = {
        'url': 'https://virtual.udabol.edu.bo/carpetaverde/#examenes/intento/1',
        'title': 'Examen UDABOL',
        'autoMarked': true,
        'autoMarkStatus': 'success',
        'autoMarkDetails': 'Elemento marcado exitosamente',
        'autoMarkedOption': 'C'
      };

      final tel = QuizTelemetry.fromJson(telJson);
      expect(tel.autoMarked, isTrue);
      expect(tel.autoMarkStatus, 'success');
      expect(tel.autoMarkedOption, 'C');

      final serialized = tel.toJson();
      expect(serialized['autoMarked'], isTrue);
      expect(serialized['autoMarkStatus'], 'success');
      expect(serialized['autoMarkedOption'], 'C');
    });
  });
}
