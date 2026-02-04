// ===================================================
// AURACommandDetector.js
// FAZO-OS 2025 — Núcleo de detección de comandos
// ===================================================

const COMMANDS = [
  {
    type: "OPEN_MODULE",
    module: "aguaruta",
    patterns: [
      "abre aguaruta",
      "abrir aguaruta",
      "ir a aguaruta",
      "entrar a aguaruta",
    ],
  },
  {
    type: "OPEN_MODULE",
    module: "flota",
    patterns: ["abre flota", "flota municipal"],
  },
];

export function detectarComando(texto) {
  if (!texto) return null;

  const clean = texto.toLowerCase();

  for (const cmd of COMMANDS) {
    for (const pattern of cmd.patterns) {
      if (clean.includes(pattern)) {
        return {
          type: cmd.type,
          module: cmd.module,
          original: texto,
          timestamp: new Date().toISOString(),
        };
      }
    }
  }

  return null;
}
