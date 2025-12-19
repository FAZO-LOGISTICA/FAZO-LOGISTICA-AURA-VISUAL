/* ======================================================================
   AURA_NaturalLanguage.js — INTENT ENGINE PRO 2025
   FAZO LOGÍSTICA — Interpretación Natural de Órdenes para AURA OS
   Procesa lenguaje humano y lo convierte en comandos estructurados.
====================================================================== */

/* ======================================================================
   LIMPIEZA BASE
====================================================================== */
export const limpiar = (t) =>
  t
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // saca tildes
    .replace(/[^a-z0-9áéíóúñü\s]/gi, "")
    .trim() || "";

/* ======================================================================
   INTENTS — BIBLIOTECA DE COMPRENSIÓN
====================================================================== */
const patrones = [
  // ================================
  // ACCIONES SISTEMA
  // ================================
  {
    tipo: "accion",
    keys: ["cerrar sesion", "logout", "salirme", "cerrar sistema"],
    accion: "logout",
    frase: "Cerrando sesión.",
  },
  {
    tipo: "accion",
    keys: ["abrir rutas", "rutas", "rutas activas"],
    accion: "abrir-rutas",
    frase: "Abriendo Rutas Activas.",
  },
  {
    tipo: "accion",
    keys: ["abrir mapa", "mapa general", "ver mapa"],
    accion: "abrir-mapa",
    frase: "Mostrando mapa.",
  },

  // ================================
  // MÓDULOS COMPLETOS
  // ================================
  {
    tipo: "modulo",
    keys: ["aguaruta", "agua ruta", "agua", "entregas"],
    modulo: "aguaruta",
    frase: "Entrando al módulo AguaRuta.",
  },
  {
    tipo: "modulo",
    keys: ["traslado", "movilizacion", "vehiculos", "pasajeros"],
    modulo: "traslado",
    frase: "Abriendo Traslado Municipal.",
  },
  {
    tipo: "modulo",
    keys: ["flota", "vehiculos municipales", "camiones", "control vehicular"],
    modulo: "flota",
    frase: "Mostrando Flota Municipal.",
  },
  {
    tipo: "modulo",
    keys: ["inicio", "home", "pantalla principal", "volver"],
    modulo: "inicio",
    frase: "Volviendo al inicio del sistema.",
  },

  // ================================
  // SUBRUTAS DE AGUARUTA
  // ================================
  {
    tipo: "subruta",
    keys: ["rutas activas", "lista rutas", "panel rutas"],
    ruta: "rutas-activas",
    frase: "Abriendo Rutas Activas.",
  },
  {
    tipo: "subruta",
    keys: ["no entregadas", "pendientes", "no realizadas"],
    ruta: "no-entregadas",
    frase: "Mostrando entregas no realizadas.",
  },
  {
    tipo: "subruta",
    keys: ["estadisticas", "camion estadisticas", "rendimiento camiones"],
    ruta: "camion-estadisticas",
    frase: "Mostrando estadísticas del camión.",
  },
  {
    tipo: "subruta",
    keys: ["comparacion", "semanal", "graficos semana"],
    ruta: "comparacion-semanal",
    frase: "Mostrando comparación semanal.",
  },
  {
    tipo: "subruta",
    keys: ["registrar entrega", "nueva entrega", "cargar entrega"],
    ruta: "registrar-entrega",
    frase: "Abriendo registro de entrega.",
  },
  {
    tipo: "subruta",
    keys: ["nueva distribucion", "redistribucion nueva", "septiembre"],
    ruta: "nueva-distribucion",
    frase: "Mostrando Nueva Distribución.",
  },
  {
    tipo: "subruta",
    keys: ["editar distribucion", "editor distribucion", "editar rutas"],
    ruta: "editar-redistribucion",
    frase: "Editor de redistribución abierto.",
  },
];

/* ======================================================================
   MOTOR DE INTENCIÓN (INTENT ENGINE)
====================================================================== */
export function interpretar(texto) {
  const t = limpiar(texto);

  for (let p of patrones) {
    for (let key of p.keys) {
      if (t.includes(key)) {
        return {
          tipo: p.tipo,
          ...(p.accion && { accion: p.accion }),
          ...(p.modulo && { modulo: p.modulo }),
          ...(p.ruta && { ruta: p.ruta }),
          frase: p.frase,
        };
      }
    }
  }

  return { tipo: "desconocido" };
}
