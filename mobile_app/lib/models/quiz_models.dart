import 'dart:convert';

/// Representa una alternativa de respuesta dentro de una pregunta
class AlternativeItem {
  final String id; // Ej: "A", "B", "C", "D" o identificador del input
  final String text; // Texto limpio de la alternativa
  final bool isInputChecked; // Si el usuario ya la tenía marcada en la web

  AlternativeItem({
    required this.id,
    required this.text,
    this.isInputChecked = false,
  });

  factory AlternativeItem.fromJson(Map<String, dynamic> json) {
    return AlternativeItem(
      id: (json['id'] ?? '').toString().trim(),
      text: (json['text'] ?? '').toString().trim(),
      isInputChecked: json['isInputChecked'] == true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'text': text,
      'isInputChecked': isInputChecked,
    };
  }

  @override
  String toString() => '[$id] $text';
}

/// Representa una imagen asociada al bloque de una pregunta
class QuestionImage {
  final String src;
  final String alt;
  final String width;
  final String height;

  QuestionImage({
    required this.src,
    this.alt = '',
    this.width = '',
    this.height = '',
  });

  factory QuestionImage.fromJson(Map<String, dynamic> json) {
    return QuestionImage(
      src: (json['src'] ?? '').toString().trim(),
      alt: (json['alt'] ?? '').toString().trim(),
      width: (json['width'] ?? '').toString().trim(),
      height: (json['height'] ?? '').toString().trim(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'src': src,
      'alt': alt,
      'width': width,
      'height': height,
    };
  }
}

/// Representa una pregunta detectada y estructurada
class QuestionItem {
  final String id; // Ej: "q1", "q12"
  final int number; // 1, 2, 12...
  final String type; // single_choice, multiple_choice, true_false, open_question, unknown
  final String statement; // Enunciado limpio sin numeración residual
  final List<AlternativeItem> alternatives;
  final List<QuestionImage> images;
  final double confidence; // Puntuación de certeza de detección (0.0 - 1.0)
  final String? course; // Materia o carrera si fue detectada en la página
  final String? rawSnippet; // Fragmento HTML asociado para diagnóstico

  QuestionItem({
    required this.id,
    required this.number,
    required this.type,
    required this.statement,
    required this.alternatives,
    this.images = const [],
    this.confidence = 1.0,
    this.course,
    this.rawSnippet,
  });

  factory QuestionItem.fromJson(Map<String, dynamic> json) {
    var rawAlts = json['alternatives'];
    List<AlternativeItem> alts = [];
    if (rawAlts is List) {
      alts = rawAlts.map((a) {
        if (a is Map<String, dynamic>) {
          return AlternativeItem.fromJson(a);
        } else if (a is String) {
          return AlternativeItem(id: '', text: a);
        }
        return AlternativeItem(id: '', text: a.toString());
      }).toList();
    }

    var rawImgs = json['images'];
    List<QuestionImage> imgs = [];
    if (rawImgs is List) {
      imgs = rawImgs
          .whereType<Map<String, dynamic>>()
          .map((img) => QuestionImage.fromJson(img))
          .toList();
    }

    return QuestionItem(
      id: (json['id'] ?? '').toString().trim(),
      number: json['number'] is int
          ? json['number']
          : int.tryParse(json['number']?.toString() ?? '1') ?? 1,
      type: (json['type'] ?? 'single_choice').toString().trim(),
      statement: (json['statement'] ?? '').toString().trim(),
      alternatives: alts,
      images: imgs,
      confidence: json['confidence'] is num
          ? (json['confidence'] as num).toDouble()
          : 0.9,
      course: json['course']?.toString(),
      rawSnippet: json['rawSnippet']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'number': number,
      'type': type,
      'statement': statement,
      'alternatives': alternatives.map((a) => a.toJson()).toList(),
      'images': images.map((i) => i.toJson()).toList(),
      'confidence': confidence,
      if (course != null) 'course': course,
      if (rawSnippet != null) 'rawSnippet': rawSnippet,
    };
  }
}

/// Datos de diagnóstico y telemetría de extracción del DOM
class QuizTelemetry {
  final String url;
  final String title;
  final int formsCount;
  final int inputsCount;
  final int radiosCount;
  final int checkboxesCount;
  final int labelsCount;
  final int candidatesCount;
  final int rawHtmlLength;
  final String strategyUsed;
  final String domPath;
  final String rawQuestionHtml;
  final String? errorReason;
  final String timestamp;

  QuizTelemetry({
    required this.url,
    required this.title,
    this.formsCount = 0,
    this.inputsCount = 0,
    this.radiosCount = 0,
    this.checkboxesCount = 0,
    this.labelsCount = 0,
    this.candidatesCount = 0,
    this.rawHtmlLength = 0,
    this.strategyUsed = 'heuristica_estructural',
    this.domPath = '',
    this.rawQuestionHtml = '',
    this.errorReason,
    String? timestamp,
  }) : timestamp = timestamp ?? DateTime.now().toIso8601String();

