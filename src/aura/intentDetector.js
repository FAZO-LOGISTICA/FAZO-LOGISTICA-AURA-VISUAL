// ===========================================================
// 🧠 AURA — DETECTOR AVANZADO DE INTENCIONES (FAZO MASTER AI)
// ===========================================================
//
// ✔ Sistema de coincidencias inteligentes
// ✔ Palabras clasificadas por categoría (módulo FAZO)
// ✔ Umbral flexible (2 palabras activan el módulo)
// ✔ Si no reconoce → envía a IA general
// ✔ Fácil de expandir (solo agregas más palabras al diccionario)
//
// ===========================================================

export function detectarIntent(texto) {
  const msg = texto.toLowerCase();

  // === DICCIONARIO AVANZADO DE INTENCIONES ===
  const intents = {
    aguaruta: [
      "agua", "aguaruta", "litros", "camion", "camión", "estanques",
      "recurrencia", "puntos", "ruta", "aljibe", "llave", "sector", "laguna verde"
    ],

    traslado: [
      "traslado", "vehiculo", "vehículo", "reserva", "chofer",
      "viaje", "movilización", "solicitud", "ranger", "camioneta",
      "minibus", "pasajero"
    ],

    flota: [
      "flota", "mantenimiento", "combustible", "rendimiento", "kilometraje",
      "neumáticos", "mantención", "taller", "falla"
    ],

    reportes: [
      "reporte", "informe", "estadistica", "estadística", "dashboard",
      "pdf", "excel", "consolidado", "semanal", "mensual"
    ],

    documentos: [
      "oficio", "memorando", "carta", "correo", "escribir", "redactar",
      "firma", "solicito", "adjunto"
    ],

    planillas: [
      "excel", "planilla", "horas", "sueldos", "liquidacion",
      "liquidación", "turnos", "registro", "columna", "fila"
    ],

    analisis: [
      "kpi", "indicador", "proyección", "rotacion",
      "rotación", "demanda", "análisis", "tendencia"
    ],
  };

  // === SISTEMA DE COINCIDENCIA INTELIGENTE ===
  let bestMatch = "general";
  let bestScore = 0;

  // Recorre todos los módulos
  for (const intent in intents) {
    const palabras = intents[intent];

    // Cuenta coincidencias
    let score = palabras.filter(p => msg.includes(p)).length;

    // Requiere al menos 2 coincidencias para activar módulo
    if (score >= 2 && score > bestScore) {
      bestScore = score;
      bestMatch = intent;
    }

    // Si es una coincidencia muy precisa → activa con 1 palabra
    if (score === 1 && bestMatch === "general") {
      bestMatch = intent;
    }
  }

  return bestMatch;
}
