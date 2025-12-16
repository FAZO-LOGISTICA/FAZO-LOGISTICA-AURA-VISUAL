// ======================================================================
//   AURASounds.js — HOLOSONIC ENGINE v2025 (VERSIÓN DEFINITIVA)
//   FAZO LOGÍSTICA — Gustavo Oliva
//   Motor de sonido holográfico sin archivos externos (WebAudio API)
//   Jarvis / Stark / AURA Neural FX
// ======================================================================

let audioCtx = null;
let talkNode = null;

// =======================================================
//  CREA O RETORNA EL AUDIO CONTEXT
// =======================================================
const getCtx = () => {
  if (typeof window === "undefined") return null;

  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  return audioCtx;
};

// =======================================================
//  TONO BÁSICO
// =======================================================
const tone = ({
  freq = 440,
  duration = 0.2,
  type = "sine",
  volume = 0.22,
  attack = 0.01,
  release = 0.1,
}) => {
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + attack);
  gain.gain.linearRampToValueAtTime(0, now + duration - release);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);
};

// =======================================================
//  BARRIDO / SWEEP
// =======================================================
const sweep = ({
  startFreq = 300,
  endFreq = 2000,
  duration = 0.35,
  volume = 0.22,
  type = "sine",
}) => {
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.03);
  gain.gain.linearRampToValueAtTime(0, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.02);
};

// ======================================================================
//      EFECTOS AURA PRINCIPALES
// ======================================================================

// BOOT DEL SISTEMA
export const playActivate = () => {
  try {
    tone({ freq: 250, duration: 0.25, volume: 0.35 });
    setTimeout(() => {
      sweep({ startFreq: 500, endFreq: 1800, duration: 0.35, volume: 0.28 });
    }, 140);
    setTimeout(() => {
      tone({ freq: 1200, type: "triangle", duration: 0.08, volume: 0.18 });
    }, 360);
  } catch {}
};

// COMANDO ACEPTADO
export const playCommand = () => {
  try {
    sweep({
      startFreq: 900,
      endFreq: 2600,
      duration: 0.25,
      volume: 0.32,
      type: "triangle",
    });
  } catch {}
};

// MIC ON — escuchando
export const playListen = () => {
  try {
    tone({ freq: 1500, duration: 0.14, type: "sine", volume: 0.26 });
  } catch {}
};

// MIC OFF — corte
export const playMicOff = () => {
  try {
    tone({ freq: 420, duration: 0.15, type: "sine", volume: 0.22 });
  } catch {}
};

// NOTIFICACIÓN AURA
export const playNotify = () => {
  try {
    tone({ freq: 1800, duration: 0.08, volume: 0.25 });
    setTimeout(() => {
      tone({ freq: 1200, duration: 0.1, volume: 0.22 });
    }, 80);
  } catch {}
};

// ======================================================================
//      HUM HOLOGRÁFICO CUANDO AURA HABLA
// ======================================================================
export const startTalk = () => {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    if (talkNode) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(165, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();

    talkNode = { osc, gain, ctx };
  } catch {}
};

export const stopTalk = () => {
  try {
    if (!talkNode) return;

    const { osc, gain, ctx } = talkNode;
    const now = ctx.currentTime;

    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.2);

    osc.stop(now + 0.25);
    talkNode = null;
  } catch {}
};

// ======================================================================
//      SONIDOS ADICIONALES (ÉXITO, ERROR, ALERTA, ESCANEO)
// ======================================================================

// ÉXITO
export const playSuccess = () => {
  try {
    tone({ freq: 900, duration: 0.12, volume: 0.25 });
    setTimeout(() => {
      tone({ freq: 1400, duration: 0.12, volume: 0.22 });
    }, 90);
  } catch {}
};

// ERROR
export const playError = () => {
  try {
    tone({ freq: 220, duration: 0.25, volume: 0.3 });
    setTimeout(() => {
      sweep({
        startFreq: 900,
        endFreq: 120,
        duration: 0.18,
        volume: 0.28,
        type: "square",
      });
    }, 120);
  } catch {}
};

// ALERTA
export const playAlert = () => {
  try {
    tone({ freq: 1600, duration: 0.1, volume: 0.35 });
    setTimeout(() => {
      tone({ freq: 900, duration: 0.12, volume: 0.3 });
    }, 90);
  } catch {}
};

// ESCANEO AURA
export const playScan = () => {
  try {
    sweep({
      startFreq: 300,
      endFreq: 2000,
      duration: 0.45,
      volume: 0.2,
    });
  } catch {}
};

// ======================================================================
//      🔥 SONIDOS DE INTERFAZ — CLICK & HOVER (lo que FALTABA)
// ======================================================================

// CLICK — requerido por tu UI
export const playClick = () => {
  try {
    tone({ freq: 1100, duration: 0.07, type: "triangle", volume: 0.22 });
    setTimeout(() => {
      tone({ freq: 1600, duration: 0.05, volume: 0.20 });
    }, 40);
  } catch {}
};

// HOVER — opcional, suave
export const playHover = () => {
  try {
    tone({ freq: 900, duration: 0.08, volume: 0.15 });
  } catch {}
};
