// ======================================================================
//  AURA_CyberPanel.js — Consola Técnica / Debug / Monitor de AURA OS
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Arquitectura FAZO-OS 2025
// ======================================================================

import { registrarSubsistema } from "./FAZO_OS_EventBridge";
import { interpretar } from "./AURA_NaturalLanguage";
import { ejecutarAccion } from "./AURA_Actions";
import { AURA_NEXUS } from "./AURA_NEXUS";

// Estado interno
let logs = [];
let listenersActivos = false;

// ======================================================================
//  AGREGAR LOG
// ======================================================================
export function cyberLog(origen, contenido) {
  const entry = {
    fecha: new Date().toLocaleTimeString(),
    origen,
    contenido,
  };
  logs.push(entry);

  // Limitar tamaño (últimos 200)
  if (logs.length > 200) logs.shift();

  // Si existe panel en pantalla → actualizarlo
  const panel = document.getElementById("AURA_CYBER_PANEL");
  if (panel) {
    const body = panel.querySelector(".panel-body");
    if (body) {
      const line = document.createElement("div");
      line.className = "log-line";
      line.textContent = `[${entry.fecha}] (${entry.origen}) → ${entry.contenido}`;
      body.appendChild(line);
      body.scrollTop = body.scrollHeight;
    }
  }
}

// ======================================================================
//  MOSTRAR PANEL
// ======================================================================
export function abrirCyberPanel() {
  // ¿Ya existe?
  if (document.getElementById("AURA_CYBER_PANEL")) return;

  const panel = document.createElement("div");
  panel.id = "AURA_CYBER_PANEL";
  panel.innerHTML = `
    <style>
      #AURA_CYBER_PANEL {
        position: fixed;
        top: 0;
        right: 0;
        width: 420px;
        height: 100vh;
        background: rgba(5, 5, 15, 0.88);
        border-left: 3px solid #0ff;
        color: #0ff;
        font-family: monospace;
        z-index: 999999;
        display: flex;
        flex-direction: column;
      }
      #AURA_CYBER_PANEL .header {
        padding: 10px;
        background: rgba(0, 255, 255, 0.2);
        border-bottom: 1px solid #0ff;
        font-size: 18px;
        font-weight: bold;
      }
      #AURA_CYBER_PANEL .panel-body {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        font-size: 13px;
        line-height: 1.3em;
      }
      .log-line {
        margin-bottom: 6px;
        white-space: pre-line;
      }
      #AURA_CYBER_PANEL .input-area {
        display: flex;
        border-top: 1px solid #0ff;
      }
      #AURA_CYBER_PANEL input {
        flex: 1;
        background: black;
        color: #0ff;
        border: none;
        padding: 8px;
        outline: none;
        font-family: monospace;
      }
      #AURA_CYBER_PANEL button {
        background: #0ff;
        color: black;
        border: none;
        padding: 8px 12px;
        cursor: pointer;
        font-weight: bold;
      }
    </style>

    <div class="header">⚡ AURA CyberPanel — FAZO OS</div>
    <div class="panel-body"></div>
    <div class="input-area">
      <input id="cyberInput" placeholder="Escribe comando…" />
      <button id="cyberSend">▶</button>
    </div>
  `;

  document.body.appendChild(panel);

  cyberLog("CyberPanel", "Panel iniciado correctamente.");
  inicializarEventosCyberPanel();
}

// ======================================================================
//  CERRAR PANEL
// ======================================================================
export function cerrarCyberPanel() {
  const panel = document.getElementById("AURA_CYBER_PANEL");
  if (panel) panel.remove();
}

// ======================================================================
//  LISTENER DEL PANEL
// ======================================================================
function inicializarEventosCyberPanel() {
  const input = document.getElementById("cyberInput");
  const sendBtn = document.getElementById("cyberSend");

  sendBtn.onclick = () => procesarComando(input.value);
  input.onkeydown = (e) => {
    if (e.key === "Enter") procesarComando(input.value);
  };
}

// ======================================================================
//  PROCESAR COMANDOS DESDE LA CONSOLA
// ======================================================================
async function procesarComando(cmd) {
  if (!cmd.trim()) return;

  cyberLog("Usuario", cmd);

  // ✔ Ejecutar a través del Intent Engine
  const intent = interpretar(cmd);

  if (intent.tipo !== "desconocido") {
    cyberLog("IntentEngine", JSON.stringify(intent));
    ejecutarAccion(intent.accion, intent.payload);
    return;
  }

  // ✔ Pasarlo al cerebro (NEXUS)
  const out = await AURA_NEXUS(cmd, [], navigator.onLine);

  cyberLog("NEXUS", JSON.stringify(out));

  // Limpiar input
  const input = document.getElementById("cyberInput");
  if (input) input.value = "";
}

// ======================================================================
//  ACTIVAR ESCUCHADORES OS
// ======================================================================
export function activarCyberListeners() {
  if (listenersActivos) return;
  listenersActivos = true;

  registrarSubsistema((evento) => {
    cyberLog("OS_EVENT", JSON.stringify(evento));
  });

  cyberLog("CyberPanel", "Listeners FAZO OS activados.");
}
