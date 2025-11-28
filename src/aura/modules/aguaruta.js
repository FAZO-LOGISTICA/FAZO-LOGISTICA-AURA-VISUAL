// =====================================
// 🔵 MÓDULO AGUARUTA — FAZO (Versión PRO)
// =====================================

export async function resolver(texto) {
  const msg = texto.toLowerCase();

  // 🔗 Endpoint oficial (se mantiene como lo tienes)
  const API = "https://aguaruta-api.onrender.com/status";

  let data = null;

  try {
    const res = await fetch(API);

    if (!res.ok) {
      throw new Error("Error en API");
    }

    data = await res.json();
  } catch (error) {
    console.warn("⚠️ AURA: No pude conectar con el backend de AguaRuta");
    data = null; // permitirá fallback después
  }

  // ===============================
  // 🧠 LÓGICA INTELIGENTE
  // ===============================

  // 🔹 Litros entregados
  if (
    msg.includes("litros") ||
    msg.includes("agua entregada") ||
    msg.includes("cuanto se ha entregado")
  ) {
    if (data?.litros_dia) {
      return `Hoy se han entregado ${Number(data.litros_dia).toLocaleString("es-CL")} litros en Laguna Verde.`;
    }
    return "No pude obtener los litros exactos ahora, pero puedo ayudarte a revisar los reportes si quieres.";
  }

  // 🔹 Camiones activos
  if (
    msg.includes("camion") ||
    msg.includes("camión") ||
    msg.includes("aljibe") ||
    msg.includes("camiones")
  ) {
    if (data?.camion_principal) {
      return `El camión que está operativo ahora mismo es: ${data.camion_principal}.`;
    }
    return "No pude obtener el estado de los camiones, pero puedo ayudarte a revisar las rutas.";
  }

  // 🔹 Entregas no realizadas
  if (
    msg.includes("no entregada") ||
    msg.includes("no entregadas") ||
    msg.includes("pendiente") ||
    msg.includes("pendientes")
  ) {
    if (data?.entregas_pendientes !== undefined) {
      return `Actualmente hay ${data.entregas_pendientes} entregas pendientes en el sector.`;
    }
    return "No pude obtener las entregas pendientes, pero puedo ayudarte a revisar el historial.";
  }

  // 🔹 Estado general
  if (data?.estado) {
    return `El sistema AguaRuta está operativo: ${data.estado}. ¿Qué deseas revisar exactamente?`;
  }

  // ===============================
  // 🔥 FALLBACK INTELIGENTE
  // ===============================
  return (
    "No pude conectarme al servidor de AguaRuta, pero puedo ayudarte a organizar rutas, litros o reportes. " +
    "¿Qué necesitas revisar?"
  );
}
