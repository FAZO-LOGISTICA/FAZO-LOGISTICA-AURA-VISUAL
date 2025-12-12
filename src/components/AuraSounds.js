// ======================================================================
//   AURASounds.js — HOLOSONIC ENGINE v2025 (VERSIÓN COMPLETA)
//   FAZO LOGÍSTICA — Gustavo Oliva
//   Sonidos hiperrealistas sin archivos (WebAudio API)
//   Jarvis / Stark FX | Hologram Engine | Intelligent Audio
// ======================================================================

let audioCtx = null;
let talkNode = null;

// =======================================================
//  CREA / RETORNA EL AUDIO CONTEXT
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
//  GENERADOR DE TONOS
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
//  SWEEP / BARRIDO JARVIS-STYLE
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
//      EFECTOS DE INTERFAZ AURA
// ======================================================================

// BOOT AURA
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

// COMANDO EJECUTADO
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

// MIC ON
export const playListen = () => {
  try {
    tone({ freq: 1500, duration: 0.14, type: "sine", volume: 0.26 });
  } catch {}
};

// MIC OFF
export const playMicOff = () => {
  try {
    tone({ freq: 420, duration: 0.15, type: "sine", volume: 0.22 });
  } catch {}
};

// NOTIFICACIÓN
export const playNotify = () => {
  try {
    tone({ freq: 1800, duration: 0.08, volume: 0.25 });
    setTimeout(() => {
      tone({ freq: 1200, duration: 0.1, volume: 0.22 });
    }, 80);
  } catch {}
};

// ======================================================================
//   HUM HOLOGRÁFICO CUANDO AURA HABLA
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
//   **NUEVOS: ÉXITO / ERROR / ALERTA / ESCANEO** 
//   (lo que faltaba para que Netlify compile)
// ======================================================================

// ✔ Operación exitosa (estilo holograma suave)
export const playSuccess = () => {
  try {
    tone({ freq: 900, duration: 0.12, volume: 0.25 });
    setTimeout(() => {
      tone({ freq: 1400, duration: 0.12, volume: 0.22 });
    }, 80);
  } catch {}
};

// ✔ Error (grave + glitch)
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
    }, 100);
  } catch {}
};

// ✔ Alerta importante (notificación roja)
export const playAlert = () => {
  try {
    tone({ freq: 1600, duration: 0.1, volume: 0.35 });
    setTimeout(() => {
      tone({ freq: 900, duration: 0.12, volume: 0.3 });
    }, 90);
  } catch {}
};

// ✔ Efecto de escaneo holográfico
export const playScan = () => {
  try {
    sweep({
      startFreq: 300,
      endFreq: 2000,
      duration: 0.45,
      volume: 0.2,
      type: "sine",
    });
  } catch {}
};

