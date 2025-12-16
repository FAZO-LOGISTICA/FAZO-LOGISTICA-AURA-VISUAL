// ========================================================================
//   AURA_NaturalLanguage.js — Cerebro Lingüístico FAZO OS
//   Comprensión natural | Modismos chilenos | IA simbólica intermedia
//   Autor: Mateo IA — Para Gustavo Oliva (FAZO LOGÍSTICA)
// ========================================================================

/*
OBJETIVO:
--------
Transformar lenguaje humano → comandos claros para AURA:

Ejemplos:
- “Aura abre las weás de rutas poh” → { tipo: "subruta", ruta: "/rutas-activas" }
- “Necesito ver lo del agua” → { tipo: "modulo", modulo: "aguaruta" }
- “Ábreme lo de los viernes” → interpretar como: estadísticas
- “Está raro el reparto” → activar módulo de análisis
*/

export function interpretarLenguajeNatural(texto) {
  if (!texto) return null;

  const t = texto.toLowerCase().trim();

  // =========================================================
  // 1) MODISMOS CHILENOS / FRASES COTIDIANAS
  // =========================================================
  const slang = {
    rutas: ["wea de rutas", "las rutas", "abre las rutas", "lo de las rutas"],
    agua: ["lo del agua", "agua ruta", "las aguas", "las entregas"],
    mapa: ["el mapa", "la cuestión del mapa", "abre mapa"],
    traslado: ["traslado", "los traslados", "movilización"],
    flota: ["flota", "los vehículos", "maestranza", "camiones"],
    viernes: ["viernes", "día viernes", "las entregas del viernes"],
    problemas: ["está raro", "algo anda mal", "la weá anda mal"],
    revisar: ["revisa", "comprueba", "analiza", "verifica"],
  };

  // Helpers para detectar palabras sueltas o modismos
  const contiene = (arr) => arr.some((p) => t.includes(p));

  // =========================================================
  // 2) DETECCIÓN DE MÓDULOS PRINCIPALES
  // =========================================================
  if (contiene(slang.agua))
    return { tipo: "modulo", modulo: "aguaruta", frase: "Abriendo AguaRuta…" };

  if (contiene(slang.traslado))
    return { tipo: "modulo", modulo: "traslado", frase: "Cargando Traslado Municipal…" };

  if (contiene(slang.flota))
    return { tipo: "modulo", modulo: "flota", frase: "Mostrando Flota Municipal…" };

  // =========================================================
  // 3) SUBRUTAS DE AGUARUTA
  // =========================================================
  if (contiene(slang.rutas))
    return { tipo: "subruta", ruta: "/rutas-activas", frase: "Abriendo rutas activas…" };

  if (contiene(slang.mapa))
    return { tipo: "subruta", ruta: "/mapa", frase: "Mostrando el mapa de entregas…" };

  if (contiene(slang.viernes))
    return { tipo: "subruta", ruta: "/camion-estadisticas", frase: "Revisando viernes…" };

  // =========================================================
  // 4) ANÁLISIS INTELIGENTE ("algo anda mal con las rutas")
  // =========================================================
  if (contiene(slang.problemas))
    return { tipo: "analisis", accion: "detectar-problemas", frase: "Analizando operación…" };

  if (contiene(slang.revisar))
    return { tipo: "analisis", accion: "revision-general", frase: "Revisando todo el sistema…" };

  // =========================================================
  // 5) PATRONES COMPLEJOS (GPT-like simplificado)
  // =========================================================
  if (t.match(/(abre|muestra|enseña|carga)\s+.*(agua|ruta)/))
    return { tipo: "modulo", modulo: "aguaruta", frase: "Abriendo AguaRuta…" };

  if (t.match(/(abre|muestra|enseña|carga)\s+.*(mapa)/))
    return { tipo: "subruta", ruta: "/mapa", frase: "Mostrando el mapa…" };

  if (t.match(/(estad(isticas|ísticas)|grafico|gráfico)/))
    return { tipo: "subruta", ruta: "/camion-estadisticas", frase: "Mostrando estadísticas…" };

  if (t.match(/registr(ar|a).*entrega/))
    return { tipo: "subruta", ruta: "/registrar-entrega", frase: "Abriendo registro…" };

  // =========================================================
  // 6) FALLBACK NATURAL
  // =========================================================
  return {
    tipo: "general",
    frase:
      "Estoy interpretando lo que dijiste… ¿Quieres revisar AguaRuta, Traslado o Flota?",
  };
}

export default interpretarLenguajeNatural;
