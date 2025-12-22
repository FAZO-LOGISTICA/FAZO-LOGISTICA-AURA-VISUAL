/* ======================================================================
   AURAChat.js — Versión ETAPA 5 FINAL
   Integración total con AURA_NEXUS + EventBridge + MultiModel
   FAZO LOGÍSTICA — Gustavo Oliva
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
  playAlert,
} from "./AuraSounds";

import { AURA_NEXUS } from "../core/AURA_NEXUS";
import { limpiar as limpiarTexto } from "../core/AURA_NaturalLanguage";
import config from "../config";

/* ======================================================================
   COMPONENTE PRINCIPAL
====================================================================== */
export default function AURAChat() {
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

  // ======================================================================
  // BOOT: Sonido inicial
  // ======================================================================
  useEffect(() => {
    try {
      playActivate();
    } catch {}
  }, []);

  // ======================================================================
  // Cambio Online / Offline
  // ======================================================================
  useEffect(() => {
    const on = () => {
      setOnline(true);
      playClick();
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

  // ======================================================================
  // Analizador de audio (avatar mic reactivo)
  // ======================================================================
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

  // ======================================================================
  // Agregar mensaje al chat
  // ======================================================================
  const agregar = (from, text) =>
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), from, text },
    ]);

  // ======================================================================
  // TTS — Voz AURA
  // ======================================================================
  const speak = (txt) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(txt);
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

  // ======================================================================
  // Speech Recognition
  // ======================================================================
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = "es-CL";
    rec.interimResults = false;

    rec.onresult = (e) => {
      sendMessage(e.results[0][0].transcript.trim());
    };
    rec.onerror = () => playError();
    rec.onend = () => setListening(false);

    recRef.current = rec;
  }, []);

  // ======================================================================
  // MOTOR PRINCIPAL — Ahora usa AURA_NEXUS
  // ======================================================================
  const sendMessage = async (txt) => {
    const cleaned = limpiarTexto(txt || input);
    if (!cleaned) return;

    agregar("user", cleaned);
    setInput("");
    setThinking(true);

    setEmotion(detectarEmocion(cleaned));

    const historial = messages.map((m) => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text,
    }));

    // ----------------------------------------------------------------------
    // 🔥 PASO CLAVE: aquí entra NEXUS (cerebro central)
    // ----------------------------------------------------------------------
    const result = await AURA_NEXUS(cleaned, historial, online);

    // ----------------------------------------------------------------------
    // Render de la respuesta
    // ----------------------------------------------------------------------
    let respuesta = result.respuesta;
    if (result.tipo === "ia") {
      respuesta = `🧠 (${result.proveedor.toUpperCase()}) → ${respuesta}`;
    }

    agregar("aura", respuesta);
    speak(respuesta);

    playClick();
    setThinking(false);
  };

  // ======================================================================
  // UI
  // ======================================================================
  return (
    <section className="bg-black/40 border border-cyan-500/40 rounded-2xl backdrop-blur-xl p-4">
      <div className="flex justify-between items-center border-b border-cyan-400/30 pb-2">
        <span className="text-cyan-300 text-sm">
          {online ? "AURA Online — NEXUS IA" : "AURA Offline"}
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
