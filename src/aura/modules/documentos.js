// =============================================
// 📝 MÓDULO DOCUMENTOS — FAZO (Versión PRO)
// =============================================

export async function resolver(texto) {
  const msg = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Función para detectar palabras clave
  const incluye = (...p) => p.some((x) => msg.includes(x));

  // ===============================
  // 📄 OFICIOS
  // ===============================
  if (incluye("oficio", "ofico", "ofcicio")) {
    return (
      "Perfecto. Para elaborar el oficio necesito:\n" +
      "• Destinatario (nombre o cargo)\n" +
      "• Motivo principal del documento\n" +
      "• Contexto breve\n" +
      "• Acción solicitada\n\n" +
      "Dame esos datos y te lo redacto con formato municipal completo."
    );
  }

  // ===============================
  // 📝 MEMORANDOS
  // ===============================
  if (incluye("memorando", "memo")) {
    return (
      "Listo. Para redactar el memorando necesito:\n" +
      "• A quién va dirigido\n" +
      "• El motivo del memo\n" +
      "• Instrucciones o información principal\n\n" +
      "Envíame esos datos y lo preparo formal."
    );
  }

  // ===============================
  // 📧 CORREOS ELECTRÓNICOS
  // ===============================
  if (incluye("correo", "email", "coreo", "mail")) {
    return (
      "Claro. Puedo redactarlo en tono formal, cordial o institucional.\n\n" +
      "Dime:\n" +
      "• A quién va dirigido\n" +
      "• Qué deseas comunicar\n" +
      "• Si debe tener un tono formal, directo, urgente o amable\n\n" +
      "Y te lo dejo listo para copiar/pegar."
    );
  }

  // ===============================
  // 📝 CARTAS FORMALES
  // ===============================
  if (incluye("carta", "carta formal", "solicitud")) {
    return (
      "Perfecto. Para redactar la carta necesito:\n" +
      "• Destinatario\n" +
      "• Asunto o motivo\n" +
      "• Detalles del caso\n" +
      "• Petición o solicitud\n\n" +
      "Dame esa info y te la preparo lista para imprimir."
    );
  }

  // ===============================
  // 📝 ACTAS
  // ===============================
  if (incluye("acta", "reunion", "actas")) {
    return (
      "Puedo redactar actas de reunión con estructura profesional.\n\n" +
      "Envíame:\n" +
      "• Fecha y hora\n" +
      "• Participantes\n" +
      "• Temas tratados\n" +
      "• Acuerdos\n" +
      "• Tareas asignadas\n\n" +
      "Y te hago el acta completa."
    );
  }

  // ===============================
  // 🔥 DEFAULT
  // ===============================
  return (
    "Puedo redactar oficios, cartas, memorandos, correos, actas o informes completos. " +
    "Dime qué documento necesitas preparar."
  );
}
