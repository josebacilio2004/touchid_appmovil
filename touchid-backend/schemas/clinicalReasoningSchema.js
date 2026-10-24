/**
 * clinicalReasoningSchema.js
 * Esquema de Decodificación Restringida y Guardia Determinista de Coherencia
 * 
 * Previene el bug de atención autorregresiva obligando al modelo Transformer
 * a evaluar y falsificar CADA opción en options_evaluation ANTES de emitir el token
 * de correct_option_index.
 */

const CLINICAL_REASONING_SCHEMA = {
  type: "OBJECT",
  properties: {
    subject: {
      type: "STRING",
      description: "Especialidad médica detectada (ej. Pediatría, Técnica Quirúrgica, Ginecología, Patología, Fisiopatología, Farmacología)."
    },
    is_negative_question: {
      type: "BOOLEAN",
      description: "TRUE si la pregunta pide marcar lo FALSO, EXCEPTO, INCORRECTO o NO CORRESPONDE. FALSE si pide la opción correcta o afirmativa."
    },
    clinical_key_pearl: {
      type: "STRING",
      description: "Regla de oro bibliográfica exacta (corte numérico, clasificación temporal, secuencia, definición o fármaco) que resuelve la pregunta."
    },
    options_evaluation: {
      type: "ARRAY",
      description: "Auditoría individual obligatoria de CADA opción en orden (0, 1, 2, 3...) ANTES de emitir el índice ganador.",
      items: {
        type: "OBJECT",
        properties: {
          index: { type: "INTEGER" },
          verdict: {
            type: "STRING",
            enum: ["VERDADERO", "FALSO"],
            description: "Si la afirmación médica de esta opción es intrínsecamente verdadera o falsa según la literatura canónica."
          },
          trap_check: {
            type: "STRING",
            description: "Máximo 15 palabras: valida cifras exactas, orden de pasos o distractores morfológicos."
          }
        },
        required: ["index", "verdict", "trap_check"]
      }
    },
    correct_option_index: {
      type: "INTEGER",
      description: "Índice (0 a N-1) de la opción elegida. Si is_negative_question=true, DEBE ser el índice cuyo verdict sea FALSO."
    },
    correct_option_text: {
      type: "STRING",
      description: "Texto exacto de la opción seleccionada."
    },
    explanation: {
      type: "STRING",
      description: "Justificación concisa en máximo 15 palabras."
    }
  },
  required: [
    "subject",
    "is_negative_question",
    "clinical_key_pearl",
    "options_evaluation",
    "correct_option_index",
    "correct_option_text",
    "explanation"
  ]
};

/**
 * Guardia Determinista Post-LLM para Preguntas en Negativo ("EXCEPTO" / "FALSO") y Afirmativas.
 * Corrige el clásico error donde el modelo identifica cuál es la opción FALSA en su análisis
 * pero por inercia decodificadora marca una opción VERDADERA en correct_option_index.
 */
function enforceNegativeQuestionConsistency(llmResult, studentOptions) {
  if (!llmResult || !studentOptions || !Array.isArray(studentOptions) || studentOptions.length === 0) {
    return llmResult;
  }

  const evals = Array.isArray(llmResult.options_evaluation) ? llmResult.options_evaluation : [];

  if (llmResult.is_negative_question === true) {
    // En preguntas negativas ("EXCEPTO", "FALSA", "NO CORRESPONDE"), buscamos la opción marcada FALSO
    const falseOptions = evals.filter(e => e && e.verdict === "FALSO");
    if (falseOptions.length === 1) {
      const targetIdx = falseOptions[0].index;
      if (typeof targetIdx === "number" && targetIdx >= 0 && targetIdx < studentOptions.length) {
        if (llmResult.correct_option_index !== targetIdx) {
          console.warn(`[GUARDIA-NEGATIVA] ⚠️ Corrección de inversión en pregunta negativa: índice ${llmResult.correct_option_index} -> ${targetIdx} ("${studentOptions[targetIdx]}")`);
          llmResult.correct_option_index = targetIdx;
          llmResult.correct_option_text = studentOptions[targetIdx];
        }
      }
    }
  } else {
    // En preguntas afirmativas, si solo hay 1 opción con verdict "VERDADERO"
    const trueOptions = evals.filter(e => e && e.verdict === "VERDADERO");
    if (trueOptions.length === 1) {
      const targetIdx = trueOptions[0].index;
      if (typeof targetIdx === "number" && targetIdx >= 0 && targetIdx < studentOptions.length) {
        if (llmResult.correct_option_index !== targetIdx) {
          console.log(`[GUARDIA-AFIRMATIVA] Alineando índice con única opción verdadera: ${llmResult.correct_option_index} -> ${targetIdx}`);
          llmResult.correct_option_index = targetIdx;
          llmResult.correct_option_text = studentOptions[targetIdx];
        }
      }
    }
  }

  // Asegurar que el texto coincida exactamente con la opción del estudiante en dicho índice
  if (typeof llmResult.correct_option_index === "number" && 
      llmResult.correct_option_index >= 0 && 
      llmResult.correct_option_index < studentOptions.length) {
    llmResult.correct_option_text = studentOptions[llmResult.correct_option_index];
  }

  return llmResult;
}

module.exports = {
  CLINICAL_REASONING_SCHEMA,
  enforceNegativeQuestionConsistency
};
