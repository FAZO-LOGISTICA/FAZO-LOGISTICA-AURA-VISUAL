// src/components/AuraSounds.js

/**
 * Módulo oficial de sonidos FAZO-Stark.
 * Usa Web Audio API para generar sonidos tipo Jarvis
 * sin depender de archivos .wav.
 *
 * Mantiene la misma interfaz:
 *  - playActivate()
 *  - playCommand()
 *  - playListen()
 *  - startTalk()
 *  - stopTalk()
 */

let audioCtx = null;
let talkNode = null;

const getAudioCtx = () => {
  if (typeof window === "undefined") return null;

  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  return audioCtx;
};

/**
 * Reproduce un tono corto con envolvente.
 * options:
 *  - freq: frecuencia principal
 *  - duration: en segundos
 *  - type: 'sine' | 'square' | 'sawtooth' | 'triangle'
 *  - volume: 0–1
 *  - attack: s
 *  - release: s
 */
const playTone = ({
  freq = 440,
  duration = 0.25,
  type = "sine",
  volume = 0.25,
  attack = 0.01,
  release = 0.08,
}) => {
  const ctx = getAudioCtx();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  // Envolvente
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + attack);
  gain.gain.linearRampToValueAtTime(0, now + duration - release);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);
};

/**
 * Barrido de frecuencia (beep "Jarvis")
 */
const playSweep = ({
  startFreq = 400,
  endFreq = 1200,
  duration = 0.35,
  volume = 0.25,
}) => {
  const ctx = getAudioCtx();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
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

/* ================================
   SONIDOS ESPECÍFICOS AURA / FAZO
   ================================ */

/**
 * Sonido al iniciar AURA (boot Jarvis)
 * Dos tonos: uno grave + uno agudo corto
 */
export const playActivate = () => {
  try {
    playTone({ freq: 320, duration: 0.22, type: "sine", volume: 0.3 });
    setTimeout(() => {
      playSweep({
        startFreq: 600,
        endFreq: 1600,
        duration: 0.28,
        volume: 0.28,
      });
    }, 120);
  } catch {
    /* silencio si el navegador bloquea audio */
  }
};

/**
 * Sonido cuando AURA reconoce un comando:
 * "Abriendo AguaRuta..." etc.
 */
export const playCommand = () => {
  try {
    playSweep({
      startFreq: 800,
      endFreq: 2000,
      duration: 0.25,
      volume: 0.3,
    });
  } catch {}
};

/**
 * Sonido cuando AURA empieza a escuchar.
 * Un pequeño "pip" agudo.
 */
export const playListen = () => {
  try {
    playTone({
      freq: 1400,
      duration: 0.12,
      type: "triangle",
      volume: 0.22,
    });
  } catch {}
};

/**
 * Hum suave holográfico mientras AURA habla.
 * Se detiene con stopTalk().
 */
export const startTalk = () => {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;

    // Si ya hay un loop, no crear otro
    if (talkNode && talkNode.osc && talkNode.gain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(180, ctx.currentTime); // hum grave

    gain.gain.setValueAtTime(0.0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();

    talkNode = { osc, gain, ctx };
  } catch {
    /* nada */
  }
};

/**
 * Detiene el hum holográfico de AURA al terminar de hablar.
 */
export const stopTalk = () => {
  try {
    if (!talkNode || !talkNode.osc || !talkNode.ctx) return;
    const { osc, gain, ctx } = talkNode;
    const now = ctx.currentTime;

    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.2);

    osc.stop(now + 0.25);
    talkNode = null;
  } catch {
    /* nada */
  }
};
