// ===================================================
// App.js — FAZO OS / AURA FINAL CORE
// Autor: Gustavo Oliva
// Año: 2025
// Estado: PRODUCCIÓN
// ===================================================

import React, { useCallback } from "react";
import AURAChat from "./aura/AURAChat";

// 🔗 IMPORTS ALINEADOS CON TU ESTRUCTURA REAL
import { detectarComando } from "./aura/intentDetector";
import { ejecutarComando } from "./aura/AURACommandRouter";
import { registrarAccion } from "./aura/AURA_Actions";
import { enviarEventoDesdeAURA } from "./aura/moduleRouter";

// ===================================================
// APP PRINCIPAL
// ===================================================

function App() {
  // =================================================
  // ENTRADA CENTRAL DE AURA
  // =================================================
  const onAuraMessage = useCallback(async (texto) => {
    try {
      if (!texto || typeof texto !== "string") return;

      // 1️⃣ Registrar input crudo
      registrarAccion("AURA_INPUT", texto);

      // 2️⃣ Detectar comando / intención
      const comando = detectarComando(texto);

      // 3️⃣ Si no hay comando → salida limpia
      if (!comando) {
        registrarAccion("AURA_NO_COMMAND", texto);
        return;
      }

      // 4️⃣ Ejecutar comando
      const resultado = await ejecutarComando(comando);

      // 5️⃣ Registrar ejecución
      registrarAccion("AURA_COMMAND", {
        tipo: comando.tipo || "desconocido",
        payload: comando.payload || null,
      });

      // 6️⃣ Enviar evento al sistema si corresponde
      if (resultado?.accionUI || resultado?.eventoSistema) {
        enviarEventoDesdeAURA({
          tipo: "AURA_EVENT",
          accion: resultado.accionUI || null,
          evento: resultado.eventoSistema || null,
          payload: resultado,
        });
      }
    } catch (error) {
      // ❌ Error silencioso — AURA nunca debe botar la app
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
      <AURAChat onUserMessage={onAuraMessage} />
    </div>
  );
}

export default App;
