// ================================================
//   AURAChat.js — Versión ULTRA PRO 2025
//   FAZO LOGÍSTICA — Gustavo Oliva
//   Mateo (IA) — Optimización total
// ================================================

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
} from "./AuraSounds";

import config from "../config";

// ================================================
//   LIMPIAR EMOJIS PARA QUE NO LOS LEA EN VOZ
// ================================================
const limpiarEmojis = (texto) =>
  texto.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g,
    ""
  );

// ================================================
//   BACKEND DE AURA
// ================================================
const AURA_API_URL = config.AURA_BACKEND_URL;
console.log("🔗 AURA API:", AURA_API_URL);

// ================================================
//   DETECTAR SUBRUTAS AGUARUTA
// ================================================
const detectarSubrutaAguaRuta = (texto) => {
  if (!texto) return null;
  const t = texto.toLowerCase();
  const norm = t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const rutas = [
    ["rutas activas", "/rutas-activas", "Abriendo Rutas Activas de AguaRuta."],
    ["no entregadas", "/no-entregadas", "Abriendo panel de No Entregadas."],
    [
      "comparacion semanal",
      "/comparacion-semanal",
      "Mostrando Comparación Semanal.",
    ],
    [
      "estadisticas por camion",
      "/camion-estadisticas",
      "Abriendo Estadísticas por Camión.",
    ],
    [
      "registrar entrega",
      "/registrar-entrega",
      "Abriendo formulario de Registro de Entrega.",
    ],
    [
      "nueva distribucion",
      "/nueva-distribucion",
      "Ingresando al módulo Nueva Distribución.",
    ],
    [
      "editar redistribucion",
      "/editar-redistribucion",
      "Abriendo editor de Redistribución.",
    ],
    ["inicio aguaruta", "/", "Volviendo al Inicio de AguaRuta."],
  ];

  for (let r of rutas) {
    if (norm.includes(r[0]))
      return { tipo: "subruta", modulo: "aguaruta", ruta: r[1], frase: r[2] };
  }

  return null;
};

// ================================================
//   DETECTAR COMANDOS DE MÓDULOS
// ================================================
const detectarComandoModulo = (texto) => {
  const t = texto?.toLowerCase() || "";

  if (t.includes("aguaruta") || (t.includes("agua") && t.includes("laguna")))
    return {
      tipo: "modulo",
      modulo: "aguaruta",
      frase:
        "Abriendo módulo AguaRuta, Gustavo. Cargando rutas, litros y camiones.",
    };

  if (t.includes("traslado") || t.includes("vehiculos municipales"))
    return {
      tipo: "modulo",
      modulo: "traslado",
      frase:
        "Cargando módulo Traslado Municipal. Preparando reservas y disponibilidad.",
    };

  if (t.includes("flota") || t.includes("camiones") || t.includes("vehiculos"))
    return {
      tipo: "modulo",
      modulo: "flota",
      frase: "Mostrando panel de Flota Municipal y mantenimientos.",
    };

  if (t.includes("reporte") || t.includes("informes"))
    return {
      tipo: "modulo",
      modulo: "reportes",
      frase: "Abriendo módulo de Reportes FAZO. Preparando información.",
    };

  if (t.includes("ajustes") || t.includes("configuracion"))
    return {
      tipo: "modulo",
      modulo: "ajustes",
      frase: "Abriendo ajustes AURA. Configura voz, tema y sesión.",
    };

  if (t.includes("aura") || t.includes("inicio"))
    return {
      tipo: "modulo",
      modulo: "aura",
      frase: "Volviendo al panel central AURA.",
    };

  return null;
};

