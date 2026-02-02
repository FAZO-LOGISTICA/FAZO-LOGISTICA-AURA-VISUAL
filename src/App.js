// ===================================================
// App.js — FAZO OS / AURA CORE OPERATIVO
// Autor: Gustavo Oliva
// Año: 2025
// Estado: CONTROL REAL DEL SISTEMA
// ===================================================

import React, { useCallback, useEffect } from "react";

// UI Chat
import AURAChat from "./components/AuraChat";

// Núcleo AURA
import { detectarComando } from "./aura/intentDetector";
import { ejecutarComando } from "./aura/AURACommandRouter";
import { registrarAccion } from "./aura/AURA_Actions";
import { enviarEventoDesdeAURA } from "./aura/moduleRouter";

// ===================================================
// APP PRINCIPAL
// ===================================================

function App() {
  // =================================================
  // 🧠 ENTRADA DE TEXTO AURA → FAZO
  // =================================================
  const onAuraMessage = useCallback(async (texto) => {
    try {
      if (!texto || typeof texto !== "string") return;

      registrarAccion("AURA_INPUT", texto);

      const comando = detectarComando(texto);

      if (!comando) {
        registrarAccion("AURA_NO_COMMAND", texto);
        return;
      }

      const resultado = await ejecutarComando(comando);

      registrarAccion("AURA_COMMAND", {
        tipo: comando.tipo,
        payload: comando.payload || null,
      });

      if (resultado?.accionUI || resultado?.eventoSistema) {
        enviarEventoDesdeAURA({
          tipo: "AURA_EVENT",
          accion: resultado.accionUI || null,
          evento: resultado.eventoSistema || null,
          payload: resultado,
        });
      }
    } catch (error) {
      registrarAccion("AURA_ERROR", {
        mensaje: error?.message || "Error desconocido",
      });
    }
  }, []);

  // =================================================
  // 🔥 COMANDOS DIRECTOS DESDE BACKEND (AURA API)
  // =================================================
  const onAuraCommand = useCallback((command) => {
    if (!command || !command.type) return;

    console.log("⚡ AURA COMMAND:", command);

    switch (command.type) {
      case "OPEN_MODULE":
        enviarEventoDesdeAURA({
          tipo: "OPEN_MODULE",
          modulo: command.module,
        });
        break;

      case "QUERY_DATA":
        enviarEventoDesdeAURA({
          tipo: "QUERY_DATA",
          modulo: command.module,
          accion: command.action,
        });
        break;

      default:
        console.warn("Comando AURA no manejado:", command);
    }
  }, []);

  // =================================================
  // 🔁 ESCUCHA GLOBAL DE EVENTOS AURA
  // (esto conecta con el resto del sistema FAZO)
  // =================================================
  useEffect(() => {
    const handler = (e) => {
      console.log("📡 EVENTO FAZO:", e.detail);

      // Aquí luego conectas:
      // - navegación
      // - mapas
      // - AguaRuta
      // - Flota
      // - etc.
    };

    window.addEventListener("AURA_EVENT", handler);
    return () => window.removeEventListener("AURA_EVENT", handler);
  }, []);

  // =================================================
  // RENDER
  // =================================================
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <AURAChat
        onUserMessage={onAuraMessage}
        onAuraCommand={onAuraCommand} // 🔥 CLAVE
      />
    </div>
  );
}

export default App;
