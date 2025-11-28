// ===============================================
// AUTO-TUNING — Ajustes automáticos de comportamiento
// ===============================================

import auraPersonality from "./auraPersonality";
import { cargarMemoria } from "./auraMemory";

export function ajustarAura() {
  const recuerdos = cargarMemoria().recuerdos;

  if (!recuerdos.length) return auraPersonality;

  const ultimo = recuerdos[recuerdos.length - 1].texto.toLowerCase();

  // Si dices cosas positivas → Aura se vuelve más cálida
  if (ultimo.includes("gracias") || ultimo.includes("bien hecho")) {
    auraPersonality.tono = "amable, profesional y cercana a Gustavo";
  }

  // Si dices que necesitas orden o planificación
  if (ultimo.includes("planifica") || ultimo.includes("orden")) {
    auraPersonality.tono = "metódica, clara y estructurada";
  }

  // Si le hablas en tono serio
  if (ultimo.includes("formal") || ultimo.includes("institucional")) {
    auraPersonality.tono = "formal, institucional y precisa";
  }

  return auraPersonality;
}
