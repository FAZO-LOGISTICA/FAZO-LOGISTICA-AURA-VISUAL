// ======================================================================
//  AURA_NaturalLanguage.js — NLP Router 2025
//  Interpreta mensajes y decide intención real
// ======================================================================

export function interpretar(texto = "") {
  const t = texto.toLowerCase().trim();

  // ------------------- MÓDULOS -------------------
  if (match(t, ["agua", "aguaruta"])) {
    return { tipo: "modulo", modulo: "aguaruta", frase: "Abriendo AguaRuta." };
  }
  if (match(t, ["traslado"])) {
    return { tipo: "modulo", modulo: "traslado", frase: "Abriendo Traslado Municipal." };
  }
  if (match(t, ["flota", "camionetas"])) {
    return { tipo: "modulo", modulo: "flota", frase: "Mostrando Flota Municipal." };
  }

  // ------------------- SUBRUTAS -------------------
  if (match(t, ["rutas activas"])) {
    return { tipo: "subruta", ruta: "rutas-activas", frase: "Abriendo Rutas Activas." };
  }
  if (match(t, ["no entregadas"])) {
    return { tipo: "subruta", ruta: "no-entregadas", frase: "Mostrando No Entregadas." };
  }
  if (match(t, ["registrar entrega"])) {
    return { tipo: "subruta", ruta: "registrar-entrega", frase: "Abriendo Registro de Entrega." };
  }

  // ------------------- ACCIONES -------------------
  if (match(t, ["abrir mapa"])) {
    return { tipo: "accion", accion: "abrir-mapa", frase: "Abriendo mapa." };
  }
  if (match(t, ["cerrar sesion", "logout"])) {
    return { tipo: "accion", accion: "logout", frase: "Cerrando sesión." };
  }

  return { tipo: "backend", textoOriginal: texto };
}

function match(texto, palabras) {
  return palabras.some((p) => texto.includes(p));
}
