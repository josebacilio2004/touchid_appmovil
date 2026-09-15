import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../models/quiz_models.dart';

/// Servicio responsable de inyectar el analizador estructural del DOM
/// y extraer preguntas, alternativas, imágenes y telemetría completa.
class QuizExtractorService {
  /// Script JavaScript heurístico y estructural universal
  static const String extractorJs = r'''
(function() {
  function clean(str) {
    if (!str) return '';
    return str.replace(/\s+/g, ' ').trim();
  }

  function getDomPath(el) {
    if (!el || !el.parentNode) return '';
    var stack = [];
    var curr = el;
    while (curr && curr.nodeType === 1 && curr.tagName.toLowerCase() !== 'html' && stack.length < 6) {
      var name = curr.tagName.toLowerCase();
      if (curr.id) {
        name += '#' + curr.id;
      } else if (curr.className && typeof curr.className === 'string') {
        var cls = curr.className.trim().split(/\s+/).filter(function(c) { return c && !c.includes(':'); }).slice(0, 2).join('.');
        if (cls) name += '.' + cls;
      }
      stack.unshift(name);
      curr = curr.parentNode;
    }
    return stack.join(' > ');
  }

  function isElementVisible(el) {
    if (!el) return false;
    var isHidden = !!el.closest('[style*="display: none"], [style*="display:none"], [hidden], .hidden, [aria-hidden="true"]');
    if (isHidden) return false;
    var rect = el.getBoundingClientRect();
    if (rect.width > 0 || rect.height > 0) return true;
    if (el.offsetParent !== null) return true;
    return false;
  }

  var doc = document;
  var fullHtml = doc.documentElement ? doc.documentElement.outerHTML : '';
  var pageTitle = doc.title || '';
  var pageUrl = window.location.href || '';

  // 1. Detección de Materia / Curso / Encabezado de examen
  var detectedCourse = '';
  var headerCandidates = doc.querySelectorAll('h1, h2, h3, h4, h5, .breadcrumb, [class*="course"], [class*="materia"], [class*="subject"]');
  for (var h = 0; h < headerCandidates.length; h++) {
    var hText = clean(headerCandidates[h].innerText || headerCandidates[h].textContent);
    if (/(?:MED-|ING-|ADM-|DER-|PARCIAL|FINAL|EXAMEN|GRUPO|PARALELO|TRANSITO|MTC)/i.test(hText) && hText.length > 5 && hText.length < 120) {
      detectedCourse = hText;
      break;
    }
  }

  // 2. Mapeo semántico de inputs
  var allRadios = Array.from(doc.querySelectorAll('input[type="radio"]'));
  var allCheckboxes = Array.from(doc.querySelectorAll('input[type="checkbox"]'));
  var allSelects = Array.from(doc.querySelectorAll('select'));
  var allTextareas = Array.from(doc.querySelectorAll('textarea'));

  // Revisar si hay contenido en iframes accesibles (Moodle / simuladores embebidos)
  if (allRadios.length === 0 && allCheckboxes.length === 0) {
    var iframes = doc.querySelectorAll('iframe');
    for (var f = 0; f < iframes.length; f++) {
      try {
        var idoc = iframes[f].contentDocument || iframes[f].contentWindow.document;
        if (idoc) {
          var ifRadios = Array.from(idoc.querySelectorAll('input[type="radio"]'));
          if (ifRadios.length > 0) {
            allRadios = ifRadios;
            allCheckboxes = Array.from(idoc.querySelectorAll('input[type="checkbox"]'));
            allSelects = Array.from(idoc.querySelectorAll('select'));
            allTextareas = Array.from(idoc.querySelectorAll('textarea'));
            doc = idoc;
            break;
          }
        }
      } catch(e) {}
    }
  }

  var visibleRadios = allRadios.filter(isElementVisible);
  if (visibleRadios.length === 0 && allRadios.length > 0) visibleRadios = allRadios;

  var visibleCheckboxes = allCheckboxes.filter(isElementVisible);
  if (visibleCheckboxes.length === 0 && allCheckboxes.length > 0) visibleCheckboxes = allCheckboxes;

  function getOptionTextFromInput(input) {
    // A. Label vinculado por 'for' e 'id'
    if (input.id) {
      var lbl = doc.querySelector('label[for="' + input.id + '"]');
      if (lbl) {
        var lt = clean(lbl.innerText || lbl.textContent);
        if (lt) return lt;
      }
    }
    // B. Input envuelto dentro de <label> (Estructura estándar de UDABOL y formularios modernos)
    var parentLbl = input.closest('label');
    if (parentLbl) {
      // Clonar para no alterar el DOM
      var lblClone = parentLbl.cloneNode(true);
      var inputsInLbl = lblClone.querySelectorAll('input, button');
      inputsInLbl.forEach(function(i) { i.remove(); });
      var pt = clean(lblClone.innerText || lblClone.textContent);
      if (pt) return pt;
    }
    // C. Hermano siguiente
    var sib = input.nextElementSibling;
    if (sib) {
      var st = clean(sib.innerText || sib.textContent);
      if (st) return st;
    }
    if (input.nextSibling && input.nextSibling.textContent) {
      var nst = clean(input.nextSibling.textContent);
      if (nst) return nst;
    }
    // D. Contenedor padre de la opción
    var parentBox = input.closest('.answer, .r0, .r1, .opcion, .option, li, tr, p, div');
    if (parentBox) {
      var clone = parentBox.cloneNode(true);
      var inps = clone.querySelectorAll('input, button');
      inps.forEach(function(i) { i.remove(); });
      var cText = clean(clone.innerText || clone.textContent);
      if (cText) return cText;
    }
    return '';
  }

  function cleanStatementText(raw) {
    if (!raw) return '';
    var t = clean(raw);
    // Eliminar prefijos de numeración como "12.", "Pregunta 12:", "12)", "12 -"
    t = t.replace(/^(?:Pregunta\s*\d+[\.\:\)\-]?|\d+[\.\:\)\-])\s*/i, '');
    return clean(t);
  }

  function extractImagesFromContainer(container) {
    var imgs = [];
    if (!container) return imgs;
    var imgEls = container.querySelectorAll('img');
    imgEls.forEach(function(img) {
      var src = img.getAttribute('src');
      if (!src) return;
      // Convertir a URL absoluta
      try {
        src = new URL(src, window.location.href).href;
      } catch(_) {}
      // Filtrar iconos decorativos o logos de la universidad
      if (/(?:logo|icon|favicon|avatar|theme\/image\.php|nprogress)/i.test(src)) return;
      imgs.push({
        src: src,
        alt: img.getAttribute('alt') || '',
        width: img.getAttribute('width') || (img.width ? img.width + 'px' : ''),
        height: img.getAttribute('height') || (img.height ? img.height + 'px' : '')
      });
    });
    return imgs;
  }

  var extractedQuestions = [];
  var strategyUsed = 'ninguna';
  var matchedDomPath = '';
  var primarySnippetHtml = '';

  // ESTRATEGIA A: Cuestionarios por Radio Buttons (UDABOL, Moodle, Google Forms, MTC)
  if (visibleRadios.length >= 2) {
    // Agrupar radios por 'name' o por contenedor más cercano
    var groups = {};
    visibleRadios.forEach(function(r) {
      var gName = r.name || 'default_group';
      if (!groups[gName]) groups[gName] = [];
      groups[gName].push(r);
    });

    var groupKeys = Object.keys(groups);
    for (var gk = 0; gk < groupKeys.length; gk++) {
      var rGroup = groups[groupKeys[gk]];
      if (rGroup.length < 2) continue;

      // Encontrar el contenedor lógico común más cercano (Question Block)
      var firstRadio = rGroup[0];
      var questionBlock = firstRadio.closest('.col-sm-6, .form-group, fieldset, form, [class*="pregunta"], [class*="question"], .card, .box_white, table, #content, div');
      
      // Asegurarse de que el bloque no sea todo el body
      if (questionBlock && questionBlock.tagName === 'BODY') {
        questionBlock = firstRadio.closest('div');
      }

      var statement = '';
      var optionsList = [];

      // 1. Extraer alternativas en orden estricto
      var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
      rGroup.forEach(function(radio, rIdx) {
        var optText = getOptionTextFromInput(radio);
        // Limpiar letras iniciales de la alternativa si ya las tenía ("A. Lima" -> "Lima")
        optText = optText.replace(/^[A-Za-z0-9][\.\)\-]\s*/, '').trim();
        if (optText) {
          optionsList.push({
            id: letters[rIdx] || String(rIdx + 1),
            text: optText,
            isInputChecked: !!radio.checked
          });
        }
      });

      // 2. Extraer Enunciado de la Pregunta
      if (questionBlock) {
        // En UDABOL: <p style="font-size: 1.2em;"> o <div style="font-size: 1.2em;">
        var specificStatement = questionBlock.querySelector('[style*="font-size: 1.2em"], [style*="font-size:1.2em"], [class*="enunciado"], [class*="statement"], [class*="qtext"], .question-text, h4, h5');
        if (specificStatement) {
          statement = clean(specificStatement.innerText || specificStatement.textContent);
        }

        // Si no hay selector específico, buscar hermanos previos al contenedor de las opciones
        if (!statement || statement.length < 5) {
          var optionsContainer = firstRadio.closest('.left, ul, ol, table, div');
          if (optionsContainer && optionsContainer.previousElementSibling) {
            var prev = optionsContainer.previousElementSibling;
            while (prev && (prev.tagName === 'BR' || prev.tagName === 'HR' || clean(prev.innerText || prev.textContent).length === 0)) {
              prev = prev.previousElementSibling;
            }
            if (prev) {
              statement = clean(prev.innerText || prev.textContent);
            }
          }
        }

        // Fallback: párrafos dentro del bloque que no sean opciones
        if (!statement || statement.length < 5) {
          var pElements = questionBlock.querySelectorAll('p, div');
          for (var pi = 0; pi < pElements.length; pi++) {
            var pCandidate = clean(pElements[pi].innerText || pElements[pi].textContent);
            var isAnOption = optionsList.some(function(o) { return o.text === pCandidate; });
            if (!isAnOption && pCandidate.length >= 6) {
              statement = pCandidate;
              break;
            }
          }
        }
      }

      statement = cleanStatementText(statement);

      if (statement.length >= 4 && optionsList.length >= 2) {
        var qImages = extractImagesFromContainer(questionBlock);
        var qNum = extractedQuestions.length + 1;
        var numMatch = (statement.match(/^(?:Pregunta\s*nro\.?\s*|\bPregunta\s*)?(\d+)/i) || (questionBlock ? (questionBlock.innerText || '').match(/Pregunta\s*nro\.?\s*(\d+)/i) : null));
        if (numMatch && numMatch[1]) {
          qNum = parseInt(numMatch[1], 10) || qNum;
        }

        extractedQuestions.push({
          id: 'q' + qNum,
          number: qNum,
          type: 'single_choice',
          statement: statement,
          alternatives: optionsList,
          images: qImages,
          confidence: 0.95,
          course: detectedCourse,
          rawSnippet: questionBlock ? questionBlock.outerHTML.substring(0, 15000) : ''
        });

        if (!matchedDomPath) {
          matchedDomPath = getDomPath(questionBlock || firstRadio);
          strategyUsed = 'radios_estructural (UDABOL/Web)';
          primarySnippetHtml = questionBlock ? questionBlock.outerHTML.substring(0, 25000) : '';
        }
      }
    }
  }

  // ESTRATEGIA B: Checkboxes (Preguntas de Opción Múltiple)
  if (extractedQuestions.length === 0 && visibleCheckboxes.length >= 2) {
    var checkBlock = visibleCheckboxes[0].closest('form, fieldset, [class*="pregunta"], [class*="question"], .col-sm-6, div');
    var chkOptions = [];
    var chkLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    visibleCheckboxes.forEach(function(chk, cIdx) {
      var ot = getOptionTextFromInput(chk).replace(/^[A-Za-z0-9][\.\)\-]\s*/, '').trim();
      if (ot) {
        chkOptions.push({
          id: chkLetters[cIdx] || String(cIdx + 1),
          text: ot,
          isInputChecked: !!chk.checked
        });
      }
    });

    var chkStatement = '';
    if (checkBlock) {
      var prevP = checkBlock.querySelector('[style*="font-size: 1.2em"], p, h4, h5, legend');
      if (prevP) chkStatement = cleanStatementText(prevP.innerText || prevP.textContent);
    }

    if (chkStatement.length >= 4 && chkOptions.length >= 2) {
      extractedQuestions.push({
        id: 'q1',
        number: 1,
        type: 'multiple_choice',
        statement: chkStatement,
        alternatives: chkOptions,
        images: extractImagesFromContainer(checkBlock),
        confidence: 0.92,
        course: detectedCourse,
        rawSnippet: checkBlock ? checkBlock.outerHTML.substring(0, 15000) : ''
      });
      strategyUsed = 'checkboxes_multiple_choice';
      matchedDomPath = getDomPath(checkBlock || visibleCheckboxes[0]);
      primarySnippetHtml = checkBlock ? checkBlock.outerHTML.substring(0, 25000) : '';
    }
  }

  // ESTRATEGIA C: Select con opciones
  if (extractedQuestions.length === 0 && allSelects.length > 0) {
    for (var si = 0; si < allSelects.length; si++) {
      var sel = allSelects[si];
      var selBlock = sel.closest('.form-group, fieldset, div, tr');
      var selOptions = [];
      var optEls = sel.querySelectorAll('option');
      optEls.forEach(function(o, oIdx) {
        var ot = clean(o.innerText || o.textContent);
        if (ot && !/(?:seleccione|elegir|select)/i.test(ot)) {
          selOptions.push({
            id: String.fromCharCode(65 + selOptions.length),
            text: ot,
            isInputChecked: !!o.selected
          });
        }
      });

      var selStatement = '';
      if (selBlock) {
        var lbl = selBlock.querySelector('label, strong, p, th');
        if (lbl) selStatement = cleanStatementText(lbl.innerText || lbl.textContent);
      }

      if (selStatement.length >= 4 && selOptions.length >= 2) {
        extractedQuestions.push({
          id: 'q' + (si + 1),
          number: si + 1,
          type: 'single_choice',
          statement: selStatement,
          alternatives: selOptions,
          images: extractImagesFromContainer(selBlock),
          confidence: 0.88,
          course: detectedCourse,
          rawSnippet: selBlock ? selBlock.outerHTML.substring(0, 15000) : ''
        });
        strategyUsed = 'select_dropdown';
        matchedDomPath = getDomPath(sel);
        primarySnippetHtml = selBlock ? selBlock.outerHTML.substring(0, 25000) : '';
      }
    }
  }

  // ESTRATEGIA D: Preguntas abiertas (Textarea)
  if (extractedQuestions.length === 0 && allTextareas.length > 0) {
    for (var ti = 0; ti < allTextareas.length; ti++) {
      var ta = allTextareas[ti];
      var taBlock = ta.closest('.form-group, fieldset, div');
      var taStatement = '';
      if (taBlock) {
        var tLbl = taBlock.querySelector('label, h4, h5, p, legend');
        if (tLbl) taStatement = cleanStatementText(tLbl.innerText || tLbl.textContent);
      }
      if (taStatement.length >= 4) {
        extractedQuestions.push({
          id: 'q' + (ti + 1),
          number: ti + 1,
          type: 'open_question',
          statement: taStatement,
          alternatives: [],
          images: extractImagesFromContainer(taBlock),
          confidence: 0.85,
          course: detectedCourse,
          rawSnippet: taBlock ? taBlock.outerHTML.substring(0, 15000) : ''
        });
        strategyUsed = 'textarea_open_question';
        matchedDomPath = getDomPath(ta);
        primarySnippetHtml = taBlock ? taBlock.outerHTML.substring(0, 25000) : '';
      }
    }
  }

  // Si no se capturó un snippet específico, usar el contenedor principal de la página (ej. #content de UDABOL)
  if (!primarySnippetHtml) {
    var mainContent = doc.querySelector('#content, .main_content, main, article, form, body');
    if (mainContent) {
      primarySnippetHtml = mainContent.innerHTML.substring(0, 30000);
    } else {
      primarySnippetHtml = fullHtml.substring(0, 30000);
    }
  }

  var telemetry = {
    url: pageUrl,
    title: pageTitle,
    formsCount: doc.forms.length,
    inputsCount: doc.querySelectorAll('input').length,
    radiosCount: allRadios.length,
    checkboxesCount: allCheckboxes.length,
    labelsCount: doc.querySelectorAll('label').length,
    candidatesCount: extractedQuestions.length,
    rawHtmlLength: fullHtml.length,
    strategyUsed: strategyUsed,
    domPath: matchedDomPath,
    rawQuestionHtml: primarySnippetHtml,
    errorReason: extractedQuestions.length === 0 ? 'No se detectaron preguntas con alternativas válidas en el DOM renderizado.' : null,
    timestamp: new Date().toISOString()
  };

  return JSON.stringify({
    url: pageUrl,
    title: pageTitle,
    course: detectedCourse,
    questions: extractedQuestions,
    telemetry: telemetry,
    isSuccess: extractedQuestions.length > 0,
    errorMessage: extractedQuestions.length === 0 ? telemetry.errorReason : null
  });
})()
''';

