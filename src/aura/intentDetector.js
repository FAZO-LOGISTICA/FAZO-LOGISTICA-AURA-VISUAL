// ===========================================================
// 🧠 AURA — DETECTOR AVANZADO DE INTENCIONES + ACCIONES
// FAZO MASTER AI — PRODUCCIÓN
// ===========================================================

/**
 * FUNCIÓN PRINCIPAL ESPERADA POR App.js
 * Devuelve un comando EJECUTABLE o null
 *
 * @param {string} texto
 * @returns {{ tipo: string, payload: any } | null}
 */
export function detectarComando(texto) {
  if (!texto || typeof texto !== "string") return null;

  const accion = detectarAccion(texto);
  const modulo = detectarIntent(texto);

  // 🚪 ABRIR MÓDULO
  if (accion === "abrir" && modulo && modulo !== "general") {
    return {
      tipo: "ABRIR_MODULO",
      payload: modulo,
    };
  }

  // ❌ No hay comando ejecutable
  return null;
}

/**
 * DETECTOR DE ACCIÓN (VERBOS)
 */
function detectarAccion(texto) {
  const msg = normalizar(texto);

  const accionesAbrir = [
    "abre",
    "abrir",
    "abrir el",
    "abrir la",
    "mostrar",
    "ir a",
    "entra a",
    "entrar a",
    "ver",
  ];

  if (accionesAbrir.some((a) => msg.includes(a))) {
    return "abrir";
  }

  return null;
}

/**
 * DETECTOR AVANZADO DE INTENCIONES (TUS MÓDULOS)
 */
export function detectarIntent(texto) {
  const msg = normalizar(texto);

  const intents = {
    aguaruta: [
      "aguaruta",
      "agua ruta",
      "litros",
      "aljibe",
      "camion",
      "camión",
      "estanques",
      "ruta",
      "puntos",
      "laguna verde",
    ],

    traslado: [
      "traslado",
      "vehiculo",
      "vehículo",
      "movilizacion",
      "movilización",
      "reserva",
      "chofer",
      "viaje",
    ],

    flota: [
      "flota",
      "mantenimiento",
      "combustible",
      "kilometraje",
      "neumaticos",
      "mantencion",
      "taller",
    ],

    reportes: [
      "reporte",
      "informe",
      "estadistica",
      "dashboard",
      "pdf",
      "excel",
    ],

    documentos: [
      "oficio",
      "memorando",
      "carta",
      "correo",
      "redactar",
      "firma",
    ],

    planillas: [
      "planilla",
      "excel",
      "horas",
      "sueldos",
      "turnos",
    ],

    analisis: [
      "kpi",
      "indicador",
      "analisis",
      "tendencia",
      "proyeccion",
    ],
  };

  let bestMatch = "general";
  let bestScore = 0;

  for (const intent in intents) {
    const palabras = intents[intent];
    const score = palabras.filter((p) => msg.includes(p)).length;

    if (score >= 1 && score > bestScore) {
      bestScore = score;
      bestMatch = intent;
    }
  }

  return bestMatch;
}

/**
 * NORMALIZADOR GLOBAL
 */
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
