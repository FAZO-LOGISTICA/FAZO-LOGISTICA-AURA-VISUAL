// ======================================================================
//  FAZO OS — App.js 2025 (Versión Oficial con NEXUS IA Integrado)
//  Maneja: navegación, iframes, comandos AURA, Nexus Event Router
// ======================================================================

import React, { useState, useEffect, useRef } from "react";

// Componentes del OS
import SidebarFazo from "./components/SidebarFazo";
import AuraCyberPanel from "./components/AuraCyberPanel";
import AuraOrb from "./components/AuraOrb";
import Login from "./components/Login";

// AURA Event Matrix (NEXUS)
import Nexus, { nexus_subscribe } from "./core/AURA_NEXUS";

import "./index.css";

export default function App() {
  // Estado del OS
  const [acceso, setAcceso] = useState(false);
  const [vista, setVista] = useState("aguaruta");
  const [subrutaAgua, setSubrutaAgua] = useState("");
  const [auraVisible, setAuraVisible] = useState(false);

  // iframes
  const aguarutaIframeRef = useRef(null);
  const trasladoIframeRef = useRef(null);

  // ============================================================
  // 1) Splash FAZO OS (señal para AURA)
  // ============================================================
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("FAZO_READY"));
    }, 400);
  }, []);

  // ============================================================
  // 2) Persistencia de login
  // ============================================================
  useEffect(() => {
    const saved = localStorage.getItem("aura-acceso");
    if (saved === "ok") setAcceso(true);
  }, []);

  if (!acceso) return <Login onLogin={() => setAcceso(true)} />;

  // ============================================================
  // 3) FAZO Bridge → enviar comandos a iframes
  // ============================================================
  const sendToIframe = (app, payload) => {
    try {
      if (!payload) return;

      const target =
        app === "aguaruta"
          ? aguarutaIframeRef.current
          : app === "traslado"
          ? trasladoIframeRef.current
          : null;

      target?.contentWindow?.postMessage(payload, "*");
    } catch (error) {
      console.warn("❌ Error enviando comando a iframe:", error);
    }
  };

  // ============================================================
  // 4) AURAChat → enviar comandos al OS
  // ============================================================
  const handleComandoAura = (cmd) => {
    if (!cmd) return;

    console.log("💠 AURA ejecuta comando:", cmd);

    // 1) Acceso directo (string)
    if (typeof cmd === "string") {
      setVista(cmd);
      return;
    }

    // 2) Cambio de módulo completo
    if (cmd.tipo === "modulo") {
      setVista(cmd.modulo);
      if (cmd.modulo === "aguaruta") setSubrutaAgua("");
      return;
    }

    // 3) Subruta dentro de AguaRuta
    if (cmd.tipo === "subruta") {
      setVista("aguaruta");

      const clean = (cmd.ruta || "").replace(/^\//, "");
      setSubrutaAgua(clean);

      sendToIframe("aguaruta", {
        type: "FAZO_CMD",
        command: "open-tab",
        tab: clean,
      });

      return;
    }

    // 4) Acciones locales
    if (cmd.tipo === "accion") {
      switch (cmd.accion) {
        case "logout":
          localStorage.removeItem("aura-acceso");
          window.location.reload();
          break;

        case "abrir-rutas":
          setVista("aguaruta");
          setSubrutaAgua("rutas-activas");
          break;

        case "filtro-camion":
          sendToIframe("aguaruta", {
            type: "FAZO_CMD",
            command: "filtrar-camion",
            camion: cmd.valor,
          });
          break;

        default:
          console.warn("⚠️ Acción desconocida:", cmd);
      }
    }
  };

  // ============================================================
  // 5) NEXUS Event Listener (AURA → OS)
  // ============================================================
  useEffect(() => {
    const unsubscribe = nexus_subscribe((ev) => {
      console.log("🌐 NEXUS EVENT:", ev);

      // AURA pide navegación del OS
      if (ev.evento === "AURA_COMANDO_OS") {
        handleComandoAura(ev.data);
      }

      // AURA AGENT lanza alertas automáticas
      if (ev.evento === "AURA_ALERTA_OPERACIONAL") {
        alert("🔍 AURA detectó problemas:\n\n" + ev.data.sugerencias.join("\n"));
      }
    });

    return () => unsubscribe();
  }, []);

  // ============================================================
  // 6) Render FAZO OS
  // ============================================================
  return (
    <div
      className="
        flex min-h-screen text-white
        bg-gradient-to-br from-black via-slate-900 to-black
        overflow-hidden relative fade-in
      "
    >
      {/* Sidebar */}
      <SidebarFazo
        active={vista}
        onNavigate={(slug) => {
          setVista(slug);
          if (slug === "aguaruta") setSubrutaAgua("");
        }}
      />

      {/* Panel principal */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto ml-64">
        <main className="flex-1 holo-fade smooth">
          {vista === "aguaruta" && (
            <iframe
              ref={aguarutaIframeRef}
              src={`https://aguaruta.netlify.app/${subrutaAgua}`}
              className="w-full h-[88vh] rounded-2xl bg-black/40 backdrop-blur-xl border border-cyan-400/40"
            />
          )}

          {vista === "traslado" && (
            <iframe
              ref={trasladoIframeRef}
              src="https://traslado-municipal.netlify.app"
              className="w-full h-[88vh] rounded-2xl bg-black/40 backdrop-blur-xl border border-emerald-400/40"
            />
          )}
        </main>
      </div>

      {/* ORB */}
      <AuraOrb onClick={() => setAuraVisible(true)} />

      {/* PANEL DE AURA */}
      <AuraCyberPanel
        visible={auraVisible}
        onClose={() => setAuraVisible(false)}
        onComando={handleComandoAura}
        onSendToIframe={sendToIframe}
      />
    </div>
  );
}
