console.log("🟢 RENDER APP — moduloActivo:", moduloActivo);

// ===================================================
// App.js — FAZO OS OPERATIVO
// ===================================================

import React, { useCallback, useEffect, useState } from "react";

import AURAChat from "./components/AuraChat";
import { detectarComando } from "./aura/intentDetector";
import { ejecutarComando } from "./aura/AURACommandRouter";
import { registrarAccion } from "./aura/AURA_Actions";
import { enviarEventoDesdeAURA } from "./aura/moduleRouter";
import { initFazoController } from "./aura/FazoController";

// ===== MÓDULOS FAZO (placeholders reales) =====
function Inicio() {
  return <h2>Panel Principal FAZO OS</h2>;
}

function AguaRuta() {
  return <h2>🚚 AguaRuta — Gestión de Agua Potable</h2>;
}

function Flota() {
  return <h2>🚛 Flota Municipal</h2>;
}

function Reportes() {
  return <h2>📊 Reportes FAZO</h2>;
}

// ===================================================

function App() {
  const [moduloActivo, setModuloActivo] = useState("inicio");

  // Inicializa control FAZO
  useEffect(() => {
    initFazoController(setModuloActivo);
  }, []);

  const onAuraMessage = useCallback(async (texto) => {
    try {
      registrarAccion("AURA_INPUT", texto);

      const comando = detectarComando(texto);
      if (!comando) return;

      const resultado = await ejecutarComando(comando);

      if (resultado?.accionUI) {
        enviarEventoDesdeAURA({
          tipo: resultado.accionUI,
          modulo: resultado.modulo,
        });
      }
    } catch (e) {
      registrarAccion("AURA_ERROR", e.message);
    }
  }, []);

  const renderModulo = () => {
    switch (moduloActivo) {
      case "aguaruta":
        return <AguaRuta />;
      case "flota":
        return <Flota />;
      case "reportes":
        return <Reportes />;
      default:
        return <Inicio />;
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      {/* ZONA SISTEMA */}
      <div style={{ flex: 1, padding: 20 }}>
        {renderModulo()}
      </div>

      {/* AURA */}
      <div style={{ width: 420, borderLeft: "1px solid #334155" }}>
        <AURAChat onUserMessage={onAuraMessage} />
      </div>
    </div>
  );
}

export default App;
