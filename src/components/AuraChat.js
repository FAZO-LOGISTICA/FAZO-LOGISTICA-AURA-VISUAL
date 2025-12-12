/* eslint-disable react-hooks/exhaustive-deps */

/* =======================================================
   AURAChat.js — GOD MODE ULTRA 2025
   FAZO LOGÍSTICA — Gustavo Oliva
   Mateo IA — Motor completo: Voz + IA + Offline + HoloSphere
   Versión: 5.1 — Ultra Consolidada
======================================================= */

import React, { useState, useEffect, useRef } from "react";
import AuraRealistic from "./AuraRealistic";
import FloatingMic from "./FloatingMic";
import { detectarEmocion } from "./emotionUtils";

import {
  playActivate,
  playCommand,
  playListen,
  startTalk,
  stopTalk,
  playClick,
  playError,
  playSuccess,
  playAlert,
} from "./AuraSounds";

import config from "../config";

/* =======================================================
   UTIL — Limpia emojis y exceso de espacios
======================================================= */
const limpiar = (t) =>
  t
    ?.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g, "")
    .replace(/\s+/g, " ")
    .trim() || "";

/* =======================================================
   BACKEND PRINCIPAL
======================================================= */
const AURA_API = config.AURA_BACKEND_URL;
const MODEL = config.AURA_PRIMARY;

/* =======================================================
   SUBRUTAS AGUARUTA
======================================================= */
const SUBS = [
  ["rutas activas", "rutas-activas", "Abriendo Rutas Activas."],
  ["no entregadas", "no-entregadas", "Mostrando No Entregadas."],
  ["comparacion semanal", "comparacion-semanal", "Cargando Comparación Semanal."],
  ["estadisticas", "camion-estadisticas", "Mostrando Estadísticas por Camión."],
  ["registrar entrega", "registrar-entrega", "Abriendo Registro de Entrega."],
  ["nueva distribucion", "nueva-distribucion", "Entrando a Nueva Distribución."],
  ["editar redistribucion", "editar-redistribucion", "Herramienta de Redistribución abierta."],
];

const detectarSubruta = (txt) => {
  if (!txt) return null;

  const n = limpiar(txt).toLowerCase();
  for (let [palabra, ruta, frase] of SUBS) {
    if (n.includes(palabra)) return { tipo: "subruta", ruta: "/" + ruta, frase };
  }
  return null;
};

/* =======================================================
   MÓDULOS PRINCIPALES FAZO
======================================================= */
const detectarModulo = (txt) => {
  const t = txt.toLowerCase();

  if (t.includes("agua"))
    return { tipo: "modulo", modulo: "aguaruta", frase: "Abriendo AguaRuta." };
  if (t.includes("traslado"))
    return { tipo: "modulo", modulo: "traslado", frase: "Cargando Traslado Municipal." };
  if (t.includes("flota"))
    return { tipo: "modulo", modulo: "flota", frase: "Mostrando Flota Municipal." };
  if (t.includes("reporte"))
    return { tipo: "modulo", modulo: "reportes", frase: "Generando Reportes." };
  if (t.includes("ajuste"))
    return { tipo: "modulo", modulo: "ajustes", frase: "Abriendo Ajustes." };
  if (t.includes("inicio") || t.includes("aura"))
    return { tipo: "modulo", modulo: "aura", frase: "Volviendo a inicio." };

  return null;
};

/* =======================================================
   ACCIONES DIRECTAS
======================================================= */
const detectarAccion = (txt) => {
  const t = txt.toLowerCase();

  if (t.includes("abrir rutas")) return { tipo: "accion", accion: "abrir-rutas" };
  if (t.includes("abrir mapa")) return { tipo: "accion", accion: "abrir-mapa" };
  if (t.includes("abrir traslado")) return { tipo: "accion", accion: "abrir-traslado" };

  if (t.includes("logout") || t.includes("cerrar sesion"))
    return { tipo: "accion", accion: "logout" };

  return null;
};

