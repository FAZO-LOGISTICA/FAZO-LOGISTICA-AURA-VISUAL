// ======================================================================
//  AURA_AutoFix.js — Motor Universal de Reparación Inteligente
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Sistema de Autocorrección Total (Smart Universal + AguaRuta)
// ======================================================================

import { FAZO_OS_EventBridge } from "./FAZO_OS_EventBridge";
import { obtenerDatosFAZO } from "./FAZO_DATA";
import { AURA_MultiModel_Process } from "./AURA_MultiModel";

// ======================================================================
//  PERFIL INTELIGENTE (Smart Universal)
// ======================================================================
const PROFILE = {
  nombre: "AURA AutoFix — Smart Universal v2025",
  version: "1.0.0",

  // Reglas universales para cualquier proyecto FAZO
  reglasGenerales: [
    "Verificar sintaxis React y eliminar imports muertos",
    "Reemplazar código duplicado por utilidades centralizadas",
    "Corregir rutas de API incorrectas",
    "Detectar funciones que nunca retornan",
    "Detener loops infinitos",
    "Reconstruir componentes incompletos",
    "Arreglar problemas típicos de Netlify, Render y Expo",
  ],

  // Perfil optimizado para AGUARUTA (automático)
  reglasAguaRuta: [
    "Detectar columnas faltantes en rutas-activas",
    "Corregir normalización de nombre, día y camión",
    "Recrear vistas faltantes (Mapa, No Entregadas, Estadísticas)",
    "Validar litros entre 300 y 50000",
    "Corregir puntos sin coordenadas",
    "Detectar duplicados por nombre y teléfono",
    "Verificar estructura del backend FastAPI",
    "Reconstruir JSONs dañados o incompletos",
  ],
};

// ======================================================================
//  FUNCIÓN PRINCIPAL — Auto Fix Sugerido / Auto Fix Directo
// ======================================================================
export async function AURA_AutoFix(textoUsuario, historial, online = true) {
  const datos = obtenerDatosFAZO();

  // RESUMEN para la IA Multimodel (OPTIMIZADO)
  const contexto = {
    sistema: PROFILE,
    proyecto: datos?.proyecto || "desconocido",
    componentes: datos?.componentes || [],
    erroresDetectados: datos?.errores || [],
    rutasBackend: datos?.backend || [],
    rutasFrontend: datos?.frontend || [],
    puntos: datos?.puntos || [],
    camiones: datos?.camiones || [],
  };

  // Construcción del mensaje
  const mensaje = `
Eres AURA AutoFix, motor universal del FAZO OS.

Tu objetivo:
- detectar fallas,
- reconstruir archivos completos,
- generar funciones listas para pegar,
- corregir sintaxis,
- crear vistas faltantes,
- optimizar componentes,
- reparar errores de FastAPI, React, Expo.

Perfil cargado:
${JSON.stringify(PROFILE, null, 2)}

Contexto actual del sistema:
${JSON.stringify(contexto, null, 2)}

Solicitud del usuario:
"${textoUsuario}"

REGLAS:
1. SIEMPRE responde con archivos completos.
2. NO entregues parches, entregas el archivo entero corregido.
3. Si hay múltiples archivos dañados, entrega uno por uno en orden.
4. Usa nombres reales de archivos: AURAChat.js, App.js, RutasActivas.js, etc.
5. No inventes rutas; usa las del sistema FAZO.
6. SI EL PROYECTO ES AGUARUTA → prioriza perfil AguaRuta.
7. SI EL USUARIO PIDE “AUTO FIX COMPLETO” → entrega solución total.
`;

  // Si está online → usamos IA Multimodel con proveedor dinámico
  let respuestaIA = "Estoy sin conexión. No puedo generar correcciones.";
  let proveedor = "offline";

  if (online) {
    try {
      const resultado = await AURA_MultiModel_Process(mensaje, historial);
      respuestaIA = resultado.respuesta;
      proveedor = resultado.proveedor;
    } catch (err) {
      respuestaIA = "Error al procesar IA Multimodel.";
    }
  }

  // Enviar evento al sistema para mostrar origen
  FAZO_OS_EventBridge.emitirEvento({
    tipo: "AURA_AUTOFIX",
    proveedor,
    mensaje: "Corrección automática generada.",
  });

  return {
    tipo: "autofix",
    proveedor,
    respuesta: respuestaIA,
  };
}

// ======================================================================
//  MODO RÁPIDO: AutoFix directo sin mensaje del usuario
// ======================================================================
export async function AURA_AutoFix_Rapido() {
  return AURA_AutoFix("Repara todo el proyecto automáticamente.", [], true);
}

// ======================================================================
//  MODO AGUARUTA ESPECIAL — Optimizado
// ======================================================================
export async function AURA_AutoFix_AguaRuta() {
  return AURA_AutoFix(
    "Repara específicamente el módulo AguaRuta completo.",
    [],
    true
  );
}
