// =========================================================
// 📘 MÓDULO PLANILLAS — FAZO AGI (VERSIÓN PROFESIONAL)
// Manejo de Excel: horas, turnos, inventarios, rutas,
// rendimientos, sueldos y cálculos automáticos.
// =========================================================

export async function resolver(texto) {
  const msg = texto.toLowerCase();

  // Corrección básica de errores de escritura
  const clean = msg.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const incluye = (...palabras) =>
    palabras.some((p) => clean.includes(p));

  // ===============================
  // 🕑 HORAS Y TURNOS
  // ===============================
  if (
    incluye(
      "hora extra",
      "horas extra",
      "hex",
      "horas",
      "turno",
      "turnos",
      "asistencia",
      "marcacion",
      "marcación"
    )
  ) {
    return (
      "Perfecto. Para calcular horas o turnos necesito uno de estos:\n" +
      "• La planilla (foto, Excel o texto)\n" +
      "• Los horarios de entrada y salida\n" +
      "• O los totales diarios\n\n" +
      "Dime qué formato tienes y lo proceso."
    );
  }

  // ===============================
  // 📊 INVENTARIOS / STOCK
  // ===============================
  if (
    incluye(
      "inventario",
      "stock",
      "existencia",
      "kardex",
      "bodega",
      "insumo",
      "material"
    )
  ) {
    return (
      "Para inventarios puedo generar:\n" +
      "• Planilla Kardex\n" +
      "• Control de entradas y salidas\n" +
      "• Rotación e indicadores\n\n" +
      "¿Qué tipo de inventario necesitas preparar?"
    );
  }

  // ===============================
  // 🚚 PLANILLAS DE RUTAS
  // ===============================
  if (incluye("ruta", "rutas", "camion", "camioneta", "vehiculo")) {
    return (
      "Puedo crear una planilla para rutas: con litros, dirección, km, conductor y fecha.\n" +
      "¿Qué formato quieres? (simple, detallada o FAZO oficial)"
    );
  }

  // ===============================
  // 📉 RENDIMIENTOS / KPI EXCEL
  // ===============================
  if (incluye("rendimiento", "kpi", "indicador", "analisis excel")) {
    return (
      "Puedo preparar una planilla Excel para rendimiento o KPIs.\n" +
      "Dime qué datos tienes: consumo, carga, distancia o tiempos."
    );
  }

  // ===============================
  // 💰 SUELDOS / CÁLCULOS AUTOMÁTICOS
  // ===============================
  if (
    incluye(
      "sueldo",
      "liquidacion",
      "descuento",
      "previred",
      "cotizacion",
      "gratificacion"
    )
  ) {
    return (
      "Puedo ayudarte con sueldos o cálculos automáticos, pero necesito:\n" +
      "• Sueldo base\n" +
      "• Horas extra\n" +
      "• Asignaciones\n" +
      "• Descuentos\n\n" +
      "Dime si tienes la planilla o quieres que la genere desde cero."
    );
  }

  // ===============================
  // 🟦 GENERAR EXCEL (GENERAL)
  // ===============================
  if (incluye("excel", "exel", "planilla", "archivo")) {
    return (
      "Puedo generar Excel para:\n" +
      "• Horas\n" +
      "• Turnos\n" +
      "• Inventarios\n" +
      "• Rutas\n" +
      "• Combustible\n" +
      "• Rendimientos\n\n" +
      "¿Qué planilla quieres crear?"
    );
  }

  // ===============================
  // 🔥 FALLBACK GENERAL
  // ===============================
  return (
    "Puedo preparar planillas de horas, inventarios, rutas, rendimientos " +
    "o sueldos. Dime cuál necesitas y la preparo con formato FAZO."
  );
}
