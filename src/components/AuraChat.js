/* ======================================================================
   AURAChat.js — FAZO OS 2025 (Versión Profesional)
   Integración: NEXUS + EventBridge + MultiModel + Agent Autónomo
====================================================================== */

import React, { useState, useEffect, useRef } from "react";

import FloatingMic from "./FloatingMic";
import { limpiarTextoPlano } from "../utils/limpieza";

import {
  playActivate,
  playListen,
  playClick,
  playError,
  playAlert,
} from "./AuraSounds";

import { interpretar } from "../core/AURA_NaturalLanguage";
import { AURA_NEXUS } from "../core/AURA_NEXUS";
import { registrarSubsistema } from "../core/FAZO_OS_EventBridge";

export default function AURAChat({ onComando }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "aura",
      text: "Hola Gustavo, sistema operativo FAZO OS listo.",
    },
  ]);

  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const recRef = useRef(null);

  // ----------------------------
  // Inicialización
  // ----------------------------
  useEffect(() => {
    playActivate();
  }, []);

  // ----------------------------
  // Subscripción a alertas automáticas
  // ----------------------------
  useEffect(() => {
    registrarSubsistema((evento) => {
      if (evento.tipo === "AURA_ANALISIS_AUTOMATICO") {
        agregar("aura", "🔎 Diagnóstico del sistema:");
        evento.payload.sugerencias.forEach((s) => agregar("aura", "• " + s));
      }
    });
  }, []);

  // ----------------------------
  // Detectar Online / Offline
  // ----------------------------
  useEffect(() => {
    const on = () => {
      setOnline(true);
      agregar("aura", "Conexión restablecida.");
    };
    const off = () => {
      setOnline(false);
      agregar("aura", "Sin internet. Operando en modo local.");
      playAlert();
    };

    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  // ----------------------------
  // Agregar mensaje
  // ----------------------------
  const agregar = (from, text) =>
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), from, text },
    ]);

  // ----------------------------
  // Procesar mensaje
  // ----------------------------
  const sendMessage = async (txt) => {
    const cleaned = limpiarTextoPlano(txt || input);
    if (!cleaned) return;

    agregar("user", cleaned);
    setInput("");
    setThinking(true);

    const historial = messages.map((m) => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text,
    }));

    const result = await AURA_NEXUS(cleaned, historial, online);

    agregar("aura", result.respuesta);
    playClick();
    setThinking(false);

    if (result.tipo === "accion" || result.tipo === "modulo" || result.tipo === "subruta") {
      onComando?.(interpretar(cleaned));
    }
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <section className="bg-black/40 border border-cyan-500/40 rounded-2xl p-4 backdrop-blur-xl">
      <div className="flex justify-between items-center border-b border-cyan-400/30 pb-2">
        <span className="text-cyan-300 text-sm">
          {online ? "AURA Online" : "AURA Offline"}
        </span>
      </div>

      {/* CHAT */}
      <div className="mt-4 max-h-[420px] overflow-y-auto custom-scroll bg-black/20 border border-cyan-400/20 rounded-xl p-4">
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
                  : "bg-cyan-700/10 text-cyan-100 border-cyan-300/20"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {thinking && (
          <p className="text-cyan-300/70 text-xs animate-pulse">
            Procesando…
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
            isListening={false}
            onToggle={() => {
              playListen();
              recRef.current?.start();
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
