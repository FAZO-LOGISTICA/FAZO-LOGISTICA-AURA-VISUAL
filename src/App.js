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
  const [aguaRutaUrl, setAguaRutaUrl] = useState(BASE_AGUARUTA);
  const iframeRef = useRef(null);

  // Navega dentro del iframe de AguaRuta de forma fiable
  const navegarAguaRuta = useCallback((target) => {
    const newUrl = BASE_AGUARUTA + target;
    console.log(`🔄 Navegando a: ${newUrl}`);

    // Si el iframe ya existe en el DOM, forzamos la navegación directo al contentWindow
    if (iframeRef.current) {
      iframeRef.current.src = newUrl;
    }

    // Sincronizamos el state para que React no revierta el src
    setAguaRutaUrl(newUrl);
  }, []);

  const onAuraCommand = useCallback((command) => {
    console.log("🧠 COMANDO AURA RECIBIDO:", command);
    if (!command) return;

    if (command.type === "OPEN_MODULE") {
      const modulo = command.module?.toLowerCase();
      if (!modulo) return;

      console.log(`📂 Abriendo módulo: ${modulo}`);

      if (command.subAction?.type === "GO_TO") {
        const target = command.subAction.target;

        if (moduloActivo === "aguaruta") {
          // Ya está en AguaRuta — navegar directo sin esperar
          navegarAguaRuta(target);
        } else {
          // Hay que montar el iframe primero, luego navegar
          setModuloActivo(modulo);
          setAguaRutaUrl(BASE_AGUARUTA + target);
          // El iframe se montará con la URL correcta desde el inicio
        }
      } else if (command.subAction?.type === "DESCARGAR_GRAFICOS_PDF") {
        setModuloActivo(modulo);
        navegarAguaRuta("/graficos");
      } else {
        // Sin subacción: abrir módulo en raíz
        if (modulo === "aguaruta") {
          setModuloActivo(modulo);
          navegarAguaRuta("/");
        } else {
          setModuloActivo(modulo);
        }
      }
    }
  }, [moduloActivo, navegarAguaRuta]);

  const renderModulo = () => {
    if (moduloActivo === "aguaruta") {
      return (
        <iframe
          ref={iframeRef}
          src={aguaRutaUrl}
          title="AguaRuta"
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
      {/* PANEL PRINCIPAL */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {renderModulo()}
      </div>

      {/* PANEL AURA */}
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