/* =======================================================
   COMPONENTE PRINCIPAL
======================================================= */
export default function AURAChat({ onComando, onSendToIframe }) {
  const [messages, setMessages] = useState([
    { id: 1, from: "aura", text: `Hola Gustavo 👋, soy AURA (${config.BRAND.version}). Lista para ayudarte.` },
  ]);

  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [emotion, setEmotion] = useState("neutral");
  const [talking, setTalking] = useState(false);
  const [listening, setListening] = useState(false);
  const [micVolume, setMicVolume] = useState(0);

  const [voices, setVoices] = useState([]);
  const [voice, setVoice] = useState(null);

  const [online, setOnline] = useState(navigator.onLine);

  const recRef = useRef(null);
  const endRef = useRef(null);

  /* =======================================================
       DETECCIÓN OFFLINE GLOBAL
  ======================================================= */
  useEffect(() => {
    const goOnline = () => {
      setOnline(true);
      playSuccess();
      setEmotion("happy");
      agregar("aura", "Conexión restablecida ✔️");
    };

    const goOffline = () => {
      setOnline(false);
      playAlert();
      setEmotion("sad");
      agregar("aura", "Sin internet… sigo operativa en modo local.");
    };

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  /* =======================================================
        MIC VOLUME ANALYZER (ONDAS REACTIVAS)
  ======================================================= */
  useEffect(() => {
    let stream, audioCtx, analyser, dataArray;

    const init = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        const src = audioCtx.createMediaStreamSource(stream);

        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        src.connect(analyser);

        const loop = () => {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / (255 * dataArray.length);
          setMicVolume(avg);
          requestAnimationFrame(loop);
        };
        loop();
      } catch (err) {
        setMicVolume(0);
      }
    };

    init();
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, []);

  /* =======================================================
        AGREGA MENSAJES
  ======================================================= */
  const agregar = (from, text) =>
    setMessages((m) => [...m, { id: Date.now() + Math.random(), from, text }]);

  /* =======================================================
        TTS (VOZ NATIVA)
  ======================================================= */
  const speak = (text) => {
    if (!window.speechSynthesis) return;

    const clean = limpiar(text);
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(clean);
    if (voice) u.voice = voice;
    u.rate = 0.96;
    u.pitch = 1.03;

    u.onstart = () => {
      startTalk();
      setTalking(true);
      setEmotion("hablando");
    };

    u.onend = () => {
      stopTalk();
      setTalking(false);
      setEmotion("neutral");
    };

    window.speechSynthesis.speak(u);
  };

  /* =======================================================
        SPEECH RECOGNITION
  ======================================================= */
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = "es-CL";
    rec.interimResults = false;

    rec.onresult = (e) => {
      const t = e.results[0][0].transcript.trim();
      sendMessage(t);
    };

    rec.onerror = () => playError();
    rec.onend = () => setListening(false);

    recRef.current = rec;
  }, []);

  /* =======================================================
        CARGA VOCES TTS
  ======================================================= */
  useEffect(() => {
    if (!window.speechSynthesis) return;

    const load = () => {
      const list = window.speechSynthesis.getVoices();
      setVoices(list);

      const saved = localStorage.getItem("auraVoice");
      const preferida =
        list.find((v) => v.name === saved) ||
        list.find((v) => v.lang.startsWith("es") && v.name.includes("female")) ||
        list.find((v) => v.lang.startsWith("es")) ||
        list[0];

      setVoice(preferida);
    };

    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, []);

  /* =======================================================
        CONSULTAR BACKEND
  ======================================================= */
  const consultarBackend = async (hist) => {
    if (!online) return null;
    if (!AURA_API) return null;

    try {
      const res = await fetch(AURA_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: MODEL,
          messages: hist.map((m) => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      if (!res.ok) return null;

      const data = await res.json();
      return data.reply || null;
    } catch {
      return null;
    }
  };

  /* =======================================================
        FALLBACK LOCAL OFFLINE
  ======================================================= */
  const fallback = (t) => {
    t = t.toLowerCase();

    if (t.includes("agua")) return "Sin internet, pero ya sé que necesitas AguaRuta.";
    if (t.includes("hola")) return "Aquí sigo Gustavo, aunque estemos sin conexión.";
    if (t.includes("estado")) return "Estoy 100% operativa en modo local.";

    return "Modo offline activo. Funciones limitadas, pero sigo operativa.";
  };

  /* =======================================================
        ENVÍO PRINCIPAL
  ======================================================= */
  const sendMessage = async (texto) => {
    const cleaned = limpiar(texto || input);
    if (!cleaned) return;

    if (talking) {
      window.speechSynthesis.cancel();
      stopTalk();
      setTalking(false);
    }

    agregar("user", cleaned);
    setInput("");
    setThinking(true);

    setEmotion(detectarEmocion(cleaned));

    // 🔹 ACCIÓN DIRECTA
    const acc = detectarAccion(cleaned);
    if (acc) {
      playCommand();
      speak("Ejecutando instrucción.");
      agregar("aura", "Ejecutando instrucción…");
      onComando?.(acc);
      setThinking(false);
      return;
    }

    // 🔹 SUBRUTA AGUARUTA
    const sub = detectarSubruta(cleaned);
    if (sub) {
      playCommand();
      speak(sub.frase);
      agregar("aura", sub.frase);
      onComando?.(sub);
      onSendToIframe?.("aguaruta", {
        type: "FAZO_CMD",
        command: "open-tab",
        tab: sub.ruta.replace("/", ""),
      });
      setThinking(false);
      return;
    }

    // 🔹 MÓDULO PRINCIPAL
    const mod = detectarModulo(cleaned);
    if (mod) {
      playCommand();
      speak(mod.frase);
      agregar("aura", mod.frase);
      onComando?.(mod);
      setThinking(false);
      return;
    }

    /* -------------------------------------------
          CONSULTA BACKEND (ONLINE)
    -------------------------------------------- */
    const hist = [...messages, { from: "user", text: cleaned }];
    let reply = await consultarBackend(hist);

    if (!reply) {
      playAlert();
      reply = fallback(cleaned);
    }

    agregar("aura", reply);
    speak(reply);
    playClick();

    setEmotion(detectarEmocion(limpiar(reply)));
    setThinking(false);
  };

  /* =======================================================
        RENDER
  ======================================================= */
  const cont =
    "bg-black/40 border border-cyan-500/40 rounded-2xl backdrop-blur-xl p-4 shadow-[0_0_25px_rgba(0,255,255,0.25)]";

  return (
    <section className={cont}>
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-cyan-400/30 pb-2">
        <span className="text-cyan-300 text-sm flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              online ? "bg-green-400 animate-pulse" : "bg-red-400"
            }`}
          />
          {online ? "AURA Operativa — Online" : "AURA Modo Offline"}
        </span>

        {voices.length > 0 && (
          <select
            className="bg-black/60 border border-cyan-400/30 rounded px-2 py-1 text-xs text-cyan-200"
            value={voice?.name || ""}
            onChange={(e) => {
              const v = voices.find((x) => x.name === e.target.value);
              setVoice(v);
              localStorage.setItem("auraVoice", v.name);
              playClick();
            }}
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name} className="text-black">
                {v.name} — {v.lang}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* BODY */}
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        
        {/* AVATAR */}
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="w-44 h-44 rounded-3xl bg-black/50 border border-cyan-300/30 
                          shadow-[0_0_20px_rgba(0,255,255,0.3)] flex items-center 
                          justify-center overflow-hidden">
            <AuraRealistic
              emotion={emotion}
              talking={talking}
              listening={listening}
              offline={!online}
              micVolume={micVolume}
            />
          </div>

          <p className="text-xs mt-3 text-cyan-200/70">
            Estado emocional:{" "}
            <span className="text-cyan-300 font-medium">{emotion}</span>
          </p>

          {!online && (
            <p className="text-xs text-red-300 mt-1 animate-pulse">
              ⚠ Sin conexión — funciones limitadas
            </p>
          )}
        </div>

        {/* CHAT */}
        <div className="md:w-2/3 flex flex-col">
          <div className="bg-black/30 border border-cyan-400/30 rounded-xl p-4 
                          max-h-[420px] overflow-y-auto custom-scroll shadow-inner">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`my-1 flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 text-sm rounded-xl border max-w-[80%] whitespace-pre-wrap
                    ${
                      m.from === "user"
                        ? "bg-cyan-800 text-white border-cyan-500/30"
                        : "bg-cyan-600/20 text-cyan-100 border-cyan-300/30"
                    }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {thinking && (
              <p className="text-cyan-300/70 text-xs animate-pulse">
                AURA está pensando…
              </p>
            )}

            <div ref={endRef} />
          </div>

          {/* INPUT */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2 mt-3 items-end"
          >
            <textarea
              rows={2}
              className="flex-1 bg-black/40 border border-cyan-300/30 
                         rounded-xl text-sm p-3 text-cyan-100 outline-none 
                         focus:border-cyan-400 shadow-[0_0_12px_rgba(0,255,255,0.15)]"
              placeholder={
                online
                  ? "Escríbeme lo que necesites, Gustavo…"
                  : "Sin conexión… ¿qué necesitas?"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            {/* MIC + ENVIAR */}
            <div className="flex flex-col items-center gap-2">
              <FloatingMic
                isListening={listening}
                disabled={!recRef.current}
                onToggle={() => {
                  if (!recRef.current) return;

                  if (listening) {
                    recRef.current.stop();
                    setListening(false);
                  } else {
                    playListen();
                    recRef.current.start();
                    setListening(true);
                  }
                }}
              />

              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 text-white rounded-xl 
                           hover:bg-cyan-700 border border-cyan-300/40 
                           shadow-[0_0_14px_rgba(0,255,255,0.35)]"
              >
                ➤
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
