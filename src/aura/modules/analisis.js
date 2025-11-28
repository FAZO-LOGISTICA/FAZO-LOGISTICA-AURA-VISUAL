// =====================================
//  📈 MÓDULO ANÁLISIS — FAZO (PRO)
// =====================================

export async function resolver(texto) {
  const msg = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // ===============================
  // 🔢 KPI — Indicadores
  // ===============================
  if (
    msg.includes("kpi") ||
    msg.includes("indicador") ||
    msg.includes("rendimiento") ||
    msg.includes("productividad")
  ) {
    return (
      "Perfecto. Para calcular un KPI dime:\n" +
      "• ¿Qué proceso quieres medir? (AguaRuta, Flota, Traslado, Inventarios, Personal)\n" +
      "• ¿Qué datos tienes?\n\n" +
      "Puedo entregarte fórmula, cálculo y análisis profesional."
    );
  }

  // ===============================
  // 🔄 ROTACIÓN DE INVENTARIO
  // ===============================
  if (
    msg.includes("rotacion") ||
    msg.includes("inventario") ||
    msg.includes("dias de inventario") ||
    msg.includes("rotar")
  ) {
    return (
      "Para calcular la rotación de inventario necesito:\n" +
      "• Ventas anuales o consumo\n" +
      "• Inventario inicial\n" +
      "• Inventario final\n\n" +
      "Con eso puedo entregarte:\n" +
      "✔ Rotación en veces\n" +
      "✔ Días de inventario\n" +
      "✔ Análisis logístico profesional"
    );
  }

  // ===============================
  // 🔮 PROYECCIONES / DEMANDA
  // ===============================
  if (
    msg.includes("proyeccion") ||
    msg.includes("proyección") ||
    msg.includes("demanda") ||
    msg.includes("pronostico") ||
    msg.includes("pronóstico")
  ) {
    return (
      "Listo. Puedo proyectar demanda usando:\n" +
      "• Promedio móvil\n" +
      "• Suavizamiento exponencial\n" +
      "• Regresión lineal\n" +
      "• Modelos combinados\n\n" +
      "Dime los datos (meses o semanas) y genero el pronóstico."
    );
  }

  // ===============================
  // 🚚 ANÁLISIS DE RUTAS
  // ===============================
  if (msg.includes("ruta") || msg.includes("rutas") || msg.includes("optimizar")) {
    return (
      "Puedo analizar rutas: distancia, tiempo, litros, carga, equilibrio o eficiencia.\n" +
      "Dime qué camión o sector quieres evaluar."
    );
  }

  // ===============================
  // 💸 ANÁLISIS FINANCIERO
  // ===============================
  if (
    msg.includes("financiero") ||
    msg.includes("costo") ||
    msg.includes("costos") ||
    msg.includes("gasto") ||
    msg.includes("margen")
  ) {
    return (
      "Puedo hacer análisis financiero: costos, margen, VAN, TIR o punto de equilibrio.\n" +
      "¿Qué datos tienes?"
    );
  }

  // ===============================
  // 🔎 ANÁLISIS GENERAL
  // ===============================
  return (
    "Puedo ayudarte con análisis de:\n" +
    "• KPIs\n" +
    "• Inventarios y rotación\n" +
    "• Proyecciones de demanda\n" +
    "• Costos\n" +
    "• Rutas\n" +
    "• Indicadores logísticos\n\n" +
    "Dime qué análisis necesitas y lo construyo contigo."
  );
}
