/* eslint-disable react-hooks/exhaustive-deps */

/* =======================================================
   AURAChat.js — GOD MODE ULTRA PRO 2025
   FAZO LOGÍSTICA — Gustavo Oliva
   Mateo IA — Motor: Voz + IA + Emociones + Autonomía
   Integrado con: AURA_Intelligence + Agent + Actions
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

// =======================================================
// IMPORTAMOS EL CEREBRO
// =======================================================
import interpretarMensaje from "../aura/AURA_NaturalLanguage";
import AURA_Agent from "../aura/AURA_Agent";

// =======================================================
// IMPORTAMOS LAS ACCIONES (FAZO OS)
// =======================================================
import {
  ejecutarModulo,
  ejecutarSubruta,
  ejecutarAccion,
  ejecutarAccionGeneral,
} from "../aura/AURA_Actions";

/* =======================================================
   UTIL — LIMPIEZA
======================================================= */
const limpiar = (t) =>
  t
    ?.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g,
      ""
    )
    .replace(/\s+/g, " ")
    .trim() || "";

/* =======================================================
   BACKEND
======================================================= */
const AURA_API = config.AURA_BACKEND_URL;
const MODEL = config.AURA_PRIMARY;

/* =======================================================
   COMPONENTE PRINCIPAL
======================================================= */
export default function AURAChat({ onComando, onSendToIframe }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "aura",
      text: `Hola Gustavo 👋, soy AURA (${config.BRAND.version}). Lista para ayudarte.`,
    },
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

  /* =======================================================
     BOOT — SONIDO DE INICIO
  ======================================================== */
  useEffect(() => {
    try {
      playActivate();
    } catch {}
  }, []);

  /* =======================================================
     DETECCIÓN ONLINE / OFFLINE
  ======================================================== */
  useEffect(() => {
    const on = () => {
      setOnline(true);
      playSuccess();
      agregar("aura", "Conexión restablecida ✔️");
      setEmotion("happy");
    };

    const off = () => {
      setOnline(false);
      playAlert();
      agregar("aura", "Sin conexión… sigo operativa en modo local.");
      setEmotion("sad");
    };

    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  /* =======================================================
     MIC ANALYZER — animación holográfica
  ======================================================== */
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
          const avg =
            dataArray.reduce((a, b) => a + b, 0) / (255 * dataArray.length);
          setMicVolume(avg);
          requestAnimationFrame(loop);
        };
        loop();
      } catch {
        setMicVolume(0);
      }
    };

    init();
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, []);

  /* =======================================================
     AGREGAR MENSAJE
  ======================================================== */
  const agregar = (from, text) =>
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), from, text },
    ]);

  /* =======================================================
     TTS — VOZ REAL
  ======================================================== */
  const speak = (txt) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const voiceText = limpiar(txt);

    const u = new SpeechSynthesisUtterance(voiceText);
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
  ======================================================== */
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
     CARGA DE VOCES
  ======================================================== */
  useEffect(() => {
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);

      const prefer =
        v.find((x) => x.name === localStorage.getItem("auraVoice")) ||
        v.find((x) => x.lang.startsWith("es") && x.name.includes("female")) ||
        v.find((x) => x.lang.startsWith("es")) ||
        v[0];

      setVoice(prefer);
    };

    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, []);

  /* =======================================================
     CONSULTAR BACKEND
  ======================================================== */
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
     FALLBACK OFFLINE
  ======================================================== */
  const fallback = (t) => {
    t = t.toLowerCase();

    if (t.includes("agua"))
      return "Sin internet, pero ya sé que necesitas AguaRuta.";
    if (t.includes("hola"))
      return "Aquí sigo Gustavo, aunque estemos sin conexión.";
    if (t.includes("estado")) return "Estoy 100% operativa en modo local.";

    return "Modo offline activo. Funciones limitadas, pero sigo operativa.";
  };

  /* =======================================================
     ENVÍO PRINCIPAL — AQUI SE USA EL AGENTE
  ======================================================== */
  const sendMessage = async (txt) => {
    const cleaned = limpiar(txt || input);
    if (!cleaned) return;

    agregar("user", cleaned);
    setInput("");
    setThinking(true);

    setEmotion(detectarEmocion(cleaned));

    // ======================================================
    // 1) Interpretar mensaje → INTELIGENCIA
    // ======================================================
    const analisis = interpretarMensaje(cleaned);

    // ======================================================
    // 2) AURA_Agent decide qué hacer
    // ======================================================
    const decision = AURA_Agent(analisis);

    // ======================================================
    // 3) Ejecutar acciones, módulos o subrutas
    // ======================================================
    if (decision.tipo === "modulo") {
      playCommand();
      const frase = ejecutarModulo(decision.modulo, onComando);
      agregar("aura", frase);
      speak(frase);
      setThinking(false);
      return;
    }

    if (decision.tipo === "subruta") {
      playCommand();
      const frase = ejecutarSubruta(decision.ruta, onComando);
      agregar("aura", frase);
      speak(frase);
      setThinking(false);
      return;
    }

    if (decision.tipo === "accion") {
      playCommand();
      const frase = ejecutarAccion(decision.accion, onComando);
      agregar("aura", frase);
      speak(frase);
      setThinking(false);
      return;
    }

    if (decision.tipo === "accion-general") {
      playCommand();
      const frase = ejecutarAccionGeneral(decision.payload, onComando);
      agregar("aura", frase);
      speak(frase);
      setThinking(false);
      return;
    }

    // ======================================================
    // 4) Si llega aquí → BACKEND (GPT)
    // ======================================================
    const hist = [...messages, { from: "user", text: cleaned }];
    let reply = await consultarBackend(hist);

    if (!reply) {
      playAlert();
      reply = fallback(cleaned);
    }

    agregar("aura", reply);
    speak(reply);
    playClick();

    setEmotion(detectarEmocion(reply));
    setThinking(false);
  };

  /* =======================================================
     UI RENDER
  ======================================================== */

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
          <div
            className="w-44 h-44 rounded-3xl bg-black/50 border border-cyan-300/30 
                          shadow-[0_0_20px_rgba(0,255,255,0.3)] flex items-center 
                          justify-center overflow-hidden"
          >
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
          <div
            className="bg-black/30 border border-cyan-400/30 rounded-xl p-4 
                          max-h-[420px] overflow-y-auto custom-scroll shadow-inner"
          >
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

            {/* MIC + SEND */}
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
