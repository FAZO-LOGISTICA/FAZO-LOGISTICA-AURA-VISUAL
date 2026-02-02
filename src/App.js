import React, { useState } from "react";
import AURAChat from "./components/AuraChat";

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

export default function App() {
  const [moduloActivo, setModuloActivo] = useState("inicio");

  // 🔥 CONTROL CENTRAL REAL
  const onAuraCommand = (command) => {
    console.log("🧠 COMANDO AURA RECIBIDO:", command);

    if (command.type === "OPEN_MODULE") {
      setModuloActivo(command.module.toLowerCase());
    }
  };

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
      <div style={{ flex: 1, padding: 20 }}>
        {renderModulo()}
      </div>

      <div style={{ width: 420, borderLeft: "1px solid #334155" }}>
        <AURAChat onCommand={onAuraCommand} />
      </div>
    </div>
  );
}
