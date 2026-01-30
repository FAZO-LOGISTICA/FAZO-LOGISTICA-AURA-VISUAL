// ===================================================
// App.js — FAZO OS / AURA FINAL CORE
// Autor: Gustavo Oliva
// Año: 2025
// Estado: PRODUCCIÓN
// ===================================================

import React, { useCallback } from "react";

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
  // ENTRADA CENTRAL DE AURA (FAZO OS BRAIN)
  // =================================================
  const onAuraMessage = useCallback(async (texto) => {
    try {
      if (!texto || typeof texto !== "string") return;

      // 1️⃣ Auditoría
      registrarAccion("AURA_INPUT", texto);

      // 2️⃣ Detección de comando FAZO
      const comando = detectarComando(texto);

      if (!comando) {
        registrarAccion("AURA_NO_COMMAND", texto);
        return;
      }

      // 3️⃣ Ejecución de comando
      const resultado = await ejecutarComando(comando);

      // 4️⃣ Registro
      registrarAccion("AURA_COMMAND", {
        tipo: comando.tipo,
        payload: comando.payload || null,
      });

      // 5️⃣ Evento hacia la UI
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
  // RENDER
  // =================================================
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {/* 🔴 CLAVE: el prop correcto */}
      <AURAChat onUserMessage={onAuraMessage} />
    </div>
  );
}

export default App;
