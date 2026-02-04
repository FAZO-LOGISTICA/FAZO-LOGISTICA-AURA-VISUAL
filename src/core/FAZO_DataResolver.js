import { FAZO_DATA } from "./FAZO_DATA";

export function resolverPreguntaFAZO(texto) {
  if (!texto) return null;

  const t = texto.toLowerCase();

  // =========================
  // PREGUNTAS SOBRE AGUARUTA
  // =========================
  if (t.includes("aguaruta") && t.includes("qué es")) {
    return "AguaRuta es el sistema municipal de gestión y entrega de agua potable, con control de rutas, camiones, litros y estados de entrega.";
  }

  if (t.includes("camiones")) {
    if (!FAZO_DATA.camiones.length)
      return "No hay camiones cargados aún en el sistema.";

    return `Camiones activos:\n${FAZO_DATA.camiones
      .map((c) => `• ${c.nombre} — ${c.litros || 0} litros`)
      .join("\n")}`;
  }

  if (t.includes("rutas") || t.includes("puntos")) {
    return `Puntos de entrega registrados: ${FAZO_DATA.puntos.length}`;
  }

  if (t.includes("litros")) {
    const total = FAZO_DATA.camiones.reduce(
      (acc, c) => acc + (c.litros || 0),
      0
    );
    return `Litros totales planificados hoy: ${total}`;
  }

  // ❌ No es pregunta FAZO
  return null;
}
