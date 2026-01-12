// =====================================================
// AURA_NEXUS.js — Cerebro Central de AURA
// FAZO-OS 2025
// =====================================================

import { cargarMemoria, registrarAccion } from "./AURAMemory";

// -----------------------------------------------------
// Analiza el mensaje y decide qué hacer
// -----------------------------------------------------
export async function procesarMensajeAURA({ messages }) {
  const ultimo = messages[messages.length - 1];
  const texto = ultimo?.content?.toLowerCase() || "";

  registrarAccion("mensaje_usuario", texto);

  // =============================
  // DETECCIÓN DE COMANDOS BÁSICOS
  // =============================
  if (texto.includes("abrir")) {
    if (texto.includes("rutas")) {
      return {
        reply: "Abriendo módulo de Rutas Activas.",
        command: {
          tipo: "modulo",
          modulo: "rutas-activas",
        },
      };
    }

    if (texto.includes("mapa")) {
      return {
        reply: "Mostrando el mapa de entregas.",
        command: {
          tipo: "modulo",
          modulo: "mapa",
        },
      };
    }
  }

  if (texto.includes("estado") || texto.includes("resumen")) {
    const mem = cargarMemoria();
    return {
      reply: `Sistema operativo. Acciones recientes registradas: ${mem.historialAcciones.length}.`,
    };
  }

  // =============================
  // RESPUESTA CONVERSACIONAL BASE
  // (luego se conecta a OpenAI / Claude)
  // =============================
  return {
    reply:
      "Estoy operativo. Puedes pedirme abrir módulos, revisar estado o continuar configurando el sistema.",
  };
}
