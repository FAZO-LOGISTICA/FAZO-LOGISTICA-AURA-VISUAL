// =======================================================
//  AURA_NaturalLanguage.js — CEREBRO LINGÜÍSTICO 2025
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Motor semántico + detección de intenciones
// =======================================================

/*
   Este módulo interpreta lo que dice el usuario de forma
   humana: detecta intención, sinónimos, contexto general,
   comandos implícitos y solicitudes ambiguas.

   AURA_Agent.js usa este resultado para decidir qué hacer.
*/

// =======================================================
// UTILIDADES
// =======================================================

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function includesAny(text, words) {
  return words.some((w) => text.includes(w));
}

// =======================================================
// INTELIGENCIA PRINCIPAL
// =======================================================

export default function interpretarMensaje(texto = "") {
  const t = normalize(texto.trim());

  // Si está vacío → nada que interpretar
  if (!t) return { tipo: "vacio", textoOriginal: texto };

  // =====================================================
  // 1) INTENCIONES TIPO: SALUDOS / CONVERSACIÓN
  // =====================================================
  if (includesAny(t, ["hola", "buenas", "que tal", "saludos"])) {
    return { tipo: "conversacion", subtipo: "saludo" };
  }

  if (includesAny(t, ["como estas", "como vai", "que haces"])) {
    return { tipo: "conversacion", subtipo: "estado" };
  }

  if (includesAny(t, ["gracias", "te pasaste", "genial"])) {
    return { tipo: "conversacion", subtipo: "agradecimiento" };
  }

  // =====================================================
  // 2) MÓDULOS FAZO OS (sistemas completos)
  // =====================================================

  // --- AguaRuta
  if (includesAny(t, ["agua", "aguaruta", "camiones", "aljibe"])) {
    return { tipo: "modulo", modulo: "aguaruta" };
  }

  // --- Traslado Municipal
  if (includesAny(t, ["traslado", "movil", "reserva", "vehiculo"])) {
    return { tipo: "modulo", modulo: "traslado" };
  }

  // --- Flota Municipal
  if (includesAny(t, ["flota", "maestranza", "mantencion", "reparacion"])) {
    return { tipo: "modulo", modulo: "flota" };
  }

  // --- Reportes / Informes
  if (includesAny(t, ["reporte", "informe", "analisis", "estudio"])) {
    return { tipo: "modulo", modulo: "reportes" };
  }

  // --- Ajustes, configuración
  if (includesAny(t, ["ajustes", "configuracion", "preferencias"])) {
    return { tipo: "modulo", modulo: "ajustes" };
  }

  // --- Panel principal AURA
  if (includesAny(t, ["inicio", "panel", "aura"])) {
    return { tipo: "modulo", modulo: "aura" };
  }

  // =====================================================
  // 3) SUBRUTAS DE AguaRuta
  // =====================================================

  if (includesAny(t, ["rutas activas", "activos", "puntos activos"])) {
    return { tipo: "subruta", ruta: "rutas-activas" };
  }

  if (includesAny(t, ["no entregadas", "faltantes", "sin entregar"])) {
    return { tipo: "subruta", ruta: "no-entregadas" };
  }

  if (includesAny(t, ["comparacion", "semanal", "comparar semana"])) {
    return { tipo: "subruta", ruta: "comparacion-semanal" };
  }

  if (includesAny(t, ["estadistica", "litros por dia", "camion"])) {
    return { tipo: "subruta", ruta: "camion-estadisticas" };
  }

  if (includesAny(t, ["registrar entrega", "nueva entrega", "agregar entrega"])) {
    return { tipo: "subruta", ruta: "registrar-entrega" };
  }

  if (includesAny(t, ["nueva distribucion", "redistribucion nueva"])) {
    return { tipo: "subruta", ruta: "nueva-distribucion" };
  }

  if (includesAny(t, ["editar redistribucion", "editar distribucion"])) {
    return { tipo: "subruta", ruta: "editar-redistribucion" };
  }

  // =====================================================
  // 4) ACCIONES DIRECTAS (comandos explícitos)
  // =====================================================

  if (includesAny(t, ["logout", "cerrar sesion"])) {
    return { tipo: "accion", accion: "logout" };
  }

  if (includesAny(t, ["abrir mapa", "mostrar mapa"])) {
    return { tipo: "accion", accion: "abrir-mapa" };
  }

  if (includesAny(t, ["abrir rutas", "ver rutas"])) {
    return { tipo: "accion", accion: "abrir-rutas" };
  }

  if (includesAny(t, ["actualiza", "refresh", "recargar"])) {
    return { tipo: "accion-general", payload: { event: "refresh" } };
  }

  // =====================================================
  // 5) COMANDOS AVANZADOS (AUTONOMÍA DEL AGENTE)
  // =====================================================

  // --- Duplicados AguaRuta
  if (includesAny(t, ["duplicados", "repetidos", "limpiar base"])) {
    return {
      tipo: "accion-general",
      payload: { event: "limpiar-duplicados", modulo: "aguaruta" },
    };
  }

  // --- Redistribución automática
  if (includesAny(t, ["redistribuye", "organiza rutas", "distribucion inteligente"])) {
    return {
      tipo: "accion-general",
      payload: { event: "redistribuir", modulo: "aguaruta" },
    };
  }

  // --- Reportes automáticos
  if (includesAny(t, ["crea informe", "haz reporte", "genera analisis"])) {
    return {
      tipo: "accion-general",
      payload: { event: "crear-reporte", modulo: "reportes" },
    };
  }

  // =====================================================
  // 6) SI LLEGA AQUÍ → TEXTO LIBRE / GPT
  // =====================================================

  return {
    tipo: "backend",
    textoOriginal: texto,
  };
}