  /// Ejecuta la extracción en el [WebViewController] activo tolerando transiciones SPA
  static Future<QuizExtractionResult> extractQuiz(WebViewController controller) async {
    QuizExtractionResult? lastResult;

    // Intentar hasta 4 veces con intervalo de 300ms para tolerar transiciones AJAX de Backbone.js
    for (int attempt = 0; attempt < 4; attempt++) {
      try {
        final rawResult = await controller.runJavaScriptReturningResult(extractorJs);
        String cleanResult = rawResult.toString().trim();

        // Limpiar comillas iniciales y finales devueltas por webview_flutter en algunas plataformas
        if (cleanResult.startsWith('"') && cleanResult.endsWith('"')) {
          cleanResult = cleanResult.substring(1, cleanResult.length - 1);
          cleanResult = cleanResult.replaceAll(r'\"', '"').replaceAll(r'\\', r'\');
        }

        if (cleanResult.isNotEmpty && cleanResult != 'null' && cleanResult.startsWith('{')) {
          final Map<String, dynamic> jsonMap = jsonDecode(cleanResult);
          final result = QuizExtractionResult.fromJson(jsonMap);

          if (result.isSuccess && result.questions.isNotEmpty) {
            return result; // ¡Preguntas extraídas con éxito!
          }
          lastResult = result;
        }
      } catch (e) {
        debugPrint('Intento $attempt de extracción JS falló: $e');
      }

      if (attempt < 3) {
        await Future.delayed(const Duration(milliseconds: 300));
      }
    }

    // Si tras 4 intentos no hubo preguntas, devolver el último resultado obtenido (con su telemetría DOM intacta)
    return lastResult ?? QuizExtractionResult.empty(
      reason: 'No se encontraron preguntas en el DOM tras reintentos.',
    );
  }
}
