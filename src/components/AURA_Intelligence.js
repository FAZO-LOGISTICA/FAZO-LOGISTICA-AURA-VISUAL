// =======================================================
//  AURA_Intelligence.js — CEREBRO CENTRAL 2025
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Motor de intenciones + semántica + acciones
// =======================================================

/* 
   Este módulo NO muestra nada en pantalla. 
   Es el “cerebro” que interpreta lo que dice el usuario.

   AURAChat importa este archivo para:
   → detectar intenciones
   → abrir módulos
   → abrir subrutas
   → ejecutar comandos
   → decidir cómo responder
*/

export function interpretarMensaje(texto = "") {
  const t = texto.toLowerCase().trim();

  // =======================================================
  // 1) DETECCIÓN DE INTENCIÓN PRINCIPAL
  // =======================================================

  // ---- AguaRuta (módulo completo)
  if (match(t, ["agua", "aguaruta", "camiones", "rutas de agua"])) {
    return modulo("aguaruta", "Abriendo AguaRuta.");
  }

  // ---- Traslado Municipal
  if (match(t, ["traslado", "vehículos", "traslado municipal"])) {
    return modulo("traslado", "Cargando Traslado Municipal.");
  }

  // ---- Flota Municipal
  if (match(t, ["flota", "maestranza", "camionetas"])) {
    return modulo("flota", "Mostrando Flota Municipal.");
  }

  // ---- Reportes
  if (match(t, ["reporte", "informes", "analisis"])) {
    return modulo("reportes", "Generando módulo de reportes.");
  }

  // ---- Ajustes
  if (match(t, ["ajustes", "configuracion", "preferencias"])) {
    return modulo("ajustes", "Abriendo preferencias del sistema.");
  }

  // ---- Inicio / AURA Home
  if (match(t, ["inicio", "home", "aura"])) {
    return modulo("aura", "Volviendo al inicio.");
  }

  // =======================================================
  // 2) SUBRUTAS DE AGUARUTA
  // =======================================================

  if (match(t, ["rutas activas", "activos", "activa ruta"])) {
    return subruta("rutas-activas", "Abriendo Rutas Activas.");
  }

  if (match(t, ["no entregadas", "no entregada", "faltantes"])) {
    return subruta("no-entregadas", "Mostrando No Entregadas.");
  }

  if (match(t, ["comparacion", "semanal", "comparar"])) {
    return subruta("comparacion-semanal", "Cargando Comparación Semanal.");
  }

  if (match(t, ["estadistica", "camion", "camión", "litros por día"])) {
    return subruta("camion-estadisticas", "Mostrando Estadísticas por Camión.");
  }

  if (match(t, ["registrar entrega", "ingresar entrega", "agregar entrega"])) {
    return subruta("registrar-entrega", "Abriendo Registro de Entrega.");
  }

  if (match(t, ["nueva distribucion", "redistribucion nueva"])) {
    return subruta("nueva-distribucion", "Entrando a Nueva Distribución.");
  }

  if (match(t, ["editar redistribucion", "editar distribucion"])) {
    return subruta("editar-redistribucion", "Herramienta de Redistribución abierta.");
  }

  // =======================================================
  // 3) ACCIONES DIRECTAS
  // =======================================================

  if (match(t, ["cerrar sesion", "logout"])) {
    return accion("logout", "Cerrando sesión.");
  }

  if (match(t, ["abrir mapa", "mostrar mapa"])) {
    return accion("abrir-mapa", "Abriendo Mapa de AguaRuta.");
  }

  if (match(t, ["abrir rutas", "ver rutas"])) {
    return accion("abrir-rutas", "Abriendo rutas asignadas.");
  }

  // =======================================================
  // 4) EMOCIONES / TONO / ESTADO
  // =======================================================

  if (match(t, ["estoy mal", "triste", "apenado"])) {
    return respuesta("Lamento eso Gustavo… aquí estoy para ayudarte en lo que necesites.");
  }

  if (match(t, ["enojado", "molesto"])) {
    return respuesta("Te escucho Gustavo… dime qué pasó y vemos cómo lo resolvemos.");
  }

  if (match(t, ["feliz", "contento"])) {
    return respuesta("Qué bueno escuchar eso 😊 ¿Seguimos avanzando?");
  }

  // =======================================================
  // 5) SI NO ENTIENDE → va al backend
  // =======================================================

  return { tipo: "backend", textoOriginal: texto };
}

/* =======================================================
   UTILIDADES
======================================================= */

function match(texto, palabras) {
  return palabras.some((p) => texto.includes(p));
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

function respuesta(text) {
  return { tipo: "respuesta", texto: text };
}
