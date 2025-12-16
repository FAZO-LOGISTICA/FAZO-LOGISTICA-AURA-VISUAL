// =======================================================
//  AURA_Intelligence.js — CENTRAL INTELLIGENCE CORE 2025
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Motor semántico + intenciones + módulos
// =======================================================
//
//  AURAChat → usa este archivo para:
//
//   ✔ entender lo que dice Gustavo
//   ✔ detectar intenciones profundas
//   ✔ activar módulos FAZO OS
//   ✔ elegir subrutas internas
//   ✔ activar acciones reales (AURA_Actions)
//   ✔ decidir si debe hablar, ejecutar o preguntar
//
// =======================================================

export function interpretarMensaje(texto = "") {
  const t = normalizar(texto);

  // =======================================================
  // 1) INTENCIONES GLOBALES (FUNCIONAN PARA CUALQUIER PROYECTO)
  // =======================================================

  if (intenta(t, ["crear", "generar", "hacer"]) &&
      intenta(t, ["reporte", "informe", "pdf"])) {
    return accion("crear-reporte", "Generando reporte solicitado.");
  }

  if (intenta(t, ["buscar", "encontrar"]) &&
      intenta(t, ["persona", "usuario", "punto"])) {
    return accion("buscar-registro", "Buscando información.");
  }

  if (intenta(t, ["optimizar", "mejorar", "redistribuir"])) {
    return accion("optimizar", "Ejecutando optimización.");
  }

  // =======================================================
  // 2) MÓDULOS FAZO OS — UNIVERSALES
  // =======================================================

  if (intenta(t, ["agua", "aguaruta", "agua ruta", "camiones"])) {
    return modulo("aguaruta", "Abriendo módulo AguaRuta.");
  }

  if (intenta(t, ["traslado", "vehiculos", "taxi municipal"])) {
    return modulo("traslado", "Mostrando Traslado Municipal.");
  }

  if (intenta(t, ["flota", "maestranza", "vehículo municipal"])) {
    return modulo("flota", "Panel de Flota Municipal cargado.");
  }

  if (intenta(t, ["reporte", "reportes", "analisis"])) {
    return modulo("reportes", "Abriendo sistema de reportes FAZO.");
  }

  if (intenta(t, ["ajustes", "configuracion", "preferencias"])) {
    return modulo("ajustes", "Cargando ajustes del sistema FAZO.");
  }

  if (intenta(t, ["inicio", "home", "aura"])) {
    return modulo("aura", "Regresando al inicio.");
  }

  // =======================================================
  // 3) SUBRUTAS INTERNAS DE AGUARUTA
  // =======================================================

  if (intenta(t, ["rutas activas", "activos", "activa ruta"])) {
    return subruta("rutas-activas", "Abriendo Rutas Activas.");
  }

  if (intenta(t, ["mapa", "ver mapa"])) {
    return subruta("mapa", "Mostrando Mapa de AguaRuta.");
  }

  if (intenta(t, ["graficos", "estadisticas globales"])) {
    return subruta("graficos", "Mostrando Gráficos.");
  }

  if (intenta(t, ["no entregadas", "faltantes"])) {
    return subruta("no-entregadas", "Mostrando entregas no realizadas.");
  }

  if (intenta(t, ["registrar entrega", "nueva entrega"])) {
    return subruta("registrar-entrega", "Abriendo formulario de entrega.");
  }

  if (intenta(t, ["comparacion", "semanal"])) {
    return subruta("comparacion-semanal", "Comparación semanal lista.");
  }

  if (intenta(t, ["estadistica camion", "litros por dia"])) {
    return subruta("camion-estadisticas", "Estadísticas por camión.");
  }

  if (intenta(t, ["nueva distribucion"])) {
    return subruta("nueva-distribucion", "Nueva distribución abierta.");
  }

  if (intenta(t, ["editar distribucion", "editar redistribucion"])) {
    return subruta("editar-redistribucion", "Editor de redistribución listo.");
  }

  // =======================================================
  // 4) ACCIONES GENÉRICAS
  // =======================================================

  if (intenta(t, ["cerrar sesion", "logout"])) {
    return accion("logout", "Cerrando sesión.");
  }

  if (intenta(t, ["abrir rutas"])) {
    return accion("abrir-rutas", "Abriendo rutas asignadas.");
  }

  if (intenta(t, ["abrir mapa"])) {
    return accion("abrir-mapa", "Mostrando mapa.");
  }

  if (intenta(t, ["limpiar", "resetear"])) {
    return accion("limpiar", "Limpiando datos y estado.");
  }

  // =======================================================
  // 5) RECONOCIMIENTO EMOCIONAL
  // =======================================================

  if (intenta(t, ["estresado", "cansado", "agotado"])) {
    return respuesta("Entiendo, Gustavo… respira. Estoy aquí para ayudarte.");
  }

  if (intenta(t, ["triste", "apenado"])) {
    return respuesta("Lamento que te sientas así… ¿qué pasó?");
  }

  if (intenta(t, ["feliz", "contento"])) {
    return respuesta("¡Qué buena noticia Gustavo! Sigamos avanzando.");
  }

  // =======================================================
  // 6) SI NO SE DETECTA NADA → BACKEND IA
  // =======================================================

  return { tipo: "backend", textoOriginal: texto };
}

/* ======================================================= */
// UTILIDADES PROFESIONALES
/* ======================================================= */

function intenta(texto, patrones) {
  return patrones.some((p) => texto.includes(p));
}

function normalizar(t) {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function modulo(nombre, frase) {
  return { tipo: "modulo", modulo: nombre, frase };
}

function subruta(ruta, frase) {
  return { tipo: "subruta", ruta, frase };
}

function accion(nombre, frase) {
  return { tipo: "accion", accion: nombre, frase };
}

function respuesta(texto) {
  return { tipo: "respuesta", texto };
}
