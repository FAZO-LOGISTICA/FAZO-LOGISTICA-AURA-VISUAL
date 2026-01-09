// ===================================================
// App.js — FAZO OS / AURA FINAL CORE
// Gustavo Oliva — 2025
// ===================================================

import React, { useCallback } from "react";
import AURAChat from "./aura/AURAChat";

import { detectarComando } from "./aura/AURACommandDetector";
import { ejecutarComando } from "./aura/AURACommandRouter";

import {
  registrarAccion,
} from "./aura/AURAMemory";

import {
  enviarEventoDesdeAURA,
} from "./aura/FAZO_OS_EventBridge";

// ===================================================
// APP PRINCIPAL
// ===================================================

function App() {

  // =================================================
  // AURA → SISTEMA
  // =================================================
  const onAuraMessage = useCallback(async (texto) => {
    if (!texto) return;

    // Registrar todo lo que AURA procesa
    registrarAccion("AURA_INPUT", texto);

    // 1️⃣ Detectar si es comando
    const comando = detectarComando(texto);

    // 2️⃣ Si NO es comando, no hacemos nada más
    if (!comando) return;

    // 3️⃣ Ejecutar comando
    const resultado = await ejecutarComando(comando);

    // 4️⃣ Registrar resultado
    registrarAccion("AURA_COMMAND", comando.tipo);

    // 5️⃣ Si hay acción de UI o sistema, enviarla
    if (resultado?.accionUI) {
      enviarEventoDesdeAURA({
        tipo: "accion",
        accion: resultado.accionUI,
        payload: resultado,
      });
    }
  }, []);

  // =================================================
  // RENDER
  // =================================================
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <AURAChat
        onUserMessage={onAuraMessage}
      />
    </div>
  );
}

export default App;
