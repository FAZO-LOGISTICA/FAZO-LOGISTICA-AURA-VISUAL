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

// FAZO OS ROUTER + AGENTE
import {
  registrarSubsistema,
  analizarManual,
} from "../core/FAZO_OS_Router";

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
   BACKEND DE AURA
====================================================================== */
const AURA_API = config.AURA_BACKEND_URL;
const MODEL = config.AURA_PRIMARY;

/* ======================================================================
   SUBRUTAS DE AGUARUTA
====================================================================== */
const SUBS = [
  ["rutas activas", "rutas-activas", "Abriendo Rutas Activas."],
  ["no entregadas", "no-entregadas", "Mostrando No Entregadas."],
  ["comparacion semanal", "comparacion-semanal", "Cargando Comparación Semanal."],
  ["estadisticas", "camion-estadisticas", "Mostrando Estadísticas por Camión."],
  ["registrar entrega", "registrar-entrega", "Abriendo Registro de Entrega."],
  ["nueva distribucion", "nueva-distribucion", "Entrando a Nueva Distribución."],
  ["editar redistribucion", "editar-redistribucion", "Herramienta de Redistribución abierta."],
];

const detectarSubruta = (text) => {
  const t = limpiar(text).toLowerCase();
  for (let [k, ruta, frase] of SUBS) {
    if (t.includes(k)) return { tipo: "subruta", ruta: "/" + ruta, frase };
  }
  return null;
};

/* ======================================================================
   MÓDULOS FAZO OS
====================================================================== */
const detectarModulo = (text) => {
  const t = text.toLowerCase();

  if (t.includes("agua"))
    return { tipo: "modulo", modulo: "aguaruta", frase: "Abriendo AguaRuta." };

  if (t.includes("traslado"))
    return { tipo: "modulo", modulo: "traslado", frase: "Entrando a Traslado Municipal." };

  if (t.includes("flota"))
    return { tipo: "modulo", modulo: "flota", frase: "Mostrando Flota Municipal." };

  if (t.includes("inicio") || t.includes("aura"))
    return { tipo: "modulo", modulo: "inicio", frase: "Volviendo al inicio." };

  return null;
};

/* ======================================================================
   ACCIONES DIRECTAS
====================================================================== */
const detectarAccion = (text) => {
  const t = text.toLowerCase();

  if (t.includes("abrir rutas")) return { tipo: "accion", accion: "abrir-rutas" };
  if (t.includes("abrir mapa")) return { tipo: "accion", accion: "abrir-mapa" };
  if (t.includes("cerrar sesion") || t.includes("logout"))
    return { tipo: "accion", accion: "logout" };

  return null;
};

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

  /* ====================================================================
     SONIDO INICIAL
  ==================================================================== */
  useEffect(() => {
    try {
      playActivate();
    } catch {}
  }, []);

  /* ====================================================================
     SUSCRIPCIÓN A FAZO_OS_ROUTER
     (AURA recibe alertas automáticas del agente)
  ==================================================================== */
  useEffect(() => {
    registrarSubsistema((evento) => {
      if (evento.tipo === "AURA_ANALISIS_AUTOMATICO") {
        agregar("aura", "🔍 Revisión automática realizada.");
        agregar("aura", evento.payload.sugerencias.join("\n"));
        speak("Revisión automática completada. Te dejo mis sugerencias.");
      }
    });
  }, []);

  /* ====================================================================
     FUNCIONES DEL CHAT
  ==================================================================== */
  const agregar = (from, text) =>
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), from, text },
    ]);

  const speak = (txt) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(limpiar(txt));
    u.rate = 0.95;
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

  /* ====================================================================
     ENVÍO PRINCIPAL
  ==================================================================== */
  const sendMessage = async (txt) => {
    const cleaned = limpiar(txt || input);
    if (!cleaned) return;

    agregar("user", cleaned);
    setInput("");
    setThinking(true);

    // ===== 1. Emociones =====
    setEmotion(detectarEmocion(cleaned));

    // ===== 2. Comando directo =====
    const acc = detectarAccion(cleaned);
    if (acc) {
      playCommand();
      agregar("aura", "Ejecutando instrucción…");
      speak("Ejecutando instrucción.");
      onComando?.(acc);
      setThinking(false);
      return;
    }

    // ===== 3. Subruta =====
    const sub = detectarSubruta(cleaned);
    if (sub) {
      playCommand();
      agregar("aura", sub.frase);
      speak(sub.frase);

      onComando?.(sub);

      onSendToIframe?.("aguaruta", {
        type: "FAZO_CMD",
        command: "open-tab",
        tab: sub.ruta.replace("/", ""),
      });

      setThinking(false);
      return;
    }

    // ===== 4. Modulo =====
    const mod = detectarModulo(cleaned);
    if (mod) {
      playCommand();
      agregar("aura", mod.frase);
      speak(mod.frase);
      onComando?.(mod);
      setThinking(false);
      return;
    }

    // ===== 5. Comando de análisis manual =====
    if (
      cleaned.includes("revisa") ||
      cleaned.includes("analiza") ||
      cleaned.includes("como vamos")
    ) {
      playCommand();
      agregar("aura", "Analizando el estado del sistema…");

      const analisis = await analizarManual(() => window.__FAZO_DATA__);

      agregar("aura", analisis.sugerencias.join("\n"));
      speak("Análisis completado. Aquí tienes mis observaciones.");
      setThinking(false);
      return;
    }

    // ===== 6. Respuesta IA (backend) =====
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
      reply = "Modo offline activo. No pude conectar con mi motor principal.";
    }

    agregar("aura", reply);
    speak(reply);
    playClick();

    setThinking(false);
  };

  /* ====================================================================
     RENDER
  ==================================================================== */
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
