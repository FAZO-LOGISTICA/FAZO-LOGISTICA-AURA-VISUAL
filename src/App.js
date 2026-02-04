import React, { useState, useEffect } from "react";
import AURAChat from "./components/AuraChat";
import { registrarSubsistema } from "./FAZO_OS_EventBridge";

// 🔥 NUEVO: Listener FAZO_DATA_UPDATE
import { initFAZODataListener } from "./core/FAZO_DataListener";

// ======================================================
//  MÓDULOS BASE FAZO OS
// ======================================================

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

// ======================================================
//  APP PRINCIPAL — FAZO OS
// ======================================================

export default function App() {
  const [moduloActivo, setModuloActivo] = useState("inicio");

  // ======================================================
  // 🛰️ LISTENER FAZO DATA (AguaRuta → FAZO OS)
  // ======================================================
  useEffect(() => {
    const cleanup = initFAZODataListener();
    return cleanup;
  }, []);

  // ======================================================
  // 🧠 ESCUCHA GLOBAL FAZO OS (AURA → EVENTBRIDGE → APP)
  // ======================================================
  useEffect(() => {
    const unsubscribe = registrarSubsistema((evento) => {
      console.log("📡 FAZO OS EVENTO:", evento);

      if (!evento || !evento.tipo) return;

      switch (evento.tipo) {
        case "AURA_MODULO":
          setModuloActivo(evento.modulo);
          break;

        case "AURA_SUBRUTA":
          console.log(
            "➡️ Subruta solicitada:",
            evento.modulo,
            evento.ruta
          );
          break;

        case "AURA_ACCION":
          console.log(
            "⚙️ Acción del sistema:",
            evento.accion,
            evento.payload
          );
          break;

        case "AURA_ANALISIS_AUTOMATICO":
          console.log("🧠 Análisis automático AURA:", evento.payload);
          break;

        default:
          console.warn("Evento FAZO OS no manejado:", evento);
      }
    });

    return () => unsubscribe();
  }, []);

  // ======================================================
  // 🔥 CONTROL DIRECTO (AURAChat → UI)
  // ======================================================
  const onAuraCommand = (command) => {
    console.log("🧠 COMANDO AURA RECIBIDO:", command);

    if (!command || !command.type) return;

    if (command.type === "OPEN_MODULE" && command.module) {
      setModuloActivo(command.module.toLowerCase());
    }
  };

  // ======================================================
  // 🧩 RENDER DE MÓDULOS
  // ======================================================
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

  // ======================================================
  // 🖥️ LAYOUT GENERAL
  // ======================================================
  return (
    <div style={{ height: "100vh", display: "flex" }}>
      {/* SISTEMA FAZO OS */}
      <div style={{ flex: 1, padding: 20 }}>
        {renderModulo()}
      </div>

      {/* AURA */}
      <div style={{ width: 420, borderLeft: "1px solid #334155" }}>
        <AURAChat onCommand={onAuraCommand} />
      </div>
    </div>
  );
}
