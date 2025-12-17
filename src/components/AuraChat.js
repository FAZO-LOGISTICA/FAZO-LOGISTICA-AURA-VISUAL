/* eslint-disable react-hooks/exhaustive-deps */

/* =======================================================
   AURAChat.js — GOD MODE PRO MAX 2025
   Interfaz + Voz + IA + Acciones + Agente Autónomo
   FAZO LOGÍSTICA — Gustavo Oliva
   Mateo IA Framework
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

import interpretarMensaje from "../aura/AURA_NaturalLanguage";
import { AURA_Agent } from "../aura/AURA_Agent";
import { ejecutarAccion } from "../core/AURA_Actions";

import config from "../config";

/* =======================================================
   UTILIDADES
======================================================= */
const limpiar = (t) =>
  t
    ?.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g, "")
    .replace(/\s+/g, " ")
    .trim() || "";

/* =======================================================
   BACKEND
======================================================= */
const AURA_API = config.AURA_BACKEND_URL;
const MODEL = config.AURA_PRIMARY;

/* =======================================================
   COMPONENTE PRINCIPAL AURA CHAT
======================================================= */
export default function AURAChat({ onComando, onSendToIframe }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "aura",
      text: `Hola Gustavo 👋, soy AURA ${config.BRAND.version}. Lista para ayudarte.`,
    },
  ]);

  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [emotion, setEmotion] = useState("neutral");
  const [talking, setTalking] = useState(false);
  const [listening, setListening] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [online, setOnline] = useState(navigator.onLine);

  const [voices, setVoices] = useState([]);
  const [voice, setVoice] = useState(null);

  const recRef = useRef(null);

  /* =======================================================
     1. PLAY DE ACTIVACIÓN
  ======================================================== */
  useEffect(() => {
    playActivate();
  }, []);

  /* =======================================================
     2. ESTADO ONLINE / OFFLINE
  ======================================================== */
  useEffect(() => {
    const on = () => {
      setOnline(true);
      playSuccess();
      agregar("aura", "Conexión restablecida ✔️");
    };
    const off = () => {
      setOnline(false);
      playAlert();
      agregar("aura", "Sin conexión. Modo local activado.");
    };

    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  /* =======================================================
     3. ANALIZAR MIC (para animación)
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
    setMessages((prev) => [...prev, { id: Date.now(), from, text }]);

  /* =======================================================
     TTS — HABLA AURA
  ======================================================== */
  const speak = (txt) => {
    if (!window.speechSynthesis) return;

    const clean = limpiar(txt);
    const u = new SpeechSynthesisUtterance(clean);
    if (voice) u.voice = voice;

    u.rate = 0.94;
    u.pitch = 1.04;

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
     RECONOCIMIENTO DE VOZ
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
     BACKEND IA
  ======================================================== */
  const consultarBackend = async (hist) => {
    if (!online) return null;

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
     ENVÍO DE MENSAJE PRINCIPAL
  ======================================================== */
  const sendMessage = async (txt) => {
    const cleaned = limpiar(txt || input);
    if (!cleaned) return;

    agregar("user", cleaned);
    setInput("");
    setThinking(true);

    setEmotion(detectarEmocion(cleaned));

    /* ======================================================
       1) INTENCIÓN DE LENGUAJE NATURAL (AURA_NaturalLanguage)
    ====================================================== */
    const intento = interpretarMensaje(cleaned);

    if (intento.tipo === "modulo" || intento.tipo === "subruta") {
      playCommand();
      speak(intento.frase);
      agregar("aura", intento.frase);
      onComando?.(intento);
      setThinking(false);
      return;
    }

    if (intento.tipo === "accion") {
      playCommand();
      speak("Ejecutando acción.");
      ejecutarAccion(intento.accion, intento.parametros);
      agregar("aura", "Acción ejecutada.");
      setThinking(false);
      return;
    }

    /* ======================================================
       2) BACKEND IA (respuesta general)
    ====================================================== */
    const hist = [...messages, { from: "user", text: cleaned }];
    let reply = await consultarBackend(hist);

    if (!reply) {
      reply = "Estoy en modo offline, pero sigo operativa.";
      playAlert();
    }

    agregar("aura", reply);
    speak(reply);

    /* ======================================================
       3) AGENTE AUTÓNOMO — ANALIZAR + ACTUAR
    ====================================================== */
    const estado = AURA_Agent.obtenerEstado();
    if (estado.problemas.length > 0) {
      const sug = AURA_Agent.generarSugerencias();
      agregar("aura", sug.join("\n"));
    }

    AURA_Agent.actuarSiEsNecesario();

    playClick();
    setThinking(false);
  };

  /* =======================================================
     RENDER UI
  ======================================================== */
  return (
    <section className="bg-black/40 border border-cyan-500/40 rounded-2xl backdrop-blur-xl p-4 shadow-[0_0_25px_rgba(0,255,255,0.25)]">

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
          <div className="w-44 h-44 rounded-3xl bg-black/50 border border-cyan-300/30 shadow-[0_0_20px_rgba(0,255,255,0.3)] flex items-center justify-center overflow-hidden">
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
        </div>

        {/* CHAT */}
        <div className="md:w-2/3 flex flex-col">
          <div className="bg-black/30 border border-cyan-400/30 rounded-xl p-4 max-h-[420px] overflow-y-auto custom-scroll shadow-inner">
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
                online ? "Dime qué necesitas, Gustavo…" : "Sin conexión…"
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
