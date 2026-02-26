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
      <p style={{ fontSize: 18, color: '#94a3b8' }}>
        Sistema Central Municipal
      </p>
      <p style={{ fontSize: 14, color: '#64748b', marginTop: 20 }}>
        Di "Aura, abre AguaRuta" para comenzar
      </p>
    </div>
  );
}

function Flota() {
  return (
    <div style={{ 
      padding: 40,
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      height: '100vh',
      color: 'white'
    }}>
      <h2>🚛 Flota Municipal</h2>
      <p style={{ color: '#94a3b8' }}>Módulo en construcción...</p>
    </div>
  );
}

function Reportes() {
  return (
    <div style={{ 
      padding: 40,
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      height: '100vh',
      color: 'white'
    }}>
      <h2>📊 Reportes FAZO</h2>
      <p style={{ color: '#94a3b8' }}>Módulo en construcción...</p>
    </div>
  );
}

// ================= APP PRINCIPAL =================
export default function App() {
  const [moduloActivo, setModuloActivo] = useState("inicio");
  const [aguaRutaUrl, setAguaRutaUrl] = useState("https://aguaruta.netlify.app");
  const iframeRef = useRef(null);

  const onAuraCommand = useCallback((command) => {
    console.log("🧠 COMANDO AURA RECIBIDO:", command);
    
    if (!command) return;

    if (command.type === "OPEN_MODULE") {
      const modulo = command.module?.toLowerCase();
      if (!modulo) return;

      console.log(`📂 Abriendo módulo: ${modulo}`);
      setModuloActivo(modulo);

      // Si viene subacción (navegación interna en AguaRuta)
      if (command.subAction) {
        console.log("🎯 SubAcción detectada:", command.subAction);

        setTimeout(() => {
          if (command.subAction.type === "GO_TO") {
            const baseUrl = "https://aguaruta.netlify.app";
            const newUrl = baseUrl + command.subAction.target;
            
            console.log(`🔄 Navegando a: ${newUrl}`);
            setAguaRutaUrl(newUrl);
          }

          if (command.subAction.type === "DESCARGAR_GRAFICOS_PDF") {
            console.log("📥 Ejecutando descarga de PDF...");
            // Aquí puedes implementar la lógica de descarga
            // Por ahora solo navega a gráficos
            const newUrl = "https://aguaruta.netlify.app/graficos";
            setAguaRutaUrl(newUrl);
          }
        }, 1000);
      }
    }
  }, []);

  const renderModulo = () => {
    if (moduloActivo === "aguaruta") {
      return (
        <iframe
          ref={iframeRef}
          src={aguaRutaUrl}
          title="AguaRuta"
          style={{
            width: "100%",
            height: "100vh",
            border: "none",
          }}
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
      <div
        style={{
          width: 420,
          borderLeft: "1px solid #334155",
          height: "100vh",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AuraChat onCommand={onAuraCommand} />
      </div>
    </div>
  );
}
