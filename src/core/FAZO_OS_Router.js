// ======================================================================
//  FAZO_OS_Router.js — Sistema de Orquestación FAZO OS 2025
//  FAZO Logística — Gustavo Oliva
//  Mateo IA — Router central + AURA Agent Integration
// ======================================================================

import { AURA_Agent } from "./AURA_Agent";
import { ejecutarAccion } from "./AURA_Actions";

let subscriptores = [];

// ===============================================================
// 1. Registrar suscriptores (AURAChat, AguaRuta, Traslado, etc.)
// ===============================================================
export function registrarSubsistema(callback) {
  subscriptores.push(callback);
}

// ===============================================================
// 2. Enviar comando a todos los módulos
// ===============================================================
export function enviarComandoGlobal(tipo, payload) {
  subscriptores.forEach((cb) => {
    try {
      cb({ tipo, payload });
    } catch (err) {
      console.warn("Error enviando comando a subsistema:", err);
    }
  });
}

// ===============================================================
// 3. Analizar datos globales FAZO (rutas, camiones, usuarios, etc.)
// ===============================================================
export function analizarFAZO(datos) {
  const reporte = AURA_Agent.analizarContexto(datos);
  const sugerencias = AURA_Agent.generarSugerencias();

  return {
    reporte,
    sugerencias,
    estado: AURA_Agent.obtenerEstado(),
  };
}

// ===============================================================
// 4. Ejecución automática inteligente
// ===============================================================
export function motorAutonomoFAZO() {
  const resultado = AURA_Agent.actuarSiEsNecesario();
  return resultado;
}

// ======================================================================
// 5. Modo HÍBRIDO — Revisión periódica + análisis manual
// ======================================================================

// Intervalo automático: cada 45 segundos
let intervalo = null;

export function iniciarModoHibrido(getDatos) {
  if (intervalo) clearInterval(intervalo);

  intervalo = setInterval(async () => {
    try {
      const datos = await getDatos();

      const analisis = analizarFAZO(datos);

      enviarComandoGlobal("AURA_ANALISIS_AUTOMATICO", {
        reporte: analisis.reporte,
        sugerencias: analisis.sugerencias,
      });

      // Autonomía: ejecutar acciones si corresponde
      motorAutonomoFAZO();

    } catch (err) {
      console.log("Error en revisión automática FAZO:", err);
    }
  }, 45000); // 45 segundos recomendado
}

// ======================================================================
// 6. Análisis manual solicitado por Gustavo
// ======================================================================
export async function analizarManual(getDatos) {
  const datos = await getDatos();
  const analisis = analizarFAZO(datos);

  return {
    mensaje: "Análisis manual completado.",
    ...analisis,
  };
}

// ======================================================================
// 7. Ejecutar acciones directamente desde AURAChat
// ======================================================================
export function ejecutarAccionFAZO(nombre, payload = null) {
  return ejecutarAccion(nombre, payload);
}