  factory QuizTelemetry.fromJson(Map<String, dynamic> json) {
    return QuizTelemetry(
      url: (json['url'] ?? 'N/A').toString(),
      title: (json['title'] ?? '').toString(),
      formsCount: json['formsCount'] is int ? json['formsCount'] : 0,
      inputsCount: json['inputsCount'] is int ? json['inputsCount'] : 0,
      radiosCount: json['radiosCount'] is int ? json['radiosCount'] : 0,
      checkboxesCount: json['checkboxesCount'] is int ? json['checkboxesCount'] : 0,
      labelsCount: json['labelsCount'] is int ? json['labelsCount'] : 0,
      candidatesCount: json['candidatesCount'] is int ? json['candidatesCount'] : 0,
      rawHtmlLength: json['rawHtmlLength'] is int ? json['rawHtmlLength'] : 0,
      strategyUsed: (json['strategyUsed'] ?? json['strategy'] ?? 'heuristica_estructural').toString(),
      domPath: (json['domPath'] ?? '').toString(),
      rawQuestionHtml: (json['rawQuestionHtml'] ?? '').toString(),
      errorReason: json['errorReason']?.toString(),
      timestamp: json['timestamp']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'url': url,
      'title': title,
      'formsCount': formsCount,
      'inputsCount': inputsCount,
      'radiosCount': radiosCount,
      'checkboxesCount': checkboxesCount,
      'labelsCount': labelsCount,
      'candidatesCount': candidatesCount,
      'rawHtmlLength': rawHtmlLength,
      'strategy': strategyUsed,
      'domPath': domPath,
      'rawQuestionHtml': rawQuestionHtml,
      if (errorReason != null) 'errorReason': errorReason,
      'timestamp': timestamp,
    };
  }

  @override
  String toString() {
    return 'HTML: $rawHtmlLength chars | Forms: $formsCount | Inputs: $inputsCount | Radios: $radiosCount | Checks: $checkboxesCount | Labels: $labelsCount | Candidatos: $candidatesCount';
  }
}

/// Resultado global de la extracción del cuestionario
class QuizExtractionResult {
  final String url;
  final String title;
  final String? course;
  final List<QuestionItem> questions;
  final QuizTelemetry telemetry;
  final bool isSuccess;
  final String? errorMessage;

  QuizExtractionResult({
    required this.url,
    required this.title,
    this.course,
    required this.questions,
    required this.telemetry,
    required this.isSuccess,
    this.errorMessage,
  });

  factory QuizExtractionResult.empty({
    String url = 'N/A',
    String title = '',
    String reason = 'No se encontraron preguntas en la página actual.',
    QuizTelemetry? telemetry,
  }) {
    return QuizExtractionResult(
      url: url,
      title: title,
      questions: [],
      telemetry: telemetry ?? QuizTelemetry(url: url, title: title, errorReason: reason),
      isSuccess: false,
      errorMessage: reason,
    );
  }

  factory QuizExtractionResult.fromJson(Map<String, dynamic> json) {
    final rawQs = json['questions'];
    List<QuestionItem> qs = [];
    if (rawQs is List) {
      qs = rawQs
          .whereType<Map<String, dynamic>>()
          .map((q) => QuestionItem.fromJson(q))
          .toList();
    }

    final telMap = json['telemetry'] is Map<String, dynamic>
        ? json['telemetry'] as Map<String, dynamic>
        : <String, dynamic>{};

    return QuizExtractionResult(
      url: (json['url'] ?? telMap['url'] ?? 'N/A').toString(),
      title: (json['title'] ?? telMap['title'] ?? '').toString(),
      course: json['course']?.toString(),
      questions: qs,
      telemetry: QuizTelemetry.fromJson(telMap),
      isSuccess: json['isSuccess'] == true || qs.isNotEmpty,
      errorMessage: json['errorMessage']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'url': url,
      'title': title,
      if (course != null) 'course': course,
      'questions': questions.map((q) => q.toJson()).toList(),
      'telemetry': telemetry.toJson(),
      'isSuccess': isSuccess,
      if (errorMessage != null) 'errorMessage': errorMessage,
    };
  }
}

/// Respuesta estructurada devuelta por el modelo de IA
class AiSolutionResponse {
  final String questionId;
  final String answer; // Ej: "A", "B", "C"...
  final String answerText; // Texto de la alternativa correcta
  final double confidence; // Nivel de confianza de la IA (0.0 a 1.0)
  final String explanation; // Justificación académica o pericial
  final String subject; // Materia detectada

  AiSolutionResponse({
    required this.questionId,
    required this.answer,
    required this.answerText,
    this.confidence = 0.98,
    this.explanation = '',
    this.subject = 'General',
  });

  factory AiSolutionResponse.fromJson(Map<String, dynamic> json) {
    return AiSolutionResponse(
      questionId: (json['questionId'] ?? json['id'] ?? 'q1').toString().trim(),
      answer: (json['answer'] ?? json['correct_option_letter'] ?? '').toString().trim(),
      answerText: (json['answerText'] ?? json['correct_option_text'] ?? '').toString().trim(),
      confidence: json['confidence'] is num
          ? (json['confidence'] as num).toDouble()
          : 0.95,
      explanation: (json['explanation'] ?? '').toString().trim(),
      subject: (json['subject'] ?? 'General').toString().trim(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'questionId': questionId,
      'answer': answer,
      'answerText': answerText,
      'confidence': confidence,
      'explanation': explanation,
      'subject': subject,
    };
  }
}
