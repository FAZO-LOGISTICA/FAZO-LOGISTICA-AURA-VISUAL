// ======================================================================
//  FAZO OS — App.js 2025 (Versión Nexus + EventBridge + AutoFix + Nexus Agent)
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Compatibilidad total con AURA IA GOD MODE
// ======================================================================

import React, { useState, useEffect, useRef } from "react";

import SidebarFazo from "./components/SidebarFazo";
import AuraCyberPanel from "./components/AuraCyberPanel";
import AuraOrb from "./components/AuraOrb";

import {
  registrarSubsistema,
} from "./FAZO_OS_EventBridge";

import { actualizarFAZOData } from "./FAZO_DATA";

import "./index.css";

export default function App() {
  // ======================================================
  // ESTADOS PRINCIPALES DEL OS
  // ======================================================
  const [vista, setVista] = useState("inicio");
  const [subrutaAgua, setSubrutaAgua] = useState("");
  const [auraVisible, setAuraVisible] = useState(false);

  // IFRAMES
  const aguarutaIframeRef = useRef(null);
  const trasladoIframeRef = useRef(null);

  // ======================================================
  // REGISTRO DE SUBSISTEMA: AURA → FAZO OS
  // ======================================================
  useEffect(() => {
    registrarSubsistema((evento) => {
      console.log("📩 Evento recibido desde AURA:", evento);

      switch (evento.tipo) {
        // ---------------------------------------
        // 1) Abrir módulo completo
        // ---------------------------------------
        case "AURA_MODULO":
          setVista(evento.modulo);
          if (evento.modulo === "aguaruta") {
            setSubrutaAgua(""); // reset pestaña
          }
          break;

        // ---------------------------------------
        // 2) Subruta dentro de AguaRuta
        // ---------------------------------------
        case "AURA_SUBRUTA":
          if (evento.modulo === "aguaruta") {
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
          }
          break;

        // ---------------------------------------
        // 3) Acciones reales del sistema
        // ---------------------------------------
        case "AURA_ACCION":
          manejarAccion(evento.accion, evento.payload);
          break;

        // ---------------------------------------
        // 4) Auto-Análisis de AURA Agent
        // ---------------------------------------
        case "AURA_ANALISIS_AUTOMATICO":
          alert(
            "🔍 AURA detectó problemas en el sistema:\n\n" +
              evento.payload.sugerencias.join("\n")
          );
          break;

        default:
          console.warn("⚠️ Evento desconocido:", evento);
      }
    });
  }, []);

  // ======================================================
  // ACCIONES GLOBALES DEL SISTEMA (ejecución real)
  // ======================================================
  const manejarAccion = (accion, payload) => {
    console.log("⚡ Ejecutando acción de AURA:", accion, payload);

    switch (accion) {
      case "logout":
        localStorage.removeItem("aura-acceso");
        window.location.reload();
        break;

      case "aguaruta-open-tab":
        setVista("aguaruta");
        setSubrutaAgua(payload.tab || "");
        break;

      case "filtrar-camion":
        aguarutaIframeRef.current?.contentWindow?.postMessage(
          {
            type: "FAZO_CMD",
            command: "filtrar-camion",
            camion: payload.camion,
          },
          "*"
        );
        break;

      case "reiniciar":
        window.location.reload();
        break;

      default:
        console.warn("⚠️ Acción no implementada:", accion);
    }
  };

  // ======================================================
  // CARGAR DATOS DINÁMICOS PARA NÚCLEO FAZO OS
  // ======================================================
  useEffect(() => {
    actualizarFAZOData();
  }, []);

  // ======================================================
  // RENDER PRINCIPAL DEL ESCRITORIO FAZO OS
  // ======================================================
  return (
    <div
      className="
        flex min-h-screen text-white
        bg-gradient-to-br from-black via-slate-900 to-black
        overflow-hidden relative fade-in
      "
    >
      {/* ========== MENÚ LATERAL FAZO ========== */}
      <SidebarFazo
        active={vista}
        onNavigate={(slug) => {
          setVista(slug);
          if (slug === "aguaruta") setSubrutaAgua("");
        }}
      />

      {/* ========== PANEL PRINCIPAL ========== */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto ml-64">
        <main className="flex-1 holo-fade smooth">
          {/* AguaRuta (iFrame completo) */}
          {vista === "aguaruta" && (
            <iframe
              ref={aguarutaIframeRef}
              src={`https://aguaruta.netlify.app/${subrutaAgua}`}
              title="AguaRuta"
              className="
                w-full h-[88vh]
                rounded-2xl border border-cyan-400/40
                bg-black/40 backdrop-blur-xl
                shadow-[0_0_25px_rgba(0,255,255,0.25)]
                transition-all duration-500 jarvis-frame
              "
            />
          )}

          {/* Traslado Municipal */}
          {vista === "traslado" && (
            <iframe
              ref={trasladoIframeRef}
              src="https://traslado-municipal.netlify.app"
              title="Traslado Municipal"
              className="
                w-full h-[88vh]
                rounded-2xl border border-emerald-400/40
                bg-black/40 backdrop-blur-xl
                shadow-[0_0_25px_rgba(0,255,255,0.25)]
              "
            />
          )}

          {/* Inicio */}
          {vista === "inicio" && (
            <div className="card-fazo-strong p-10 text-center blur-in">
              <h1 className="text-4xl font-bold text-cyan-300 mb-3">
                Bienvenido a FAZO-OS
              </h1>
              <p className="text-cyan-200/80">
                Sistema Operativo Municipal Inteligente.
              </p>
              <p className="text-cyan-300/40 mt-3">Conectado a AURA IA.</p>
            </div>
          )}

          {/* Flota */}
          {vista === "flota" && (
            <div className="card-fazo-strong p-10 text-center blur-in">
              <h2 className="text-3xl font-bold text-cyan-300 mb-2">
                Flota Municipal
              </h2>
              <p className="text-cyan-200/80">
                Gestión de vehículos — módulo en desarrollo.
              </p>
            </div>
          )}

          {/* Reportes */}
          {vista === "reportes" && (
            <div className="card-fazo-strong p-10 text-center blur-in">
              <h2 className="text-3xl font-bold text-cyan-300 mb-2">
                Panel de Reportes FAZO
              </h2>
              <p className="text-cyan-200/80">En construcción.</p>
            </div>
          )}

          {/* Ajustes */}
          {vista === "ajustes" && (
            <div className="card-fazo p-10 blur-in">
              <h2 className="text-2xl font-bold text-cyan-300 mb-4">
                Ajustes del Sistema
              </h2>

              <button
                onClick={() => {
                  localStorage.removeItem("aura-acceso");
                  window.location.reload();
                }}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ========== AURA ORB ========== */}
      <AuraOrb onClick={() => setAuraVisible(true)} />

      {/* ========== PANEL IA ========== */}
      <AuraCyberPanel
        visible={auraVisible}
        onClose={() => setAuraVisible(false)}
      />
    </div>
  );
}
