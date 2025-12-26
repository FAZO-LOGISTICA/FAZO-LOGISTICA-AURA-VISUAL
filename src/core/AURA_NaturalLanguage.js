/* ======================================================================
   AURA_NaturalLanguage.js — INTENT ENGINE PRO 2025 (PASO 10 COMPLETO)
   Incluye:
   - Acciones del sistema
   - Módulos FAZO OS
   - Subrutas
   - Comandos AutoFix y Reparación
   - Limpieza robusta
   FAZO LOGÍSTICA — Gustavo Oliva
====================================================================== */

/* ------------------------------
   Limpieza general de texto
-------------------------------- */
export const limpiar = (t) =>
  t
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9ñáéíóú\s]/gi, "")
    .trim() || "";

/* ======================================================================
   PATRONES DE INTENCIÓN
====================================================================== */

const patrones = [
  /* =======================================================
     ACCIONES GENERALES DEL SISTEMA
  ======================================================= */
  {
    tipo: "accion",
    keys: ["cerrar sesion", "logout", "salir del sistema"],
    accion: "logout",
    frase: "Cerrando sesión.",
  },
  {
    tipo: "accion",
    keys: ["abrir rutas", "rutas activas"],
    accion: "abrir-rutas",
    frase: "Abriendo Rutas Activas.",
  },
  {
    tipo: "accion",
    keys: ["abrir mapa", "ver mapa"],
    accion: "abrir-mapa",
    frase: "Mostrando mapa.",
  },

  /* =======================================================
     MÓDULOS COMPLETOS (AGUARUTA / FLOTa / TRASLADO)
  ======================================================= */
  {
    tipo: "modulo",
    keys: ["aguaruta", "agua ruta", "agua"],
    modulo: "aguaruta",
    frase: "Entrando al módulo AguaRuta.",
  },
  {
    tipo: "modulo",
    keys: ["traslado", "traslado municipal", "transporte"],
    modulo: "traslado",
    frase: "Abriendo Traslado Municipal.",
  },
  {
    tipo: "modulo",
    keys: ["flota", "flota municipal", "vehiculos"],
    modulo: "flota",
    frase: "Mostrando Flota Municipal.",
  },
  {
    tipo: "modulo",
    keys: ["inicio", "pantalla principal", "home"],
    modulo: "inicio",
    frase: "Volviendo al inicio.",
  },

  /* =======================================================
     SUBRUTAS AGUARUTA
  ======================================================= */
  {
    tipo: "subruta",
    keys: ["rutas activas", "panel rutas"],
    ruta: "rutas-activas",
    frase: "Abriendo Rutas Activas.",
  },
  {
    tipo: "subruta",
    keys: ["no entregadas", "pendientes"],
    ruta: "no-entregadas",
    frase: "Mostrando entregas no realizadas.",
  },
  {
    tipo: "subruta",
    keys: ["estadisticas", "camion estadisticas", "rendimiento"],
    ruta: "camion-estadisticas",
    frase: "Mostrando estadísticas por camión.",
  },
  {
    tipo: "subruta",
    keys: ["comparacion", "comparacion semanal", "semanal"],
    ruta: "comparacion-semanal",
    frase: "Mostrando comparación semanal.",
  },
  {
    tipo: "subruta",
    keys: ["registrar entrega", "nueva entrega"],
    ruta: "registrar-entrega",
    frase: "Abriendo registro de entrega.",
  },
  {
    tipo: "subruta",
    keys: ["nueva distribucion", "redistribucion"],
    ruta: "nueva-distribucion",
    frase: "Abriendo nueva redistribución.",
  },
  {
    tipo: "subruta",
    keys: ["editar distribucion", "editor distribucion"],
    ruta: "editar-redistribucion",
    frase: "Editor de redistribución abierto.",
  },

  /* =======================================================
     AUTOFIX — COMANDOS DE REPARACIÓN TOTAL
  ======================================================= */

  // Reparación general del sistema
  {
    tipo: "autofix",
    keys: ["repara el sistema", "arregla el sistema", "fix system", "autofix"],
    modo: "full",
    frase: "Iniciando reparación completa del sistema.",
  },

  // Reparación específica de AguaRuta
  {
    tipo: "autofix",
    keys: ["arregla aguaruta", "repara aguaruta", "fix aguaruta"],
    modo: "aguaruta",
    frase: "Reparando módulo AguaRuta.",
  },

  // Reparación del OS
  {
    tipo: "autofix",
    keys: ["optimiza el sistema", "reparar os", "fix os"],
    modo: "os",
    frase: "Optimizando FAZO OS.",
  },

  // Reinicio o recarga del sistema
  {
    tipo: "autofix",
    keys: ["reiniciar aura", "reinicia aura", "reset aura"],
    modo: "reset",
    frase: "Reiniciando componentes internos de AURA.",
  },
];

/* ======================================================================
   MOTOR DE INTENCIÓN
====================================================================== */
export function interpretar(texto) {
  const t = limpiar(texto);

  for (const p of patrones) {
    for (const key of p.keys) {
      if (t.includes(key)) {
        return {
          tipo: p.tipo,
          ...(p.accion && { accion: p.accion }),
          ...(p.modulo && { modulo: p.modulo }),
          ...(p.ruta && { ruta: p.ruta }),
          ...(p.modo && { modo: p.modo }), // para AutoFix
          frase: p.frase,
        };
      }
    }
  }

  return { tipo: "desconocido" };
}
