import React, { useState, useEffect } from "react";
import AURAChat from "./components/AURAChat";
import { registrarSubsistema } from "./core/FAZO_OS_EventBridge";
import { initFAZODataListener } from "./core/FAZO_DataListener";

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

  useEffect(() => {
    const cleanup = initFAZODataListener();
    return cleanup;
  }, []);

  useEffect(() => {
    const unsubscribe = registrarSubsistema((evento) => {
      if (!evento?.tipo) return;

      if (evento.tipo === "AURA_MODULO") {
        setModuloActivo(evento.modulo?.toLowerCase());
      }
    });

    return () => unsubscribe();
  }, []);

  const onAuraCommand = (command) => {
    if (command?.type === "OPEN_MODULE") {
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
      {/* FAZO OS */}
      <div style={{ flex: 1, padding: 20 }}>
        {renderModulo()}
      </div>

      {/* AURA */}
      <div style={{ width: 420, height: "100vh", borderLeft: "1px solid #334155" }}>
        <AURAChat onCommand={onAuraCommand} />
      </div>
    </div>
  );
}
