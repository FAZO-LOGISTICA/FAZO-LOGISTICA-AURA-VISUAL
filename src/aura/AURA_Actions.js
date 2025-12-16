// ===========================================================
//   AURA_Actions.js — FAZO OS (Autonomía Moderada)
//   Motor de acciones reales: módulos, subrutas y backend
// ===========================================================

export const AURA_Actions = {
  
  // -------------------------------------------------------
  // 1) ABRIR MÓDULOS PRINCIPALES FAZO OS
  // -------------------------------------------------------
  abrirModulo(modulo, onComando) {
    const rutas = {
      aguaruta: "/aguaruta",
      traslado: "/traslado",
      flota: "/flota",
      reportes: "/reportes",
      ajustes: "/ajustes",
      aura: "/",
    };

    onComando?.({
      tipo: "modulo",
      modulo,
      ruta: rutas[modulo] || "/",
    });

    return `Abriendo módulo ${modulo}…`;
  },

  // -------------------------------------------------------
  // 2) ABRIR SUBRUTAS INTERNAS DE AGUARUTA
  // -------------------------------------------------------
  abrirSubruta(ruta, frase, onComando, onSendToIframe) {
    onComando?.({ tipo: "subruta", ruta, frase });

    onSendToIframe?.("aguaruta", {
      type: "FAZO_CMD",
      command: "open-tab",
      tab: ruta.replace("/", ""),
    });

    return frase;
  },

  // -------------------------------------------------------
  // 3) ACCIONES DIRECTAS (logout, abrir mapa, etc.)
  // -------------------------------------------------------
  ejecutarAccion(accion, onComando) {
    onComando?.({ tipo: "accion", accion });

    const frases = {
      "abrir-rutas": "Abriendo rutas activas…",
      "abrir-mapa": "Mostrando mapa…",
      "abrir-traslado": "Cargando Traslado Municipal…",
      logout: "Cerrando sesión…",
    };

    return frases[accion] || "Ejecutando acción…";
  },

  // -------------------------------------------------------
  // 4) ACCIONES REALISTAS CON BACKEND (AURA PRO)
  // -------------------------------------------------------
  async llamarBackend(url, payload = {}) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) return null;
      return await res.json();

    } catch (err) {
      return null;
    }
  },

  // -------------------------------------------------------
  // 5) EJEMPLOS DE AUTONOMÍA MODERADA
  // -------------------------------------------------------
  async sugerenciaRedistribucion(datosActuales) {
    // Aquí AURA revisa si hay camiones sobrecargados
    const problemas = [];
    const sugerencias = [];

    datosActuales.forEach((camion) => {
      if (camion.litros > 45000) {
        problemas.push(`El camión ${camion.id} está sobre los 45.000 litros.`);
        sugerencias.push(`Mover 3–5 puntos desde ${camion.id} hacia A5 o M2.`);
      }

      if (camion.entregas < 5) {
        problemas.push(`El camión ${camion.id} tiene muy pocas entregas.`);
        sugerencias.push(`Revisar su ruta del día viernes.`);
      }
    });

    return { problemas, sugerencias };
  },

  async validarViernesLiviano(datosSemana) {
    let viernesTotal = datosSemana
      .filter((d) => d.dia === "viernes")
      .reduce((acc, cur) => acc + cur.litros, 0);

    if (viernesTotal > 320000) {
      return {
        alerta: true,
        mensaje:
          "El viernes está muy cargado. Recomiendo mover 10.000–15.000 L al jueves.",
      };
    }

    return {
      alerta: false,
      mensaje: "Viernes dentro del rango aceptable.",
    };
  },
};

export default AURA_Actions;
