import React, { useState, useCallback, useRef } from "react";
import AuraChat from "./Componentes/AuraChat"; // ✅ IMPORT CORRECTO

// ================= MÓDULOS INTERNOS =================

function Inicio() {
  return <h2 style={{ padding: 20 }}>Panel Principal FAZO OS</h2>;
}

function Flota() {
  return <h2 style={{ padding: 20 }}>🚛 Flota Municipal</h2>;
}

function Reportes() {
  return <h2 style={{ padding: 20 }}>📊 Reportes FAZO</h2>;
}

// ================= APP PRINCIPAL =================

export default function App() {
  const [moduloActivo, setModuloActivo] = useState("inicio");
  const iframeRef = useRef(null);

  // Enviar mensaje al iframe de AguaRuta
  const enviarAAguaRuta = (data) => {
    if (!iframeRef.current) return;

    iframeRef.current.contentWindow.postMessage(
      data,
      "https://aguaruta.netlify.app"
    );
  };

  const onAuraCommand = useCallback((command) => {
    console.log("🧠 COMANDO AURA RECIBIDO:", command);

    if (!command) return;

    if (command.type === "OPEN_MODULE") {
      const modulo = command.module?.toLowerCase();
      if (!modulo) return;

      setModuloActivo(modulo);

      // Si viene subacción (navegación interna)
      if (command.subAction) {
        setTimeout(() => {
          enviarAAguaRuta(command.subAction);
        }, 1000);
      }
    }
  }, []);

  const renderModulo = () => {
    if (moduloActivo === "aguaruta") {
      return (
        <iframe
          ref={iframeRef}
          src="https://aguaruta.netlify.app"
          title="AguaRuta"
          style={{
            width: "100%",
            height: "100vh",
            border: "none",
          }}
        />
      );
    }

    if (moduloActivo === "flota") return <Flota />;
    if (moduloActivo === "reportes") return <Reportes />;

    return <Inicio />;
  };

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      {/* PANEL PRINCIPAL */}
      <div style={{ flex: 1 }}>
        {renderModulo()}
      </div>

      {/* PANEL AURA */}
      <div
        style={{
          width: 420,
          borderLeft: "1px solid #334155",
          height: "100vh",
        }}
      >
        <AuraChat onCommand={onAuraCommand} />
      </div>
    </div>
  );
}
