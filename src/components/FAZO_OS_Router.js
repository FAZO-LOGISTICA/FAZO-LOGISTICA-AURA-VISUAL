// ================================================================
// FAZO_OS_Router.js — Sistema Operativo FAZO 2025 (VERSIÓN SUPREMA)
// Router central que controla TODAS las vistas + AURA + SidebarFazo
// Gustavo Oliva — Mateo IA
// ================================================================

import React, { useState, useCallback } from "react";
import SidebarFazo from "./SidebarFazo";
import AURAChat from "./AURAChat";

// ======= Importar módulos AguaRuta ===============================
import Inicio from "../views/Inicio";
import RutasActivas from "../views/RutasActivas";
import Mapa from "../views/Mapa";
import Graficos from "../views/Graficos";
import ComparacionSemanal from "../views/ComparacionSemanal";
import RegistrarEntrega from "../views/RegistrarEntrega";
import NoEntregadas from "../views/NoEntregadas";
import CamionEstadisticas from "../views/CamionEstadisticas";
import NuevaDistribucion from "../views/NuevaDistribucion";
import EditarRedistribucion from "../views/EditarRedistribucion";

// ======= Módulos extra ===========================================
import Traslado from "../views/Traslado";
import Flota from "../views/Flota";
import QR from "../views/QR";

// ================================================================
// TABLAS DE RUTEO — definición de cada vista
// ================================================================

const ROUTES = {
  inicio: <Inicio />,
  aura: <AURAChat />,
  "rutas-activas": <RutasActivas />,
  mapa: <Mapa />,
  graficos: <Graficos />,
  "comparacion-semanal": <ComparacionSemanal />,
  "registrar-entrega": <RegistrarEntrega />,
  "no-entregadas": <NoEntregadas />,
  "camion-estadisticas": <CamionEstadisticas />,
  "nueva-distribucion": <NuevaDistribucion />,
  "editar-redistribucion": <EditarRedistribucion />,
  traslado: <Traslado />,
  flota: <Flota />,
  qr: <QR />,
};

// ================================================================
// RENDERIZADOR DE RUTAS
// ================================================================
const renderView = (page) => {
  return ROUTES[page] || <Inicio />;
};

// ================================================================
// COMPONENTE PRINCIPAL — FAZO OS
// ================================================================
export default function FAZO_OS_Router() {
  const [currentPage, setCurrentPage] = useState("inicio");

  // ------- Navegación desde Sidebar -------------------------------
  const handleNavigate = useCallback((slug) => {
    setCurrentPage(slug);
  }, []);

  // ------- Navegación desde AURA (comandos IA) --------------------
  const handleComandoAURA = useCallback((cmd) => {
    if (!cmd) return;

    if (cmd.tipo === "modulo") {
      setCurrentPage(cmd.modulo);
    }

    if (cmd.tipo === "subruta") {
      setCurrentPage(cmd.ruta.replace("/", ""));
    }

    if (cmd.tipo === "accion") {
      if (cmd.accion === "abrir-rutas") setCurrentPage("rutas-activas");
      if (cmd.accion === "abrir-mapa") setCurrentPage("mapa");
      if (cmd.accion === "abrir-traslado") setCurrentPage("traslado");
      if (cmd.accion === "logout") {
        setCurrentPage("inicio");
      }
    }
  }, []);

  // ======== Vista final ===========================================
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      
      {/* Sidebar */}
      <SidebarFazo active={currentPage} onNavigate={handleNavigate} />

      {/* Contenido principal */}
      <main className="flex-1 ml-64 p-6 overflow-y-auto">
        {renderView(currentPage)}
      </main>

      {/* AURA Panel Inteligente flotante */}
      <div className="fixed bottom-6 right-6 w-[420px]">
        <AURAChat onComando={handleComandoAURA} />
      </div>
    </div>
  );
}
