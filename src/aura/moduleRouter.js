// moduleRouter.js (versión PRO AURA)
// ---------------------------------------------
// Enruta automáticamente todas las intenciones
// de FAZO y asegura que cada módulo responda
// sin romper la app.
// ---------------------------------------------

import { detectarIntent } from "./intentDetector";

import * as AguaRuta from "./modules/aguaruta";
import * as Traslado from "./modules/traslado";
import * as Flota from "./modules/flota";
import * as Planillas from "./modules/planillas";
import * as Reportes from "./modules/reportes";
import * as Documentos from "./modules/documentos";
import * as Analisis from "./modules/analisis";

// 🔮 Módulo interno (preguntas sobre AURA)
import * as AuraInfo from "./modules/aura_personal";

export async function procesarFAZO(texto) {
  try {
    const intent = detectarIntent(texto);

    console.log("🔍 Intent detectado:", intent);

    switch (intent) {
      case "aguaruta":
        return await ejecutarModulo(AguaRuta, texto, "AguaRuta");

      case "traslado":
        return await ejecutarModulo(Traslado, texto, "Traslado Municipal");

      case "flota":
        return await ejecutarModulo(Flota, texto, "Gestión de Flota");

      case "planillas":
        return await ejecutarModulo(Planillas, texto, "Planillas / Excel");

      case "reportes":
        return await ejecutarModulo(Reportes, texto, "Reportes y Dashboard");

      case "documentos":
        return await ejecutarModulo(Documentos, texto, "Documentos y Oficios");

      case "analisis":
        return await ejecutarModulo(Analisis, texto, "Análisis Logístico");

      case "aura_personal":
        return await ejecutarModulo(AuraInfo, texto, "Identidad de AURA");

      default:
        // IA general se encargará de responder
        return null;
    }
  } catch (error) {
    console.error("❌ Error en procesarFAZO:", error);
    return (
      "Tuve un problema técnico procesando esto… " +
      "pero sigo aquí. ¿Quieres que volvamos a intentarlo?"
    );
  }
}

// ---------------------------------------
// 🧩 Función que ejecuta cualquier módulo
// con seguridad anti-crash
// ---------------------------------------
async function ejecutarModulo(modulo, texto, nombre) {
  try {
    if (!modulo.resolver) {
      return `El módulo ${nombre} aún no tiene lógica activa. ¿Quieres que lo configuremos ahora?`;
    }

    const respuesta = await modulo.resolver(texto);

    if (!respuesta || respuesta.trim() === "") {
      return `Procesé tu solicitud con el módulo **${nombre}**, pero no encontré una respuesta clara. ¿Quieres que refine la pregunta?`;
    }

    return respuesta;
  } catch (err) {
    console.error(`❌ Error en módulo ${nombre}:`, err);

    return (
      `Hubo un error en el módulo **${nombre}**. ` +
      `Puedo intentar reparar su lógica si tú quieres.`
    );
  }
}
