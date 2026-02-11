import React, { useState, useCallback } from "react";
import AURAChat from "./components/AURAChat";

// ======================================================
//  MÓDULOS INTERNOS
// ======================================================

function Inicio() {
  return <h2>Panel Principal FAZO OS</h2>;
}

function Flota() {
  return <h2>🚛 Flota Municipal</h2>;
}

function Reportes() {
  return <h2>📊 Reportes FAZO</h2>;
}

// ======================================================
//  CONFIGURACIÓN DE MÓDULOS EXTERNOS (ESCALABLE)
//  ⚠️ AguaRuta YA NO VA AQUÍ
// ======================================================

const EXTERNAL_MODULES = {
  trasladomunicipal: "https://traslado-municipal.netlify.app",
  flotaexterna: "https://flota-municipal.netlify.app",
};

// ======================================================
//  APP PRINCIPAL
// ======================================================

export default function App() {
  const [moduloActivo, setModuloActivo] = useState("inicio");

  // ======================================================
  //  CONTROL CENTRAL DE COMANDOS AURA
  // ======================================================

  const onAuraCommand = useCallback((command) => {
    console.log("🧠 COMANDO AURA RECIBIDO:", command);

    if (!command || typeof command !== "object") return;

    try {
      switch (command.type) {
        case "OPEN_MODULE": {
          const modulo = command.module?.toLowerCase();
          if (!modulo) return;

          // Si existe como módulo externo → abrir pestaña
          if (EXTERNAL_MODULES[modulo]) {
            window.open(
              EXTERNAL_MODULES[modulo],
              "_blank",
              "noopener,noreferrer"
            );
            return;
          }

          // Si es interno → cambiar vista
          setModuloActivo(modulo);
          return;
        }

        case "OPEN_EXTERNAL": {
          if (command.url && typeof command.url === "string") {
            window.open(command.url, "_blank", "noopener,noreferrer");
          }
          return;
        }

        default:
          console.warn("⚠️ Tipo de comando no manejado:", command.type);
      }
    } catch (error) {
      console.error("❌ Error procesando comando AURA:", error);
    }
  }, []);

  // ======================================================
  //  RENDER DE MÓDULOS
  // ======================================================

  const renderModulo = () => {
    switch (moduloActivo) {
      case "aguaruta":
        return (
          <iframe
            src="https://aguaruta.netlify.app"
            title="AguaRuta"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        );

      case "flota":
        return <Flota />;

      case "reportes":
        return <Reportes />;

      case "inicio":
      default:
        return <Inicio />;
    }
  };

  // ======================================================
  //  LAYOUT PRINCIPAL
  // ======================================================

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* SISTEMA PRINCIPAL */}
      <div
        style={{
          flex: 1,
          padding: 20,
          overflow: "auto",
        }}
      >
        {renderModulo()}
      </div>

      {/* PANEL AURA */}
      <div
        style={{
          width: 420,
          borderLeft: "1px solid #334155",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <AURAChat onCommand={onAuraCommand} />
      </div>
    </div>
  );
}
