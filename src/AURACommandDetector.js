// ===================================================
// AURACommandDetector.js
// FAZO-OS 2025 — Núcleo de detección de comandos
// ===================================================

// Normaliza texto: minusculas, sin tildes, sin espacios
const normalize = (text = "") =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");

// ===================================================
// COMANDOS DEFINIDOS DE FAZO OS
// ===================================================

const COMMANDS = [
  // =======================
  // MÓDULOS
  // =======================
  {
    type: "OPEN_MODULE",
    module: "AguaRuta",
    patterns: [
      "aguaruta",
      "abreaguaruta",
      "abriraguaruta",
      "abre aguaruta",
      "agua ruta",
      "rutas de agua",
    ],
  },
  {
    type: "OPEN_MODULE",
    module: "Flota",
    patterns: ["flota", "abreflota", "abrir flota"],
  },
  {
    type: "OPEN_MODULE",
    module: "Reportes",
    patterns: ["reportes", "informes", "ver reportes"],
  },

  // =======================
  // ACCIONES
  // =======================
  {
    type: "ACTION",
    action: "VER_RUTAS",
    patterns: ["ver rutas", "rutas activas"],
  },
  {
    type: "ACTION",
    action: "REDISTRIBUIR",
    patterns: ["redistribuir", "recalcular rutas"],
  },
];

// ===================================================
// DETECTOR PRINCIPAL
// ===================================================

export function detectarComando(texto) {
  if (!texto) return null;

  const limpio = normalize(texto);

  for (const cmd of COMMANDS) {
    for (const p of cmd.patterns) {
      if (limpio.includes(normalize(p))) {
        return {
          type: cmd.type,
          module: cmd.module || null,
          action: cmd.action || null,
          original: texto,
          source: "FAZO",
          timestamp: new Date().toISOString(),
        };
      }
    }
  }

  return null;
}
