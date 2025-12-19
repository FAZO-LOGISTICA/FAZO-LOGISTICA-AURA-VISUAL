/* ======================================================================
   AURA_NaturalLanguage.js — INTENT ENGINE PRO+ 2025
   FAZO LOGÍSTICA — Interpretación Natural de Órdenes para AURA OS
   Procesa lenguaje humano y lo convierte en comandos estructurados.
====================================================================== */

/* ======================================================================
   LIMPIEZA BASE (normaliza texto)
====================================================================== */
export const limpiar = (t) =>
  t
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quita tildes
    .replace(/[^\w\sáéíóúñ]/gi, "") // Limpia símbolos raros
    .replace(/\s+/g, " ")
    .trim() || "";

/* ======================================================================
   INTENTS — BIBLIOTECA DE COMANDOS
====================================================================== */
const patrones = [
  // ====================================================
  // ACCIONES DEL SISTEMA
  // ====================================================
  {
    tipo: "accion",
    keys: ["cerrar sesion", "logout", "salir del sistema", "salirme"],
    accion: "logout",
    frase: "Cerrando sesión del sistema FAZO OS.",
  },
  {
    tipo: "accion",
    keys: ["abrir rutas", "rutas", "mostrar rutas activas"],
    accion: "abrir-rutas",
    frase: "Abriendo Rutas Activas.",
  },
  {
    tipo: "accion",
    keys: ["filtrar camion a", "camion a1", "camion a2", "camion a3", "camion a4", "camion a5", "camion m1", "camion m2"],
    accion: "filtro-camion",
    frase: "Aplicando filtro por camión.",
  },
  {
    tipo: "accion",
    keys: ["mostrar mapa", "abrir mapa", "ver mapa", "mapa general"],
    accion: "abrir-mapa",
    frase: "Mostrando el mapa operativo.",
  },

  // ====================================================
  // MÓDULOS COMPLETOS (NAVEGACIÓN GENERAL)
  // ====================================================
  {
    tipo: "modulo",
    keys: ["aguaruta", "agua ruta", "agua", "entregas", "sistema de agua"],
    modulo: "aguaruta",
    frase: "Entrando al módulo AguaRuta.",
  },
  {
    tipo: "modulo",
    keys: ["traslado", "movilizacion", "viajes", "pasajeros", "transportes"],
    modulo: "traslado",
    frase: "Abriendo Traslado Municipal.",
  },
  {
    tipo: "modulo",
    keys: ["flota", "vehiculos", "camiones municipales", "maquinaria"],
    modulo: "flota",
    frase: "Mostrando el panel de Flota Municipal.",
  },
  {
    tipo: "modulo",
    keys: ["inicio", "home", "pantalla principal", "volver al inicio"],
    modulo: "inicio",
    frase: "Volviendo al inicio del sistema.",
  },
  {
    tipo: "modulo",
    keys: ["reportes", "panel de reportes", "graficos generales", "dashboard"],
    modulo: "reportes",
    frase: "Abriendo Panel de Reportes.",
  },

  // ====================================================
  // SUBRUTAS — AGUARUTA OS
  // ====================================================
  {
    tipo: "subruta",
    keys: ["rutas activas", "panel rutas", "ver rutas", "lista de rutas"],
    ruta: "rutas-activas",
    modulo: "aguaruta",
    frase: "Abriendo Rutas Activas.",
  },
  {
    tipo: "subruta",
    keys: ["no entregadas", "pendientes", "no realizadas", "no se entrego"],
    ruta: "no-entregadas",
    modulo: "aguaruta",
    frase: "Mostrando entregas no realizadas.",
  },
  {
    tipo: "subruta",
    keys: ["estadisticas", "camion estadisticas", "rendimiento camiones", "kpi camion"],
    ruta: "camion-estadisticas",
    modulo: "aguaruta",
    frase: "Mostrando estadísticas del camión.",
  },
  {
    tipo: "subruta",
    keys: ["comparacion", "semanal", "graficos semana", "comparar semanas"],
    ruta: "comparacion-semanal",
    modulo: "aguaruta",
    frase: "Mostrando comparación semanal.",
  },
  {
    tipo: "subruta",
    keys: ["registrar entrega", "nueva entrega", "registrar agua"],
    ruta: "registrar-entrega",
    modulo: "aguaruta",
    frase: "Abriendo formulario de registro de entrega.",
  },
  {
    tipo: "subruta",
    keys: ["nueva distribucion", "redistribucion nueva", "septiembre", "dibujar nueva ruta"],
    ruta: "nueva-distribucion",
    modulo: "aguaruta",
    frase: "Mostrando Nueva Distribución.",
  },
  {
    tipo: "subruta",
    keys: ["editar distribucion", "editor distribucion", "editar rutas", "modificar redistribucion"],
    ruta: "editar-redistribucion",
    modulo: "aguaruta",
    frase: "Abriendo Editor de Redistribución.",
  },

  // ====================================================
  // PREGUNTAS NATURALES (mejor comprensión)
  // ====================================================
  {
    tipo: "modulo",
    keys: ["quiero ver el agua", "como va el agua", "estado del agua"],
    modulo: "aguaruta",
    frase: "Abriendo módulo AguaRuta.",
  },
  {
    tipo: "subruta",
    keys: ["que rutas hay", "mostrar rutas", "dime rutas"],
    ruta: "rutas-activas",
    modulo: "aguaruta",
    frase: "Estas son las rutas activas.",
  },
];

/* ======================================================================
   MOTOR DE INTENCIÓN — DEVUELVE UN OBJETO LIMPIO PARA AURA OS
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
