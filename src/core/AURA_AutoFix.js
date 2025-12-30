// ======================================================================
//  AURA_AutoFix.js — Sistema de Correcciones Inteligentes de AURA
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — AutoFix Modular para AguaRuta / Flota / Traslado
// ======================================================================

import { cargarMemoria, guardarPuntosSinGeo, guardarDuplicados } from "./AURAMemory";
import { FAZO_DATA } from "./FAZO_DATA";
import { emitirEvento } from "./FAZO_OS_EventBridge";

// ======================================================================
// UTILIDAD: detectar duplicados por nombre
// ======================================================================
function detectarDuplicados(lista) {
  const map = {};
  const repetidos = [];

  for (const p of lista) {
    const nombre = (p.nombre || "").trim().toLowerCase();

    if (!map[nombre]) map[nombre] = 0;
    map[nombre]++;

    if (map[nombre] === 2) repetidos.push(p);
  }

  return repetidos;
}

// ======================================================================
// UTILIDAD: detectar puntos sin coordenadas
// ======================================================================
function detectarPuntosSinGeo(lista) {
  return lista.filter(
    (p) => !p.latitud || !p.longitud || Number.isNaN(p.latitud) || Number.isNaN(p.longitud)
  );
}

// ======================================================================
// AURA AUTOFIX (MÓDULO PARA AGUARUTA — EXTENSIBLE)
// ======================================================================
export const AURA_AutoFix = {
  // ----------------------------------------------------------
  // 1) Análisis completo del módulo AguaRuta
  // ----------------------------------------------------------
  analizarAguaRuta() {
    const data = FAZO_DATA.get();

    if (!data || !Array.isArray(data.puntos)) {
      return { ok: false, mensaje: "No hay datos para analizar." };
    }

    const puntos = data.puntos;

    const duplicados = detectarDuplicados(puntos);
    const sinGeo = detectarPuntosSinGeo(puntos);

    // Guardamos en memoria estructural
    guardarDuplicados(duplicados.map((d) => d.nombre));
    guardarPuntosSinGeo(sinGeo.map((d) => d.nombre));

    return {
      ok: true,
      duplicados,
      sinGeo,
      mensaje: "Análisis completado.",
    };
  },

  // ----------------------------------------------------------
  // 2) Reparación automática (suave)
  // ----------------------------------------------------------
  autoFixAguaRuta() {
    const analisis = this.analizarAguaRuta();

    if (!analisis.ok) return analisis;

    const fixes = [];

    // A) Aviso de duplicados
    if (analisis.duplicados.length > 0) {
      fixes.push(
        `Se detectaron ${analisis.duplicados.length} duplicados que deben revisarse manualmente.`
      );
    }

    // B) Reparar puntos sin geolocalización asignando coordenadas temporales
    if (analisis.sinGeo.length > 0) {
      fixes.push(
        `Asignadas coordenadas temporales a ${analisis.sinGeo.length} puntos sin GPS.`
      );

      for (const p of analisis.sinGeo) {
        // Coordenadas provisionales (sector genérico Laguna Verde)
        p.latitud = -33.05 + Math.random() * 0.02;
        p.longitud = -71.63 + Math.random() * 0.02;
      }
    }

    // Evento para informar a AURAChat / App.js
    emitirEvento({
      tipo: "AURA_AUTOFIX",
      mensaje: fixes.join("\n"),
      fixes,
    });

    return {
      ok: true,
      mensaje: "AutoFix aplicado.",
      fixes,
    };
  },

  // ----------------------------------------------------------
  // 3) AutoFix general del sistema (modular)
  // ----------------------------------------------------------
  analizarTodo() {
    const resultados = {};

    // AguaRuta
    resultados.aguaruta = this.analizarAguaRuta();

    // En el futuro:
    // resultados.flota = this.analizarFlota();
    // resultados.traslado = this.analizarTraslado();

    return resultados;
  },
};
