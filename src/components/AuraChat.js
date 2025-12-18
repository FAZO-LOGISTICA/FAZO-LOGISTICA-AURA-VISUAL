/* eslint-disable react-hooks/exhaustive-deps */

/* ======================================================================
   AURAChat.js — GOD MODE ULTRA PRO 2025 + FAZO OS Router Integration
   FAZO LOGÍSTICA — Gustavo Oliva
   Mateo IA — Voz, emociones, autonomía y análisis operativo.
====================================================================== */

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

// 🔥 FAZO OS CORE
import { interpretar } from "../core/AURA_NaturalLanguage";
import { analizarManual, registrarSubsistema } from "../core/FAZO_OS_Router";

/* ======================================================================
   LIMPIEZA
====================================================================== */
const limpiar = (t) =>
  t
    ?.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g,
      ""
    )
    .replace(/\s+/g, " ")
    .trim() || "";

/* ======================================================================
   BACKEND
====================================================================== */
const AURA_API = config.AURA_BACKEND_URL;
const MODEL = config.AURA_PRIMARY;

/* ======================================================================
   COMPONENTE AURA
====================================================================== */
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
  const [online, setOnline] = useState(navigator.onLine);

  const recRef = useRef(null);

  /* ======================================================================
     SONIDO INICIAL
  ======================================================================= */
  useEffect(() => {
    try {
      playActivate();
    } catch {}
  }, []);

  /* ======================================================================
     FAZO OS — SUSCRIPCIÓN A EVENTOS AUTOMÁTICOS
  ======================================================================= */
  useEffect(() => {
    registrarSubsistema((evento) => {
      if (evento.tipo === "AURA_ANALISIS_AUTOMATICO") {
        agregar("aura", "🔍 Revisión automática realizada.");
        agregar("aura", evento.payload.sugerencias.join("\n"));
        speak("Revisión automática lista. Te dejo mis observaciones.");
      }
    });
  }, []);

  /* ======================================================================
     ACTUALIZAR ESTADO ONLINE/OFFLINE
  ======================================================================= */
  useEffect(() => {
    const on = () => {
      setOnline(true);
      playSuccess();
      agregar("aura", "Conexión restablecida ✔️");
    };
    const off = () => {
      setOnline(false);
      playAlert();
      agregar("aura", "Sin internet. Activando modo local.");
    };

    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  /* ======================================================================
     MICROFONO — ANIMACIÓN
  ======================================================================= */
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
            dataArray.reduce((a, b) => a + b, 0) /
            (255 * dataArray.length);
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

  /* ======================================================================
     AGREGAR MENSAJE
  ======================================================================= */
  const agregar = (from, text) =>
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), from, text },
    ]);

  /* ======================================================================
     VOZ — TTS
  ======================================================================= */
  const speak = (txt) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(limpiar(txt));

    u.rate = 0.96;
    u.pitch = 1.05;

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

  /* ======================================================================
     SPEECH RECOGNITION
  ======================================================================= */
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

  /* ======================================================================
     ENVÍO PRINCIPAL
  ======================================================================= */
  const sendMessage = async (txt) => {
    const cleaned = limpiar(txt || input);
    if (!cleaned) return;

    agregar("user", cleaned);
    setInput("");
    setThinking(true);
    setEmotion(detectarEmocion(cleaned));

    // 1) Interpretar INTENCIÓN REAL con NLP
    const intent = interpretar(cleaned);

    // -------------------------------
    // A) ACCIÓN DIRECTA
    // -------------------------------
    if (intent.tipo === "accion") {
      playCommand();
      agregar("aura", intent.frase);
      speak(intent.frase);
      onComando?.(intent);
      setThinking(false);
      return;
    }

    // -------------------------------
    // B) SUBRUTA (OPEN TAB)
    // -------------------------------
    if (intent.tipo === "subruta") {
      playCommand();
      agregar("aura", intent.frase);
      speak(intent.frase);

      onSendToIframe?.("aguaruta", {
        type: "FAZO_CMD",
        command: "open-tab",
        tab: intent.ruta,
      });

      setThinking(false);
      return;
    }

    // -------------------------------
    // C) MÓDULO (CAMBIO COMPLETO)
    // -------------------------------
    if (intent.tipo === "modulo") {
      playCommand();
      agregar("aura", intent.frase);
      speak(intent.frase);
      onComando?.(intent);
      setThinking(false);
      return;
    }

    // -------------------------------
    // D) ANÁLISIS MANUAL
    // -------------------------------
    if (cleaned.includes("revisa") || cleaned.includes("analiza")) {
      playCommand();
      agregar("aura", "Analizando estructura operacional…");

      const analisis = await analizarManual(() => window.__FAZO_DATA__);
      agregar("aura", analisis.sugerencias.join("\n"));
      speak("Análisis completado. Te dejo mis conclusiones.");

      setThinking(false);
      return;
    }

    // -------------------------------
    // E) BACKEND (IA GENERAL)
    // -------------------------------
    let reply = null;

    if (online && AURA_API) {
      try {
        const res = await fetch(AURA_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: MODEL,
            messages: [...messages, { from: "user", text: cleaned }].map(
              (m) => ({
                role: m.from === "user" ? "user" : "assistant",
                content: m.text,
              })
            ),
          }),
        });

        const data = await res.json();
        reply = data.reply;
      } catch {}
    }

    if (!reply) {
      playAlert();
      reply =
        "No tengo acceso a mi cerebro en la nube. Modo offline activo.";
    }

    agregar("aura", reply);
    speak(reply);
    playClick();

    setThinking(false);
  };

  /* ======================================================================
     RENDER UI
  ======================================================================= */
  return (
    <section className="bg-black/40 border border-cyan-500/40 rounded-2xl backdrop-blur-xl p-4">
      <div className="flex justify-between items-center border-b border-cyan-400/30 pb-2">
        <span className="text-cyan-300 text-sm">
          {online ? "AURA Online" : "AURA Offline"}
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-4">
        {/* AVATAR */}
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="w-44 h-44 rounded-3xl bg-black/50 border border-cyan-300/30 flex items-center justify-center">
            <AuraRealistic
              emotion={emotion}
              talking={talking}
              listening={listening}
              micVolume={micVolume}
              offline={!online}
            />
          </div>
        </div>

        {/* CHAT */}
        <div className="md:w-2/3 flex flex-col">
          <div className="bg-black/30 border border-cyan-400/30 rounded-xl p-4 max-h-[420px] overflow-y-auto custom-scroll">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`my-1 flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 text-sm rounded-xl border max-w-[80%] ${
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
            className="flex gap-2 mt-3"
          >
            <textarea
              rows={2}
              className="flex-1 bg-black/40 border border-cyan-300/30 rounded-xl text-sm p-3 text-cyan-100"
              placeholder="Escríbeme lo que necesites…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <div className="flex flex-col items-center gap-2">
              <FloatingMic
                isListening={listening}
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

              <button className="px-4 py-2 bg-cyan-600 text-white rounded-xl">
                ➤
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
