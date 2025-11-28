// ====================================================
// 📊 MÓDULO REPORTES — FAZO AGI (VERSIÓN PROFESIONAL)
// Informes: diario, semanal, mensual, anual
// Áreas: AguaRuta, Traslado, Flota
// ====================================================

export async function resolver(texto) {
  const msg = texto.toLowerCase();
  const clean = msg.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const incluye = (...p) => p.some((w) => clean.includes(w));

  // ====================================================
  // 🔎 DETECTAR PERIODO DEL INFORME
  // ====================================================
  let periodo = null;

  if (incluye("diario", "hoy")) periodo = "diario";
  if (incluye("semanal", "semana")) periodo = "semanal";
  if (incluye("mensual", "mes", "mensual")) periodo = "mensual";
  if (incluye("anual", "año", "year")) periodo = "anual";

  // Si pide "reporte" sin periodo → sugerir opciones
  if (incluye("reporte") && !periodo) {
    return (
      "Puedo generar informes **diario**, **semanal**, **mensual** o **anual**.\n" +
      "Dime el periodo que necesitas."
    );
  }

  // ====================================================
  // 🔎 DETECTAR ÁREA DEL INFORME
  // ====================================================
  let area = null;

  if (incluye("agua", "aguaruta", "laguna", "litros")) area = "aguaruta";
  if (incluye("traslado", "vehiculo", "reserva")) area = "traslado";
  if (incluye("flota", "mantenimiento", "combustible", "rendimiento")) area = "flota";

  // Si pide estadística, pero sin área
  if (incluye("estad", "estadistica", "estadísticas") && !area) {
    return (
      "¿Quieres estadísticas de **AguaRuta**, **Traslado Municipal** o **Flota**?"
    );
  }

  // ====================================================
  // 📌 CASO: TIENE PERIODO Y ÁREA → CREAR INFORME
  // ====================================================
  if (periodo && area) {
    return generarInforme(area, periodo);
  }

  // ====================================================
  // 📌 CASO: TIENE PERIODO PERO NO ÁREA
  // ====================================================
  if (periodo && !area) {
    return (
      `¿De qué área quieres el informe **${periodo}**?\n` +
      "Puedo hacerlo para AguaRuta, Traslado o Flota."
    );
  }

  // ====================================================
  // 📌 DEFAULT: “¿Qué reporte necesitas?”
  // ====================================================
  return (
    "Dime: **informe diario, semanal, mensual o anual**, y el área:\n" +
    "AguaRuta, Traslado o Flota.\n" +
    "Yo lo armo automáticamente."
  );
}

// ====================================================
// 🧠 GENERADOR DE INFORMES (Texto Profesional)
// ====================================================
function generarInforme(area, periodo) {
  const nombres = {
    aguaruta: "AguaRuta — Laguna Verde",
    traslado: "Traslado Municipal",
    flota: "Gestión de Flota",
  };

  const titulo = nombres[area] || "Sistema FAZO";

  return (
    `📄 **Informe ${periodo.toUpperCase()} — ${titulo}**\n\n` +
    "Incluye:\n" +
    "• Indicadores de operación\n" +
    "• Resumen de actividad\n" +
    "• Datos clave\n" +
    "• Observaciones\n\n" +
    "Si quieres lo genero en **PDF**, **texto municipal**, o con **gráficos**."
  );
}
