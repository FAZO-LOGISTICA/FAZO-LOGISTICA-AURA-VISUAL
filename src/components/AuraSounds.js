// ======================================================================
//   AURASounds.js — HOLOSONIC ENGINE v2025
//   FAZO LOGÍSTICA — Gustavo Oliva
//   Sonidos hiperrealistas sin archivos de audio (WebAudio API)
//   Jarvis-Style | Hologram FX | Intelligent Volume Control
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
//  GENERADOR DE TONEOS UNIVERSAL
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
//  BARRIDO / SWEEP DE FRECUENCIAS (Jarvis Scan FX)
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
//   EFECTOS ESPECÍFICOS PARA AURA
// ======================================================================

// ----------------------------------------------------------------------
//  1) BOOT de AURA — al iniciar el sistema (Jarvis Boot Sequence)
// ----------------------------------------------------------------------
export const playActivate = () => {
  try {
    tone({ freq: 250, duration: 0.25, volume: 0.35 });
    setTimeout(() => {
      sweep({
        startFreq: 500,
        endFreq: 1800,
        duration: 0.35,
        volume: 0.28,
      });
    }, 140);

    // Glow energético final
    setTimeout(() => {
      tone({
        freq: 1200,
        type: "triangle",
        duration: 0.08,
        volume: 0.18,
      });
    }, 360);
  } catch {}
};

// ----------------------------------------------------------------------
//  2) COMANDO EJECUTADO — “Entendido Gustavo, abriendo AguaRuta…”
// ----------------------------------------------------------------------
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

// ----------------------------------------------------------------------
//  3) MIC ON — AURA comienza a escuchar (pip Stark)
// ----------------------------------------------------------------------
export const playListen = () => {
  try {
    tone({
      freq: 1500,
      duration: 0.14,
      type: "sine",
      volume: 0.26,
    });
  } catch {}
};

// ----------------------------------------------------------------------
//  4) MIC OFF — cuando el usuario corta el micrófono (pip grave)
// ----------------------------------------------------------------------
export const playMicOff = () => {
  try {
    tone({
      freq: 420,
      duration: 0.15,
      type: "sine",
      volume: 0.22,
    });
  } catch {}
};

// ----------------------------------------------------------------------
//  5) NOTIFICACIÓN AURA — “Listo Gustavo”
// ----------------------------------------------------------------------
export const playNotify = () => {
  try {
    tone({ freq: 1800, duration: 0.08, volume: 0.25 });
    setTimeout(() => {
      tone({ freq: 1200, duration: 0.1, volume: 0.22 });
    }, 80);
  } catch {}
};

// ----------------------------------------------------------------------
//  6) HUM CUÁNTICO CUANDO AURA HABLA
// ----------------------------------------------------------------------
export const startTalk = () => {
  try {
    const ctx = getCtx();
    if (!ctx) return;

    // evitar múltiples loops
    if (talkNode) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(165, ctx.currentTime); // tono profundo IA

    // entrada suave
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    talkNode = { osc, gain, ctx };
  } catch {}
};

// ----------------------------------------------------------------------
//  7) AURA TERMINA DE HABLAR — se apaga el hum holográfico
// ----------------------------------------------------------------------
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
//  EXTRA FX OPCIONALES (Puedes pedirlos cuando quieras)
//  - playError()
//  - playScan()
//  - playAlert()
//  - playSuccess()
// ======================================================================
