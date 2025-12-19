/* eslint-disable react-hooks/exhaustive-deps */

/* ======================================================================
   AURAChat.js — GOD MODE ULTRA PRO FINAL (2025)
   FAZO LOGÍSTICA — AURA OS v3
   Conexión total con:
      ✔ AURA_NEXUS (cerebro maestro)
      ✔ FAZO_OS_EventBridge
      ✔ MultiModel IA
      ✔ Avatar Realista
      ✔ STT + TTS
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

// >>> NEXUS CORE <<<
import { AURA_NEXUS } from "../core/AURA_NEXUS";

/* ======================================================================
   LIMPIEZA TEXTO
====================================================================== */
const limpiar = (t) =>
  t
    ?.replace(/[^\w\sáéíóúñ]/gi, "")
    .replace(/\s+/g, " ")
    .trim() || "";

/* ======================================================================
   AURAChat — Componente
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
     EFECTO DE ARRANQUE
  ======================================================================= */
  useEffect(() => {
    try {
      playActivate();
    } catch {}
  }, []);

  /* ======================================================================
     CAMBIO DE INTERNET
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
      agregar("aura", "Sin conexión. Activando modo offline.");
    };

    window.addEventListener("online", on);
    window.addEventListener("offline", off);

    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  /* ======================================================================
     AUDIO REACTIVO (micVolume)
  ======================================================================= */
  useEffect(() => {
    let stream, audioCtx, analyser, dataArray;

    const initMic = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);

        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        source.connect(analyser);

        const loop = () => {
          analyser.getByteFrequencyData(dataArray);
          const avg =
            dataArray.reduce((a, b) => a + b, 0) /
            (255 * dataArray.length);
          setMicVolume(avg);
          requestAnimationFrame(loop);
        };
        loop();
      } catch (e) {
        console.warn("Mic error:", e);
      }
    };

    initMic();
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
     TTS — Voz de AURA
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
     STT — Speech Recognition
  ======================================================================= */
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = "es-CL";
    rec.interimResults = false;

    rec.onresult = (e) => {
      const text = e.results[0][0].transcript.trim();
      sendMessage(text);
    };

    rec.onerror = playError;
    rec.onend = () => setListening(false);

    recRef.current = rec;
  }, []);

  /* ======================================================================
     MOTOR PRINCIPAL
     🔥 Aquí se llama a NEXUS (el cerebro)
  ======================================================================= */
  const sendMessage = async (txt) => {
    const cleaned = limpiar(txt || input);
    if (!cleaned) return;

    agregar("user", cleaned);
    setInput("");
    setThinking(true);

    setEmotion(detectarEmocion(cleaned));

    const historial = messages.map((m) => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text,
    }));

    // ============================
    // 🔥 ENVÍA A NEXUS
    // ============================
    const result = await AURA_NEXUS(cleaned, historial, online);

    // ============================
    // 1) Acciones OS (subrutas, módulos, logout, filtros…)
    // ============================
    if (["accion", "modulo", "subruta"].includes(result.tipo)) {
      playCommand();
      agregar("aura", result.respuesta);
      speak(result.respuesta);

      // Notificar al sistema operativo
      onComando?.({
        tipo: result.tipo,
        ...result,
      });

      return setThinking(false);
    }

    // ============================
    // 2) Análisis operativo
    // ============================
    if (result.tipo === "analisis") {
      agregar("aura", result.respuesta);
      speak("Análisis completado.");
      playClick();
      return setThinking(false);
    }

    // ============================
    // 3) IA Multimodel
    // ============================
    if (result.tipo === "ia") {
      const msg = `🤖 (${result.proveedor.toUpperCase()}) → ${result.respuesta}`;
      agregar("aura", msg);
      speak(result.respuesta);
      playClick();
      return setThinking(false);
    }

    // ============================
    // 4) Offline
    // ============================
    agregar("aura", result.respuesta);
    speak(result.respuesta);
    playAlert();
    setThinking(false);
  };

  /* ======================================================================
     UI FINAL
  ======================================================================= */
  return (
    <section className="bg-black/40 border border-cyan-500/40 rounded-2xl backdrop-blur-xl p-4">

      <div className="flex justify-between items-center border-b border-cyan-400/30 pb-2">
        <span className="text-cyan-300 text-sm">
          {online ? "AURA Online — IA Multimodel" : "AURA Offline"}
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
              <div key={m.id} className={`my-1 flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-3 py-2 text-sm rounded-xl border max-w-[80%]
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
