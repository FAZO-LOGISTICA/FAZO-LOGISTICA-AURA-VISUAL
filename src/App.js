import React, { useState, useCallback, useRef } from "react";
import AuraChat from "./components/AuraChat";

// ================= MÓDULOS INTERNOS =================
function Inicio() {
  return (
    <div style={{
      padding: 40,
      textAlign: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      color: 'white'
    }}>
      <h1 style={{
        fontSize: 48,
        marginBottom: 20,
        background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        FAZO OS
      </h1>
      <p style={{ fontSize: 18, color: '#94a3b8' }}>Sistema Central Municipal</p>
      <p style={{ fontSize: 14, color: '#64748b', marginTop: 20 }}>
        Di "Aura, abre AguaRuta" para comenzar
      </p>
    </div>
  );
}

function Flota() {
  return (
    <div style={{ padding: 40, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', height: '100vh', color: 'white' }}>
      <h2>🚛 Flota Municipal</h2>
      <p style={{ color: '#94a3b8' }}>Módulo en construcción...</p>
    </div>
  );
}

function Reportes() {
  return (
    <div style={{ padding: 40, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', height: '100vh', color: 'white' }}>
      <h2>📊 Reportes FAZO</h2>
      <p style={{ color: '#94a3b8' }}>Módulo en construcción...</p>
    </div>
  );
}

// ================= APP PRINCIPAL =================
const BASE_AGUARUTA = "https://aguaruta.netlify.app";

export default function App() {
  const [moduloActivo, setModuloActivo] = useState("inicio");
  const iframeRef = useRef(null);
  // Guardamos la ruta destino cuando AguaRuta aún no está montado
  const rutaPendiente = useRef(null);

  // Navega dentro del iframe sin recargar — via postMessage
  const navegarAguaRuta = useCallback((target) => {
    if (iframeRef.current?.contentWindow) {
      console.log(`📨 postMessage GO_TO: ${target}`);
      iframeRef.current.contentWindow.postMessage(
        { type: "GO_TO", target },
        BASE_AGUARUTA
      );
    } else {
      // iframe aún no listo, guardar ruta pendiente
      rutaPendiente.current = target;
    }
  }, []);

  // Cuando el iframe termina de cargar, enviar ruta pendiente si hay una
  const onIframeLoad = useCallback(() => {
    if (rutaPendiente.current && iframeRef.current?.contentWindow) {
      console.log(`📨 postMessage pendiente: ${rutaPendiente.current}`);
      iframeRef.current.contentWindow.postMessage(
        { type: "GO_TO", target: rutaPendiente.current },
        BASE_AGUARUTA
      );
      rutaPendiente.current = null;
    }
  }, []);

  const onAuraCommand = useCallback((command) => {
    console.log("🧠 COMANDO AURA RECIBIDO:", command);
    if (!command) return;

    if (command.type === "OPEN_MODULE") {
      const modulo = command.module?.toLowerCase();
      if (!modulo) return;

      console.log(`📂 Abriendo módulo: ${modulo}`);

      if (modulo === "aguaruta") {
        const target = command.subAction?.type === "GO_TO"
          ? command.subAction.target
          : null;

        if (moduloActivo === "aguaruta") {
          // Ya está montado — navegar via postMessage directamente
          if (target) navegarAguaRuta(target);
        } else {
          // Montar iframe — si hay target, guardarlo como pendiente
          if (target) rutaPendiente.current = target;
          setModuloActivo("aguaruta");
        }

        if (command.subAction?.type === "DESCARGAR_GRAFICOS_PDF") {
          navegarAguaRuta("/graficos");
        }

      } else {
        setModuloActivo(modulo);
      }
    }
  }, [moduloActivo, navegarAguaRuta]);

  const renderModulo = () => {
    if (moduloActivo === "aguaruta") {
      return (
        <iframe
          ref={iframeRef}
          src={BASE_AGUARUTA}
          title="AguaRuta"
          onLoad={onIframeLoad}
          style={{ width: "100%", height: "100vh", border: "none" }}
          allow="fullscreen"
        />
      );
    }
    if (moduloActivo === "flota") return <Flota />;
    if (moduloActivo === "reportes") return <Reportes />;
    return <Inicio />;
  };

  return (
    <div style={{ height: "100vh", display: "flex", overflow: "hidden", position: "fixed", width: "100%", top: 0, left: 0 }}>
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {renderModulo()}
      </div>
      <div style={{
        width: 420,
        borderLeft: "1px solid #334155",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}>
        <AuraChat onCommand={onAuraCommand} />
      </div>
    </div>
  );
}
