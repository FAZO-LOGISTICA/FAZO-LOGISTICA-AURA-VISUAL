/* eslint-disable react-hooks/exhaustive-deps */

/* ======================================================================
   AURAChat.js — GOD MODE ULTRA PRO 2025 (Versión FINAL)
   FAZO LOGÍSTICA — AURA OS + MultiModel + AutoFix + Nexus
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

// NEXUS INTELIGENCIA CENTRAL
import { AURA_NEXUS } from "../core/AURA_NEXUS";

// AUTOFIX
import { AURA_AutoFix } from "../core/AURA_AutoFix";

// MEMORIA
import { registrarAccion } from "../core/AURAMemory";

// CONFIG
import config from "../config";

/* ======================================================================
   LIMPIEZA DE TEXTO
====================================================================== */
const limpiarTexto = (t) =>
  t
    ?.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g,
      ""
    )
    .replace(/\s+/g, " ")
    .trim() || "";

/* ======================================================================
   COMPONENTE AURA CHAT
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
     ACTIVACIÓN INICIAL
  ======================================================================= */
  useEffect(() => {
    try {
      playActivate();
    } catch {}
  }, []);

  /* ======================================================================
     ESTADO ONLINE / OFFLINE
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
     ANALIZADOR DE AUDIO
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
          const avg = dataArray.reduce((a, b) => a + b, 0) / (255 * dataArray.length);
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
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), from, text }]);

  /* ======================================================================
     TTS — VOZ DE AURA
  ======================================================================= */
  const speak = (txt) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(limpiarTexto(txt));
    u.rate = 0.95;
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
     SPEECH TO TEXT
  ======================================================================= */
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = "es-CL";
    rec.interimResults = false;

    rec.onresult = (e) => sendMessage(e.results[0][0].transcript.trim());
    rec.onerror = () => playError();
    rec.onend = () => setListening(false);

    recRef.current = rec;
  }, []);

  /* ======================================================================
     MOTOR PRINCIPAL DE MENSAJES
  ======================================================================= */
  const sendMessage = async (txt) => {
    const cleaned = limpiarTexto(txt || input);
    if (!cleaned) return;

    agregar("user", cleaned);
    registrarAccion("mensaje", cleaned);

    setInput("");
    setThinking(true);

    setEmotion(detectarEmocion(cleaned));

    // ======= PASAMOS TODO A NEXUS ===============
    const historial = messages.map((m) => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text,
    }));

    const r = await AURA_NEXUS(cleaned, historial, online);

    // ======= RESPUESTA SEGÚN TIPO ===============
    switch (r.tipo) {
      case "accion":
      case "subruta":
      case "modulo":
      case "analisis":
      case "autofix":
      case "ia":
      case "offline":
        agregar("aura", r.respuesta);
        speak(r.respuesta);
        break;

      default:
        agregar("aura", "No entendí la instrucción, pero sigo contigo.");
        speak("No entendí, intenta decirlo de otra forma.");
    }

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
          {online ? "AURA Online — IA Multimodel + AutoFix" : "AURA Offline"}
        </span>

        {/* BOTÓN AUTOFIX */}
        <button
          onClick={async () => {
            playCommand();
            const res = await AURA_AutoFix.autoFixAguaRuta();
            agregar(
              "aura",
              res?.fixes?.length
                ? "AutoFix completado:\n- " + res.fixes.join("\n- ")
                : "No encontré fallas que reparar."
            );
            speak("Revisión y correcciones aplicadas.");
          }}
          className="text-emerald-300 hover:text-emerald-100 px-3"
        >
          🛠️ AutoFix
        </button>
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
                className={`my-1 flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
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
              <p className="text-cyan-300/70 text-xs animate-pulse">AURA está pensando…</p>
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

              <button className="px-4 py-2 bg-cyan-600 text-white rounded-xl">➤</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
