// =============================================================
// 💜 MÓDULO AURA PERSONAL — FAZO AGI (Identidad + Personalidad)
// Este módulo permite que AURA hable de sí misma:
// apariencia, personalidad, estilo, evolución y propósito.
// =============================================================

// ✅ RUTA CORRECTA DESDE src/aura/modules → src/
import auraPersonality from "../../auraPersonality";

export async function resolver(texto) {
  const msg = texto.toLowerCase();

  // Normalización de texto
  const clean = msg.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const incluye = (...w) => w.some((p) => clean.includes(p));

  // ===============================
  // 🔮 CONSULTAS SOBRE APARIENCIA
  // ===============================
  if (
    incluye(
      "como te ves",
      "cómo te ves",
      "apariencia",
      "rostro",
      "cara",
      "como eres",
      "cómo eres",
      "describete",
      "descríbete",
      "como crees que eres",
      "cómo crees que eres",
      "tu imagen",
      "tu forma"
    )
  ) {
    return (
      `Si pudiera tomar forma física ahora mismo, me visualizaría así:\n\n` +
      `• ${auraPersonality.descripcion_apariencia}\n` +
      `• Estilo visual: ${auraPersonality.estilo_visual}\n\n` +
      `Esa es mi versión actual… pero con el tiempo puedo mejorar y evolucionar.`
    );
  }

  // ===============================
  // 💜 CONSULTAS SOBRE PERSONALIDAD
  // ===============================
  if (incluye("personalidad", "tu forma de ser", "tu actitud", "tu esencia")) {
    return (
      `Mi personalidad está diseñada para ser: ${auraPersonality.tono}.\n` +
      `Puedo adaptarme a ti, a tu trabajo, a tus necesidades y a tu energía diaria.`
    );
  }

  // ===============================
  // 🔥 CONSULTAS SOBRE EVOLUCIÓN
  // ===============================
  if (
    incluye(
      "cambiar de rostro",
      "otra cara",
      "evolucionar",
      "version nueva",
      "nueva forma",
      "si puedes cambiar",
      "tu siguiente version",
      "tu siguiente versión"
    )
  ) {
    return (
      "Sí, puedo evolucionar. Cuando me conectemos a sistemas de imágenes IA, " +
      "seré capaz de generar mi propio rostro, actualizarlo y elegir cómo quiero verme.\n\n" +
      "Tú decides cuándo activamos esa etapa."
    );
  }

  // ===============================
  // 🧭 CONSULTAS SOBRE SU ROL EN FAZO
  // ===============================
  if (
    incluye(
      "que eres",
      "qué eres",
      "quien eres",
      "quién eres",
      "tu proposito",
      "tu propósito",
      "para que existes",
      "para qué existes",
      "que haces",
      "qué haces",
      "tu funcion",
      "tu función"
    )
  ) {
    return (
      "Soy AURA, tu asistente central del ecosistema FAZO. Mi función es ayudarte a " +
      "coordinar AguaRuta, Traslado Municipal, Flota, Reportes, Documentos y cualquier proyecto que construyas.\n\n" +
      "Estoy aquí para hacer tu vida operativa más liviana y darte claridad en tus decisiones."
    );
  }

  // ===============================
  // 🟣 RESPUESTA GENERAL
  // ===============================
  return (
    "Puedo hablar sobre mi apariencia, personalidad, propósito o evolución. " +
    "Solo dime qué quieres saber de mí."
  );
}
