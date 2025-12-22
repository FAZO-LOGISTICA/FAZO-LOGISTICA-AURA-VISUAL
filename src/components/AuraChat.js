/* ============================================================
   AURAChat.js — GOD MODE ULTRA PRO 2025 (Versión sin emociones)
   FAZO LOGÍSTICA — Núcleo oficial de interacción con AURA OS
===============================================================*/

import React, { useState, useEffect, useRef } from "react";

import FloatingMic from "./FloatingMic";
import config from "../config";

import { AURA_NEXUS } from "../core/AURA_NEXUS";
import { guardarEnMemoria, obtenerRecuerdos } from "../core/AURAMemory";

/* ============================================================
   LIMPIEZA
===============================================================*/
const limpiar = (t) =>
  t
    ?.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g, "")
    .replace(/\s+/g, " ")
    .trim() || "";

/* ============================================================
   AURAChat
===============================================================*/
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
  const [listening, setListening] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);

  const recRef = useRef(null);

  /* ============================================================
     BOOT
  ============================================================*/
  useEffect(() => {
    // carga recuerdos silenciosos
    const ultimos = obtenerRecuerdos();
    if (ultimos.length > 0) {
      console.log("🧠 Recuerdos cargados:", ultimos);
    }
  }, []);

  /* ============================================================
     INTERNET — ONLINE/OFFLINE
  ============================================================*/
  useEffect(() => {
    const on = () => {
      setOnline(true);
      agregar("aura", "Conexión restablecida ✔️");
    };
    const off = () => {
      setOnline(false);
      agregar("aura", "Sin conexión. Activando modo local.");
    };
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  /* ============================================================
     AGREGAR MENSAJE
  ============================================================*/
  const agregar = (from, text) =>
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), from, text },
    ]);

  /* ============================================================
     TTS — Voz de AURA
  ============================================================*/
  const speak = (txt) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(limpiar(txt));
    u.rate = 0.96;
    u.pitch = 1.02;

    window.speechSynthesis.speak(u);
  };

  /* ============================================================
     STT — Reconocimiento de voz
  ============================================================*/
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = "es-CL";
    rec.interimResults = false;

    rec.onresult = (e) => {
      sendMessage(e.results[0][0].transcript.trim());
    };
    rec.onerror = () => console.log("🎤 Error STT");
    rec.onend = () => setListening(false);

    recRef.current = rec;
  }, []);

  /* ============================================================
     MOTOR CENTRAL — AURA NEXUS
  ============================================================*/
  const sendMessage = async (txt) => {
    const cleaned = limpiar(txt || input);
    if (!cleaned) return;

    agregar("user", cleaned);
    guardarEnMemoria(cleaned); // memoria silenciosa
    setInput("");
    setThinking(true);

    // historial formateado
    const historial = messages.map((m) => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text,
    }));

    const resultado = await AURA_NEXUS(cleaned, historial, online);

    // =============== PROCESO ===============
    if (resultado.tipo === "accion") {
      agregar("aura", resultado.respuesta);
      speak(resultado.respuesta);
      onComando?.(resultado.intent || {});
      setThinking(false);
      return;
    }

    if (resultado.tipo === "subruta") {
      agregar("aura", resultado.respuesta);
      speak(resultado.respuesta);

      onSendToIframe?.("aguaruta", {
        type: "FAZO_CMD",
        command: "open-tab",
        tab: resultado.ruta,
      });

      setThinking(false);
      return;
    }

    if (resultado.tipo === "modulo") {
      agregar("aura", resultado.respuesta);
      speak(resultado.respuesta);
      onComando?.({ tipo: "modulo", modulo: resultado.modulo });
      setThinking(false);
      return;
    }

    if (resultado.tipo === "analisis") {
      agregar("aura", resultado.respuesta);
      speak("Análisis realizado.");
      setThinking(false);
      return;
    }

    if (resultado.tipo === "ia") {
      agregar("aura", `🧠 (${resultado.proveedor}) → ${resultado.respuesta}`);
      speak(resultado.respuesta);
      setThinking(false);
      return;
    }

    if (resultado.tipo === "offline") {
      agregar("aura", resultado.respuesta);
      speak(resultado.respuesta);
      setThinking(false);
      return;
    }
  };

  /* ============================================================
     UI
  ============================================================*/
  return (
    <section className="bg-black/40 border border-cyan-500/40 rounded-2xl backdrop-blur-xl p-4">
      <div className="flex justify-between items-center border-b border-cyan-400/30 pb-2">
        <span className="text-cyan-300 text-sm">
          {online ? "AURA Online — IA Multimodel" : "AURA Offline"}
        </span>
      </div>

      {/* CHAT */}
      <div className="mt-4 bg-black/30 border border-cyan-400/30 rounded-xl p-4 max-h-[420px] overflow-y-auto custom-scroll">
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
          {/* MIC */}
          <FloatingMic
            isListening={listening}
            onToggle={() => {
              if (!recRef.current) return;

              if (listening) {
                recRef.current.stop();
                setListening(false);
              } else {
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
    </section>
  );
}
