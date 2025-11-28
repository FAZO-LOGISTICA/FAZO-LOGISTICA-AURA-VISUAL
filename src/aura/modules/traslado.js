// =====================================================================
// 🚐 MÓDULO TRASLADO MUNICIPAL — FAZO AGI (VERSIÓN PROFESIONAL)
// Sistema de gestión de vehículos, disponibilidad, reservas y asignación.
// =====================================================================

export async function resolver(texto) {
  const msg = texto.toLowerCase();
  const clean = msg.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const incluye = (...w) => w.some(p => clean.includes(p));

  // API oficial (se puede cambiar cuando gustes)
  const API = "https://traslado-api.onrender.com/status";

  let data = null;

  // ==============================
  // 🔵 Intento de conectar a la API
  // ==============================
  try {
    const res = await fetch(API);
    if (res.ok) {
      data = await res.json();
    }
  } catch {
    data = null;
  }

  // ==============================
  // 🔵 RESERVAR VEHÍCULO
  // ==============================
  if (
    incluye(
      "reservar",
      "reserva",
      "quiero reservar",
      "pedir vehiculo",
      "agendar viaje",
      "voy a necesitar"
    )
  ) {
    return (
      "Para hacer una reserva necesito los siguientes datos:\n" +
      "- Fecha\n" +
      "- Hora\n" +
      "- Origen y destino\n" +
      "- Número de pasajeros\n" +
      "- Vehículo preferido (si aplica)\n\n" +
      "Dímelos y preparo la solicitud."
    );
  }

  // ==============================
  // 🔵 CONSULTAR DISPONIBILIDAD
  // ==============================
  if (
    incluye(
      "disponible",
      "disponibilidad",
      "vehiculo disponible",
      "vehiculos disponibles",
      "camioneta disponible",
      "que esta libre"
    )
  ) {
    if (data?.disponibles?.length > 0) {
      return `Vehículos disponibles ahora mismo: ${data.disponibles.join(", ")}.`;
    }

    return (
      "No pude obtener la disponibilidad desde el sistema, " +
      "pero puedo ayudarte a generar una solicitud manual."
    );
  }

  // ==============================
  // 🔵 CONSULTAS SOBRE SERVICIOS
  // ==============================
  if (
    incluye(
      "ultimo servicio",
      "último servicio",
      "ultimo viaje",
      "último viaje",
      "asignacion",
      "asignación"
    )
  ) {
    if (data?.ultimo_servicio) {
      return `Última asignación registrada: ${data.ultimo_servicio}`;
    }
    return "No tengo acceso al viaje más reciente, pero puedo ayudarte a revisar las rutas internas.";
  }

  // ==============================
  // 🔵 CONSULTAS GENERALES
  // ==============================
  if (data) {
    return (
      `Sistema de Traslado Municipal operativo.\n` +
      `Vehículos activos: ${data.activos ?? "N/D"}\n` +
      `Disponibles: ${data.disponibles?.length ?? 0}\n` +
      `Último servicio: ${data.ultimo_servicio ?? "N/D"}\n\n` +
      "¿Qué necesitas hacer?"
    );
  }

  // ==============================
  // 🔥 FALLBACK INTELIGENTE
  // ==============================
  return (
    "No pude conectarme al servidor de Traslado ahora mismo. " +
    "Pero puedo ayudarte a generar una solicitud, memo o correo para pedir vehículo."
  );
}
