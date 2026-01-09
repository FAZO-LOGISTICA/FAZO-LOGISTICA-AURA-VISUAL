// ===================================================
// AURACommandDetector.js
// FAZO-OS 2025 — Núcleo de detección de comandos
// ===================================================

const COMMANDS = [
  {
    key: "VER_RUTAS",
    patterns: ["ver rutas", "mostrar rutas", "rutas activas"],
  },
  {
    key: "REDISTRIBUIR",
    patterns: ["redistribuir", "recalcular rutas"],
  },
  {
    key: "GENERAR_REPORTE",
    patterns: ["generar reporte", "crear informe"],
  },
  {
    key: "ESTADO_SISTEMA",
    patterns: ["estado del sistema", "estado aura"],
  },
];

export function detectarComando(texto) {
  if (!texto) return null;

  const clean = texto.toLowerCase();

  for (const cmd of COMMANDS) {
    for (const pattern of cmd.patterns) {
      if (clean.includes(pattern)) {
        return {
          tipo: cmd.key,
          original: texto,
          timestamp: new Date().toISOString(),
        };
      }
    }
  }

  return null;
}
