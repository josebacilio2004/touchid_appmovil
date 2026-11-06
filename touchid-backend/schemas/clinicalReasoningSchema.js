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
      description: "Especialidad médica detectada (ej. Pediatría, Técnica Quirúrgica, Ginecología, Patología, Fisiopatología, Farmacología, Reumatología)."
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

const ALL_OPTION_REGEX = /^\s*([a-e][\)\.\-]\s*)?(todas|todas\s+las\s+anteriores|todas\s+son\s+correctas|todas\s+son\s+verdaderas|todos|todos\s+son\s+correctos)\s*\.?\s*$/i;
const NONE_OPTION_REGEX = /^\s*([a-e][\)\.\-]\s*)?(ninguna|ninguna\s+de\s+las\s+anteriores|ninguna\s+es\s+correcta|ninguno)\s*\.?\s*$/i;

/**
 * Guardia Determinista Post-LLM para Preguntas en Negativo ("EXCEPTO" / "FALSO"), Afirmativas
 * y anti-trampa para opciones "Todas" / "Ninguna".
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
    // Separar opciones específicas de opciones meta ("Todas", "Ninguna")
    const specificEvals = evals.filter(e => {
      if (!e || typeof e.index !== "number" || e.index < 0 || e.index >= studentOptions.length) return false;
      const optTxt = String(studentOptions[e.index] || '');
      return !ALL_OPTION_REGEX.test(optTxt) && !NONE_OPTION_REGEX.test(optTxt);
    });

    const specificTrue = specificEvals.filter(e => e.verdict === "VERDADERO");
    const specificFalse = specificEvals.filter(e => e.verdict === "FALSO");

    const allOptionIdx = studentOptions.findIndex(o => ALL_OPTION_REGEX.test(String(o || '')));
    const noneOptionIdx = studentOptions.findIndex(o => NONE_OPTION_REGEX.test(String(o || '')));

    // Caso A: El modelo marcó "Todas", pero en su evaluación solo 1 opción específica es VERDADERA y hay específicas FALSAS
    if (allOptionIdx !== -1 && llmResult.correct_option_index === allOptionIdx && specificTrue.length === 1 && specificFalse.length >= 1) {
      const realIdx = specificTrue[0].index;
      console.warn(`[GUARDIA-ANTI-TODAS] ⚠️ Bloqueado falso "Todas": solo la opción ${realIdx} ("${studentOptions[realIdx]}") es verdadera.`);
      llmResult.correct_option_index = realIdx;
      llmResult.correct_option_text = studentOptions[realIdx];
    }
    // Caso B: Solo hay 1 opción con verdict "VERDADERO" en total
    else {
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
      } else if (specificEvals.length >= 2 && specificTrue.length === 0 && noneOptionIdx !== -1) {
        // Todas las opciones específicas son FALSAS y existe "Ninguna"
        if (llmResult.correct_option_index !== noneOptionIdx) {
          console.log(`[GUARDIA-NINGUNA] Todas las opciones específicas son falsas -> seleccionando "Ninguna" (índice ${noneOptionIdx})`);
          llmResult.correct_option_index = noneOptionIdx;
          llmResult.correct_option_text = studentOptions[noneOptionIdx];
        }
      }
    }
  }

  // Asegurar que el texto y la letra coincidan exactamente con la opción del estudiante en dicho índice
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F'];
  if (typeof llmResult.correct_option_index === "number" && 
      llmResult.correct_option_index >= 0 && 
      llmResult.correct_option_index < studentOptions.length) {
    llmResult.correct_option_text = studentOptions[llmResult.correct_option_index];
    llmResult.correct_option_letter = alphabet[llmResult.correct_option_index] || 'A';
  }

  return llmResult;
}

module.exports = {
  CLINICAL_REASONING_SCHEMA,
  enforceNegativeQuestionConsistency
};
