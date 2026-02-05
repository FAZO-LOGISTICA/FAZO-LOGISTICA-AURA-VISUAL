// ======================================================
// FAZO_Alerts.js — Alertas automáticas
// ======================================================

import { FAZO_DATA } from "../FAZO_DATA";

export function evaluarAlertas() {
  const alertas = [];

  // 🔴 Exceso de litros
  const totalLitros = FAZO_DATA.camiones.reduce(
    (s, c) => s + (c.litros || 0),
    0
  );

  if (totalLitros > 40000) {
    alertas.push(
      `⚠️ Alerta: Se superaron los 40.000 litros (${totalLitros}).`
    );
  }

  // 🔴 Sin datos
  if (!FAZO_DATA.camiones.length) {
    alertas.push("⚠️ Aún no hay camiones sincronizados.");
  }

  return alertas;
}
