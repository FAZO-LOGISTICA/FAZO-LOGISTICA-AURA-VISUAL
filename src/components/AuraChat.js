/* ======================================================================
   AURAChat.js — GOD MODE FINAL 2025
   AURA OS → Nexus + EventBridge + AutoFix + MultiModel + Memoria
   Versión sin emociones ni avatar reactivo (petición de Gustavo)
====================================================================== */

import React, { useState, useEffect, useRef } from "react";

import FloatingMic from "./FloatingMic";

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

import config from "../config";

// CORE INTELIGENTE
import { AURA_NEXUS } from "../core/AURA_NEXUS";
import { registrarAccion } from "../core/AURAMemory";
import { enviarEventoDesdeAURA } from "../core/FAZO_OS_EventBridge";

/* ============================================================
   LIMPIEZA DE TEXTO
============================================================ */
const limpiar = (t) =>
  t
    ?.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g,
      ""
    )
    .replace(/\s+/g, " ")
    .trim() || "";

/* ============================================================
   COMPONENTE PRINCIPAL
============================================================ */
export default function AURAChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "aura",
      text: `Hola Gustavo 👋, soy AURA OS (${config.BRAND.version}). Lista para ayudarte.`,
    },
  ]);

  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);

  const recRef = useRef(null);

  /* ============================================================
     BOOT
  ============================================================ */
  useEffect(() => {
    try {
      playActivate();
    } catch {}
  }, []);

  /* ============================================================
     DETECTAR INTERNET
  ============================================================ */
  useEffect(() => {
    const on = () => {
      setOnline(true);
      playClick();
      agregar("aura", "Conexión restablecida ✔️");
    };
    const off = () => {
      setOnline(false);
      playAlert();
      agregar("aura", "Sin internet. Modo local activado.");
    };

    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  /* ============================================================
     AGREGAR MENSAJE AL CHAT
  ============================================================ */
  const agregar = (from, text) =>
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), from, text },
    ]);

  /* ============================================================
     TEXT-TO-SPEECH
  ============================================================ */
  const speak = (txt) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(limpiar(txt));

    u.rate = 0.97;
    u.pitch = 1.02;

    u.onstart = () => startTalk();
    u.onend = () => stopTalk();

    window.speechSynthesis.speak(u);
  };

  /* ============================================================
     SPEECH RECOGNITION
  ============================================================ */
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

  const [listening, setListening] = useState(false);

  /* ============================================================
     MOTOR PRINCIPAL — AURA NEXUS
  ============================================================ */
  const sendMessage = async (txt) => {
    const cleaned = limpiar(txt || input);
    if (!cleaned) return;

    agregar("user", cleaned);
    registrarAccion("mensaje_usuario", cleaned);
    setInput("");
    setThinking(true);

    // Historial convertido
    const historial = messages.map((m) => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text,
    }));

    // Llamar al Nexus
    const r = await AURA_NEXUS(cleaned, historial, online);

    // Según tipo de respuesta
    if (r.tipo === "accion" || r.tipo === "modulo" || r.tipo === "subruta") {
      enviarEventoDesdeAURA(r.intent);
    }

    agregar("aura", r.respuesta);
    speak(r.respuesta);
    setThinking(false);
  };

  /* ============================================================
     UI
  ============================================================ */
  return (
    <section className="bg-black/40 border border-cyan-500/40 rounded-2xl backdrop-blur-xl p-4">
      <div className="flex justify-between items-center border-b border-cyan-400/30 pb-2">
        <span className="text-cyan-300 text-sm">
          {online ? "AURA Online — IA Multimodel" : "AURA Offline"}
        </span>
      </div>

      <div className="flex flex-col mt-4">
        {/* CHATBOX */}
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
    </section>
  );
}
