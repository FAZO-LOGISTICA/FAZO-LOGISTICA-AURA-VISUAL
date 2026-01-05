// ======================================================================
//  App.js — FINAL PRO
//  FAZO-OS 2025 · Núcleo Operativo Central
//  Gustavo Oliva · Mateo IA
// ======================================================================

import React, { useEffect } from "react";

// =======================
// AURA CORE
// =======================
import useAURAChat from "./aura/AURAChat";

// =======================
// SISTEMA FAZO-OS
// =======================
import { iniciarEventBridge } from "./aura/FAZO_OS_EventBridge";

// =======================
// UI BASE (puedes cambiar después)
// =======================
import FloatingMic from "./components/FloatingMic";
import AuraPanel from "./components/AuraPanel";

// ======================================================================
// APP
// ======================================================================

function App() {
  // =======================
  // AURA HOOK
  // =======================
  const {
    activo,
    escuchando,
    ultimoMensaje,
    respuesta,
    iniciarEscucha,
    detenerEscucha,
    enviarTexto,
    apagarAura,
  } = useAURAChat();

  // =======================
  // INICIAR FAZO-OS
  // =======================
  useEffect(() => {
    iniciarEventBridge();
    console.log("🟢 FAZO-OS iniciado");
  }, []);

  // =======================
  // RENDER
  // =======================
  return (
    <div style={styles.app}>
      {/* ===================== AURA PANEL ===================== */}
      <AuraPanel
        activo={activo}
        ultimoMensaje={ultimoMensaje}
        respuesta={respuesta}
        onEnviarTexto={enviarTexto}
        onApagar={apagarAura}
      />

      {/* ===================== MICRÓFONO FLOTANTE ===================== */}
      <FloatingMic
        activo={activo}
        escuchando={escuchando}
        onStart={iniciarEscucha}
        onStop={detenerEscucha}
      />
    </div>
  );
}

export default App;

// ======================================================================
// ESTILOS BASE (mínimos, funcionales)
// ======================================================================

const styles = {
  app: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#0e1116",
    color: "#ffffff",
    overflow: "hidden",
    position: "relative",
    fontFamily: "system-ui, sans-serif",
  },
};
