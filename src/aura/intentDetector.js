// ===========================================================
// 🧠 AURA — DETECTOR AVANZADO DE INTENCIONES (FAZO MASTER AI)
// ===========================================================
//
// ✔ Sistema de coincidencias inteligentes
// ✔ Palabras clasificadas por categoría (módulo FAZO)
// ✔ Umbral flexible (2 palabras activan el módulo)
// ✔ Compatible con App.js (exporta detectarComando)
// ✔ Fácil de expandir
//
// ===========================================================

/**
 * FUNCIÓN PRINCIPAL ESPERADA POR App.js
 * Devuelve un objeto de comando estructurado o null
 *
 * @param {string} texto
 * @returns {{ tipo: string, payload: any } | null}
 */
export function detectarComando(texto) {
  if (!texto || typeof texto !== "string") return null;

  const intent = detectarIntent(texto);

  if (!intent || intent === "general") return null;

  // Mapeo de intención → tipo de acción
  switch (intent) {
    case "aguaruta":
    case "traslado":
    case "flota":
    case "reportes":
    case "documentos":
    case "planillas":
    case "analisis":
      return {
        tipo: "MODULO",
        payload: intent,
      };

    default:
      return null;
  }
}

/**
 * DETECTOR AVANZADO DE INTENCIONES (TU LÓGICA ORIGINAL)
 * @param {string} texto
 * @returns {string} intent
 */
export function detectarIntent(texto) {
  const msg = texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // === DICCIONARIO AVANZADO DE INTENCIONES ===
  const intents = {
    aguaruta: [
      "agua", "aguaruta", "litros", "camion", "camión", "estanques",
      "recurrencia", "puntos", "ruta", "aljibe", "llave", "sector", "laguna verde"
    ],

    traslado: [
      "traslado", "vehiculo", "vehículo", "reserva", "chofer",
      "viaje", "movilizacion", "movilización", "solicitud",
      "ranger", "camioneta", "minibus", "pasajero"
    ],

    flota: [
      "flota", "mantenimiento", "combustible", "rendimiento",
      "kilometraje", "neumaticos", "neumáticos", "mantencion",
      "mantención", "taller", "falla"
    ],

    reportes: [
      "reporte", "informe", "estadistica", "estadística",
      "dashboard", "pdf", "excel", "consolidado", "semanal", "mensual"
    ],

    documentos: [
      "oficio", "memorando", "carta", "correo", "escribir",
      "redactar", "firma", "solicito", "adjunto"
    ],

    planillas: [
      "excel", "planilla", "horas", "sueldos", "liquidacion",
      "liquidación", "turnos", "registro", "columna", "fila"
    ],

    analisis: [
      "kpi", "indicador", "proyeccion", "proyección",
      "rotacion", "rotación", "demanda", "analisis",
      "análisis", "tendencia"
    ],
  };

  // === SISTEMA DE COINCIDENCIA INTELIGENTE ===
  let bestMatch = "general";
  let bestScore = 0;

  for (const intent in intents) {
    const palabras = intents[intent];
    const score = palabras.filter((p) => msg.includes(p)).length;

    // Activación fuerte
    if (score >= 2 && score > bestScore) {
      bestScore = score;
      bestMatch = intent;
    }

    // Activación suave si no hay nada mejor
    if (score === 1 && bestMatch === "general") {
      bestMatch = intent;
    }
  }

  return bestMatch;
}