// ================================================
//   COMPONENTE PRINCIPAL
// ================================================
export default function AuraChat({ onComando, onSendToIframe }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "aura",
      text: "Hola Gustavo 👋, soy AURA, tu sistema inteligente FAZO. ¿En qué módulo quieres trabajar hoy?",
      timestamp: new Date().toISOString(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [emotion, setEmotion] = useState("neutral");

  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const [isTalking, setIsTalking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);
  const bottomRef = useRef(null);

  const [speechSupported, setSpeechSupported] = useState(true);

  // ================================================
  //   SFX AL ACTIVAR
  // ================================================
  useEffect(() => {
    playActivate();
  }, []);

  // ================================================
  //   CARGA DE VOCES
  // ================================================
  useEffect(() => {
    if (!window.speechSynthesis) return;

    const loadVoices = () => {
      const all = window.speechSynthesis.getVoices();
      setVoices(all);

      const guardada = localStorage.getItem("aura-voice");
      const preferida =
        all.find((v) => v.name === guardada) ||
        all.find((v) => v.lang.startsWith("es") && v.name.includes("female")) ||
        all.find((v) => v.lang.startsWith("es")) ||
        all[0];

      setSelectedVoice(preferida);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // ================================================
  //   SPEECH RECOGNITION
  // ================================================
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSpeechSupported(false);
      return;
    }

    const rec = new SR();
    rec.lang = "es-CL";
    rec.interimResults = false;

    rec.onresult = (e) => {
      const tx = e.results[0][0].transcript.trim();
      if (tx) handleSendMessage(tx);
    };

    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);

    recognitionRef.current = rec;
  }, []);

  // ================================================
  //   AUTO SCROLL
  // ================================================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================================================
  //   HABLAR (TTS)
  // ================================================
  const speak = (text) => {
    if (!window.speechSynthesis || !text) return;
    const limpio = limpiarEmojis(text);

    const u = new SpeechSynthesisUtterance(limpio);
    if (selectedVoice) u.voice = selectedVoice;
    u.rate = 0.95;
    u.pitch = 1;

    u.onstart = () => {
      setIsTalking(true);
      startTalk();
    };

    u.onend = () => {
      setIsTalking(false);
      stopTalk();
      setEmotion("neutral");
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  // ================================================
  //   LLAMAR BACKEND ULTRA PRO
  // ================================================
  const callAuraBackend = async (history) => {
    if (!AURA_API_URL) return null;

    try {
      const payload = {
        provider: "openai", // por defecto, cambiable
        messages: history.map((m) => ({
          role: m.from === "user" ? "user" : "assistant",
          content: m.text.trim(),
        })),
      };

      console.log("📤 Enviando a backend:", payload);

      const res = await fetch(AURA_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) return null;

      const data = await res.json();
      return data?.reply || null;
    } catch (e) {
      console.error("❌ Backend error:", e);
      return null;
    }
  };

  // ================================================
  //   FALLBACK LOCAL
  // ================================================
  const getLocalReply = (t) => {
    const tx = t.toLowerCase();

    if (tx.includes("agua") || tx.includes("laguna"))
      return "Perfecto Gustavo, te ayudo con rutas, litros y camiones de AguaRuta.";

    if (tx.includes("traslado"))
      return "En Traslado Municipal puedo ayudarte con reservas, agenda y vehículos.";

    if (tx.includes("flota"))
      return "En Flota Municipal puedo ayudarte con mantenimientos y disponibilidad.";

    return "Entendido Gustavo, cuéntame más.";
  };

  // ================================================
  //   ENVIAR MENSAJE
  // ================================================
  const handleSendMessage = async (texto) => {
    const finalText = (texto || input).trim();
    if (!finalText || isThinking) return;

    const userMsg = { id: Date.now(), from: "user", text: finalText };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsThinking(true);

    // Emotion detect
    try {
      const emoUser = detectarEmocion(limpiarEmojis(finalText));
      if (emoUser) setEmotion(emoUser);
    } catch {}

    // SUBRUTAS AGUARUTA
    const sub = detectarSubrutaAguaRuta(finalText);
    if (sub) {
      speak(sub.frase);
      playCommand();

      const auraMsg = { id: Date.now(), from: "aura", text: sub.frase };
      setMessages((m) => [...m, auraMsg]);
      setIsThinking(false);

      if (onComando) onComando(sub);

      if (onSendToIframe && sub.modulo === "aguaruta") {
        const tabSlug = sub.ruta.replace(/^\//, "");
        onSendToIframe("aguaruta", {
          type: "FAZO_CMD",
          command: "open-tab",
          tab: tabSlug,
        });
      }
      return;
    }

    // COMANDOS PRINCIPALES
    const cmd = detectarComandoModulo(finalText);
    if (cmd) {
      speak(cmd.frase);
      playCommand();

      const auraMsg = { id: Date.now(), from: "aura", text: cmd.frase };
      setMessages((m) => [...m, auraMsg]);
      setIsThinking(false);

      if (onComando) onComando(cmd);
      return;
    }

    // BACKEND
    const historySnapshot = [...messages, userMsg];
    let reply = await callAuraBackend(historySnapshot);
    if (!reply) reply = getLocalReply(finalText);

    const auraMsg = { id: Date.now(), from: "aura", text: reply };
    setMessages((m) => [...m, auraMsg]);

    try {
      const emoAura = detectarEmocion(limpiarEmojis(reply));
      if (emoAura) setEmotion(emoAura);
    } catch {}

    speak(reply);
    setIsThinking(false);
  };

  // ================================================
  //   HUD VISUAL (NO SE TOCÓ TU ESTILO)
  // ================================================
  const hudPanel =
    "bg-black/40 border border-cyan-500/40 rounded-2xl shadow-[0_0_25px_rgba(0,255,255,0.35)] backdrop-blur-xl";

  const hudChat =
    "bg-black/30 border border-cyan-400/30 shadow-inner shadow-cyan-400/20";

  const hudBubbleAura =
    "bg-cyan-600/30 text-cyan-100 border border-cyan-300/30 rounded-bl-sm";

  const hudBubbleUser =
    "bg-cyan-800 text-white border border-cyan-500/30 rounded-br-sm";

  // ================================================
  //   RENDER
  // ================================================
  return (
    <section className={`${hudPanel} p-4`}>
      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30">
        <span className="text-cyan-300 font-semibold flex items-center gap-2">
          <span className="h-2 w-2 bg-cyan-300 rounded-full animate-pulse" />
          AURA en línea — HUD FAZO
        </span>

        {voices.length > 0 && (
          <select
            className="bg-black/60 border border-cyan-400/30 rounded-lg px-2 py-1 text-xs text-cyan-200"
            value={selectedVoice?.name || ""}
            onChange={(e) => {
              const v = voices.find((x) => x.name === e.target.value);
              setSelectedVoice(v);
              localStorage.setItem("aura-voice", v?.name || "");
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
      <div className="flex flex-col md:flex-row gap-6 mt-4">
        {/* AVATAR */}
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="w-48 h-48 border border-cyan-400/30 rounded-3xl bg-black/40 shadow-[0_0_20px_rgba(0,255,255,0.2)] flex items-center justify-center overflow-hidden">
            <AuraRealistic
              emotion={emotion}
              talking={isTalking}
              listening={isListening}
            />
          </div>
          <p className="text-xs text-cyan-300/80 mt-3">
            Emoción: <span className="text-cyan-200">{emotion}</span>
          </p>
        </div>

        {/* CHAT */}
        <div className="md:w-2/3 flex flex-col">
          <div
            className={`${hudChat} rounded-2xl p-4 flex flex-col gap-3 max-h-[24rem] overflow-y-auto`}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 text-sm border shadow-lg ${
                    msg.from === "user" ? hudBubbleUser : hudBubbleAura
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="text-cyan-300/70 text-xs">Procesando…</div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="mt-3 flex gap-3"
          >
            <textarea
              className="flex-1 resize-none rounded-xl bg-black/40 border border-cyan-400/30 text-sm p-3 text-cyan-100 placeholder-cyan-300/40"
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Habla conmigo, Gustavo…"
            />

            <div className="flex flex-col items-center">
              <FloatingMic
                isListening={isListening}
                disabled={!speechSupported || isThinking}
                onToggle={() => {
                  if (!speechSupported || !recognitionRef.current) return;
                  if (isListening) {
                    recognitionRef.current.stop();
                    setIsListening(false);
                  } else {
                    try {
                      playListen();
                      recognitionRef.current.start();
                      setIsListening(true);
                    } catch {
                      setIsListening(false);
                    }
                  }
                }}
              />

              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-cyan-600 text-white rounded-xl shadow hover:bg-cyan-700"
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
