/* ======================================================================
   AURAChat.js — PASO 18
   Versión limpia: sin lógica interna, sin intents, sin IA.
   Solo UI del chat y envío hacia AURA_CyberPanel → NEXUS.
====================================================================== */

import React, { useState, useEffect, useRef } from "react";
import AuraRealistic from "./AuraRealistic";
import FloatingMic from "./FloatingMic";

import {
  playActivate,
  playListen,
  startTalk,
  stopTalk,
  playClick,
} from "./AuraSounds";

/* ======================================================================
   LIMPIEZA DE TEXTO
====================================================================== */
const limpiar = (t) =>
  t
    ?.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF\uDC00-\uDFFF])/g, "")
    .trim() || "";

/* ======================================================================
   COMPONENTE AURACHAT (100% UI)
====================================================================== */
export default function AURAChat({ onMensaje }) {
  const [messages, setMessages] = useState([
    { id: 1, from: "aura", text: "Hola Gustavo 👋, ¿en qué te ayudo hoy?" },
  ]);

  const [input, setInput] = useState("");
  const [talking, setTalking] = useState(false);
  const [listening, setListening] = useState(false);
  const [micVolume, setMicVolume] = useState(0);

  const recRef = useRef(null);

  /* ======================================================================
     BOOT
  ======================================================================= */
  useEffect(() => {
    try {
      playActivate();
    } catch {}
  }, []);

  /* ======================================================================
     ANALIZAR AUDIO (avatar)
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
     SPEECH RECOGNITION
  ======================================================================= */
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = "es-CL";

    rec.onresult = (e) => {
      const text = e.results[0][0].transcript.trim();
      enviar(text);
    };

    recRef.current = rec;
  }, []);

  /* ======================================================================
     ENVIAR MENSAJE (UI → CyberPanel → NEXUS)
  ======================================================================= */
  const enviar = (text) => {
    const cleaned = limpiar(text || input);
    if (!cleaned) return;

    setMessages((p) => [...p, { id: Date.now(), from: "user", text: cleaned }]);
    setInput("");

    playClick();

    // 🔥 IMPORTANTE:
    //   AURAChat ya NO interpreta nada.
    //   Se lo entrega directamente a AURA_CyberPanel → NEXUS.
    onMensaje?.(cleaned);
  };

  /* ======================================================================
     RECIBIR RESPUESTA EXTERNA (desde CyberPanel → NEXUS)
  ======================================================================= */
  useEffect(() => {
    window.addEventListener("AURA_RESPUESTA", (e) => {
      const text = e.detail;
      setMessages((p) => [...p, { id: Date.now(), from: "aura", text }]);
    });
  }, []);

  /* ======================================================================
     TTS (solo cuando CyberPanel lo decida)
  ======================================================================= */
  const hablar = (txt) => {
    try {
      const u = new SpeechSynthesisUtterance(limpiar(txt));
      u.onstart = () => {
        setTalking(true);
        startTalk();
      };
      u.onend = () => {
        setTalking(false);
        stopTalk();
      };
      speechSynthesis.speak(u);
    } catch {}
  };

  /* ======================================================================
     UI
  ======================================================================= */
  return (
    <div className="flex flex-col gap-4">
      {/* AVATAR */}
      <div className="flex justify-center">
        <AuraRealistic talking={talking} listening={listening} micVolume={micVolume} />
      </div>

      {/* MENSAJES */}
      <div className="h-[300px] overflow-y-auto bg-black/20 p-4 rounded-xl border border-cyan-400/30">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`my-1 ${m.from === "user" ? "text-right" : "text-left"}`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-xl ${
                m.from === "user"
                  ? "bg-cyan-700 text-white"
                  : "bg-cyan-500/20 text-cyan-200"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="flex gap-2">
        <textarea
          rows={2}
          className="flex-1 bg-black/40 text-cyan-200 border border-cyan-400/30 rounded-xl p-3"
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

          <button
            onClick={() => enviar()}
            className="px-4 py-2 rounded-xl bg-cyan-600 text-white"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
