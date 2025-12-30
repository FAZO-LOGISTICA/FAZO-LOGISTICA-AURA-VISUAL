// ======================================================================
//  FAZO OS — App.js (PASO 16)
//  Integración completa con AURA_NEXUS + EventBridge + AutoFix + Memory
//  FAZO LOGÍSTICA — Gustavo Oliva
// ======================================================================

import React, { useEffect, useRef, useState } from "react";

import SidebarFazo from "./components/SidebarFazo";
import AuraOrb from "./components/AuraOrb";
import AuraCyberPanel from "./components/AuraCyberPanel";

import {
  registrarSubsistema,
  emitirEvento,
} from "./core/FAZO_OS_EventBridge";

import { cargarFAZOData } from "./core/FAZO_DATA";
import { cargarRecuerdos } from "./core/AURAMemory";
import { AURA_Agent } from "./core/AURA_Agent";

import "./index.css";

export default function App() {
  // ============================================================
  // ESTADOS DEL SISTEMA
  // ============================================================
  const [acceso, setAcceso] = useState(false);
  const [vista, setVista] = useState("aguaruta");
  const [subrutaAgua, setSubrutaAgua] = useState("");

  const [auraVisible, setAuraVisible] = useState(false);

  // Iframes
  const aguarutaIframeRef = useRef(null);
  const trasladoIframeRef = useRef(null);

  // ============================================================
  // 1) BOOT FAZO OS
  // ============================================================
  useEffect(() => {
    console.log("%cFAZO OS iniciado ✔", "color: cyan; font-size: 14px;");
    cargarFAZOData(); // datos globales
    cargarRecuerdos(); // memoria inicial
    AURA_Agent.iniciar(); // agente autónomo
  }, []);

  // ============================================================
  // 2) LOGIN PERSISTENTE
  // ============================================================
  useEffect(() => {
    const saved = localStorage.getItem("aura-acceso");
    if (saved === "ok") setAcceso(true);
  }, []);

  if (!acceso) {
    return (
      <div className="p-20 text-center text-white">
        <h2 className="text-3xl mb-6">FAZO OS — Acceso</h2>
        <button
          className="px-6 py-3 bg-cyan-600 rounded-xl"
          onClick={() => {
            localStorage.setItem("aura-acceso", "ok");
            setAcceso(true);
          }}
        >
          Entrar
        </button>
      </div>
    );
  }

  // ============================================================
  // 3) BRIDGE: AURA → FAZO OS (Event Listener)
  // ============================================================
  useEffect(() => {
    registrarSubsistema((evento) => {
      console.log("📡 Evento recibido en FAZO OS:", evento);

      switch (evento.tipo) {
        // ----------------------
        // 1) ABRIR MÓDULO
        // ----------------------
        case "AURA_MODULO":
          setVista(evento.modulo);
          if (evento.modulo === "aguaruta") setSubrutaAgua("");
          break;

        // ----------------------
        // 2) ABRIR SUBRUTA AGUARUTA
        // ----------------------
        case "AURA_SUBRUTA":
          setVista("aguaruta");
          setSubrutaAgua(evento.ruta);

          aguarutaIframeRef.current?.contentWindow?.postMessage(
            {
              type: "FAZO_CMD",
              command: "open-tab",
              tab: evento.ruta,
            },
            "*"
          );
          break;

        // ----------------------
        // 3) ACCIONES DEL SISTEMA
        // ----------------------
        case "AURA_ACCION":
          manejarAccion(evento.accion, evento.payload);
          break;

        // ----------------------
        // 4) ANÁLISIS AUTOMÁTICO
        // ----------------------
        case "AURA_ANALISIS_AUTOMATICO":
          console.log("🔍 Análisis automático:", evento.payload.sugerencias);
          break;

        default:
          console.warn("⚠️ Evento no manejado:", evento);
      }
    });
  }, []);

  // ============================================================
  // 4) ACCIONES GLOBALES DEL SISTEMA
  // ============================================================
  const manejarAccion = (accion, payload) => {
    switch (accion) {
      case "logout":
        localStorage.removeItem("aura-acceso");
        window.location.reload();
        break;

      case "aguaruta-open-tab":
        setVista("aguaruta");
        setSubrutaAgua(payload.tab);
        break;

      case "filtrar-camion":
        aguarutaIframeRef.current?.contentWindow?.postMessage(
          {
            type: "FAZO_CMD",
            command: "filtrar-camion",
            camion: payload,
          },
          "*"
        );
        break;

      default:
        console.warn("⚠️ Acción desconocida:", accion, payload);
    }
  };

  // ============================================================
  // 5) UI PRINCIPAL DEL OS
  // ============================================================
  return (
    <div className="flex min-h-screen text-white bg-black relative overflow-hidden">
      {/* MENU */}
      <SidebarFazo active={vista} onNavigate={(v) => setVista(v)} />

      {/* PANEL PRINCIPAL */}
      <div className="flex-1 p-6 ml-64 overflow-auto">
        <main className="h-full holo-fade">

          {/* AGUARUTA */}
          {vista === "aguaruta" && (
            <iframe
              ref={aguarutaIframeRef}
              src={`https://aguaruta.netlify.app/${subrutaAgua}`}
              title="AguaRuta"
              className="w-full h-[88vh] rounded-2xl bg-black/40 border border-cyan-400/40"
            />
          )}

          {/* TRASLADO */}
          {vista === "traslado" && (
            <iframe
              ref={trasladoIframeRef}
              src="https://traslado-municipal.netlify.app"
              title="Traslado Municipal"
              className="w-full h-[88vh] rounded-2xl bg-black/40 border border-emerald-400/40"
            />
          )}

          {/* FLOTa / REPORTES / AJUSTES */}
          {vista === "flota" && (
            <div className="p-10 text-center">Flota Municipal (En construcción)</div>
          )}
          {vista === "reportes" && (
            <div className="p-10 text-center">Reportes FAZO OS (Próximamente)</div>
          )}
          {vista === "ajustes" && (
            <div className="p-10 text-center">
              <h2 className="text-xl mb-4">Ajustes del Sistema</h2>
              <button
                onClick={() => manejarAccion("logout")}
                className="bg-red-600 px-6 py-3 rounded-xl"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ICONO AURA */}
      <AuraOrb onClick={() => setAuraVisible(true)} />

      {/* PANEL AURA */}
      <AuraCyberPanel
        visible={auraVisible}
        onClose={() => setAuraVisible(false)}
      />
    </div>
  );
}
