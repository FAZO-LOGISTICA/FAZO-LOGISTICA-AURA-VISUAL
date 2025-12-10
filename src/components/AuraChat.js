/* eslint-disable react-hooks/exhaustive-deps */

// =======================================================
//   AURAChat.js — ULTRA PRO MAX 2025 (VERSIÓN DEFINITIVA)
//   FAZO LOGÍSTICA — Gustavo Oliva
//   Mateo (IA) — Arquitectura completa + AURA OPERATIVA
// =======================================================

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

// =======================================================
//   LIMPIAR EMOJIS PARA QUE AURA NO LOS LEA EN VOZ
// =======================================================
const limpiarEmojis = (texto) =>
  texto.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g,
    ""
  );

// =======================================================
//   BACKEND AURA
// =======================================================
const AURA_API_URL = config.AURA_BACKEND_URL;
const AURA_PROVIDER = config.AURA_PRIMARY || "claude";

console.log("🔗 AURA API:", AURA_API_URL);
console.log("🧠 MODELO AURA:", AURA_PROVIDER);

// =======================================================
//   SUBRUTAS AGUARUTA
// =======================================================
const detectarSubrutaAguaRuta = (texto) => {
  if (!texto) return null;
  const norm = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const rutas = [
    ["rutas activas", "/rutas-activas", "Abriendo Rutas Activas de AguaRuta."],
    ["no entregadas", "/no-entregadas", "Abriendo panel de No Entregadas."],
    ["comparacion semanal", "/comparacion-semanal", "Mostrando Comparación Semanal."],
    ["estadisticas por camion", "/camion-estadisticas", "Estadísticas por Camión listas."],
    ["registrar entrega", "/registrar-entrega", "Abriendo Registro de Entrega."],
    ["nueva distribucion", "/nueva-distribucion", "Ingresando a Nueva Distribución."],
    ["editar redistribucion", "/editar-redistribucion", "Editor de Redistribución cargado."],
    ["inicio aguaruta", "/", "Volviendo al Inicio de AguaRuta."],
  ];

  for (let r of rutas) {
    if (norm.includes(r[0])) {
      return { tipo: "subruta", modulo: "aguaruta", ruta: r[1], frase: r[2] };
    }
  }
  return null;
};

// =======================================================
//   COMANDOS DE MÓDULOS FAZO
// =======================================================
const detectarComandoModulo = (texto) => {
  const t = texto?.toLowerCase() || "";

  if (t.includes("aguaruta") || (t.includes("agua") && t.includes("laguna")))
    return { tipo: "modulo", modulo: "aguaruta", frase: "Abriendo módulo AguaRuta." };

  if (t.includes("traslado"))
    return { tipo: "modulo", modulo: "traslado", frase: "Cargando módulo Traslado Municipal." };

  if (t.includes("flota"))
    return { tipo: "modulo", modulo: "flota", frase: "Mostrando panel de Flota Municipal." };

  if (t.includes("reporte") || t.includes("informe"))
    return { tipo: "modulo", modulo: "reportes", frase: "Generando módulo de Reportes FAZO." };

  if (t.includes("ajustes"))
    return { tipo: "modulo", modulo: "ajustes", frase: "Abriendo Ajustes del Sistema." };

  if (t.includes("aura") || t.includes("inicio"))
    return { tipo: "modulo", modulo: "aura", frase: "Volviendo al panel principal de AURA." };

  return null;
};

// =======================================================
//   AURA OPERATIVA — DETECTOR DE ACCIONES REALES
// =======================================================
const detectarAccionAura = (texto) => {
  const t = texto.toLowerCase();

  // ABRIR MÓDULOS
  if (t.includes("abre") || t.includes("abrir")) {
    if (t.includes("mapa")) return { tipo: "accion", accion: "abrir-mapa" };
    if (t.includes("rutas")) return { tipo: "accion", accion: "abrir-rutas" };
    if (t.includes("traslado")) return { tipo: "accion", accion: "abrir-traslado" };
    if (t.includes("ajustes")) return { tipo: "accion", accion: "abrir-ajustes" };
  }

  // FILTROS
  if (t.includes("filtra") || t.includes("filtro")) {
    if (t.includes("camion a1")) return { tipo: "accion", accion: "filtro-camion", valor: "A1" };
    if (t.includes("camion a2")) return { tipo: "accion", accion: "filtro-camion", valor: "A2" };
    if (t.includes("camion a3")) return { tipo: "accion", accion: "filtro-camion", valor: "A3" };
  }

  // BUSCAR
  if (t.includes("buscar") || t.includes("busca")) {
    const value = t.replace("buscar", "").replace("busca", "").trim();
    return { tipo: "accion", accion: "buscar", valor: value };
  }

  // LOGOUT
  if (t.includes("cerrar sesion")) {
    return { tipo: "accion", accion: "logout" };
  }

  return null;
};

// =======================================================
//   COMPONENTE PRINCIPAL
// =======================================================
export default function AuraChat({ onComando, onSendToIframe }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "aura",
      text: `Hola Gustavo 👋, soy AURA (${config.BRAND.version}). ¿Qué módulo necesitas hoy?`,
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

// =======================================================
//   ACTIVACIÓN
// =======================================================
  useEffect(() => {
    playActivate();
  }, []);

// =======================================================
//   CARGA VOCES TTS
// =======================================================
  useEffect(() => {
    if (!window.speechSynthesis) return;

    const load = () => {
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

    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, []);

// =======================================================
//   SPEECH RECOGNITION
// =======================================================
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

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

// =======================================================
//   AUTO SCROLL
// =======================================================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

// =======================================================
//   TTS AMPLIADO
// =======================================================
  const speak = (text) => {
    if (!window.speechSynthesis || !text) return;

    const limpio = limpiarEmojis(text).replace(/\s+/g, " ").trim();

    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(limpio);
    if (selectedVoice) u.voice = selectedVoice;

    u.rate = 0.96;
    u.pitch = 1.03;
    u.volume = 1;

    u.onstart = () => {
      startTalk();
      setIsTalking(true);
      setEmotion("hablando");
    };

    u.onend = () => {
      stopTalk();
      setIsTalking(false);
      setEmotion("neutral");
    };

    window.speechSynthesis.speak(u);
  };

// =======================================================
//   LLAMADO A BACKEND
// =======================================================
  const callAuraBackend = async (history) => {
    if (!AURA_API_URL) return null;

    const payload = {
      provider: AURA_PROVIDER,
      messages: history.map((m) => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text.trim(),
      })),
    };

    try {
      const res = await fetch(AURA_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        return data.reply;
      }
    } catch {}

    return null;
  };

// =======================================================
//   FALLBACK LOCAL
// =======================================================
  const getLocalReply = (txt) => {
    if (txt.includes("agua")) return "Perfecto, reviso AguaRuta.";
    if (txt.includes("traslado")) return "Entendido, abro Traslado Municipal.";
    return "Listo Gustavo, cuéntame qué hacemos.";
  };

// =======================================================
//   ENVÍO DE MENSAJES
// =======================================================
  const handleSendMessage = async (texto) => {
    const finalText = (texto || input).trim();
    if (!finalText) return;

    if (isTalking) {
      window.speechSynthesis.cancel();
      stopTalk();
      setIsTalking(false);
    }

    const userMsg = {
      id: Date.now(),
      from: "user",
      text: finalText,
      timestamp: new Date().toISOString(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsThinking(true);

// =======================================================
//   EMOCIÓN DEL USUARIO
// =======================================================
    try {
      setEmotion(detectarEmocion(limpiarEmojis(finalText)) || "neutral");
    } catch {}

// =======================================================
//   AURA OPERATIVA — ACCIONES
// =======================================================
    const accion = detectarAccionAura(finalText);
    if (accion) {
      const frase = "Ejecutando instrucción, Gustavo.";
      speak(frase);
      playCommand();

      setMessages((m) => [...m, { id: Date.now(), from: "aura", text: frase }]);
      setIsThinking(false);

      if (onComando) onComando(accion);

      return;
    }

// =======================================================
//   SUBRUTAS AguaRuta
// =======================================================
    const sub = detectarSubrutaAguaRuta(finalText);
    if (sub) {
      speak(sub.frase);
      playCommand();

      setMessages((m) => [...m, { id: Date.now(), from: "aura", text: sub.frase }]);
      setIsThinking(false);

      if (onComando) onComando(sub);

      if (onSendToIframe) {
        onSendToIframe("aguaruta", {
          type: "FAZO_CMD",
          command: "open-tab",
          tab: sub.ruta.replace("/", ""),
        });
      }

      return;
    }

// =======================================================
//   MODULOS GENERALES
// =======================================================
    const cmd = detectarComandoModulo(finalText);
    if (cmd) {
      speak(cmd.frase);
      playCommand();

      setMessages((m) => [...m, { id: Date.now(), from: "aura", text: cmd.frase }]);
      setIsThinking(false);

      if (onComando) onComando(cmd);
      return;
    }

// =======================================================
//   BACKEND
// =======================================================
    const history = [...messages, userMsg];
    let reply = await callAuraBackend(history);

    if (!reply) reply = getLocalReply(finalText);

    reply = reply.trim();

    const auraMsg = {
      id: Date.now() + 1,
      from: "aura",
      text: reply,
      timestamp: new Date().toISOString(),
    };

    setMessages((m) => [...m, auraMsg]);

    try {
      setEmotion(detectarEmocion(limpiarEmojis(reply)) || "neutral");
    } catch {}

    speak(reply);
    setIsThinking(false);
  };

// =======================================================
//   HUD VISUAL
// =======================================================
  const hudPanel =
    "bg-black/40 border border-cyan-500/40 rounded-2xl shadow-[0_0_25px_rgba(0,255,255,0.35)] backdrop-blur-xl";

  const hudChat =
    "bg-black/30 border border-cyan-400/30 shadow-inner shadow-cyan-400/20";

  const hudBubbleAura =
    "bg-cyan-600/30 text-cyan-100 border border-cyan-300/30 rounded-bl-sm";

  const hudBubbleUser =
    "bg-cyan-800 text-white border border-cyan-500/30 rounded-br-sm";

// =======================================================
//   RENDER COMPLETO
// =======================================================
  return (
    <section className={`${hudPanel} p-4`}>
      {/* HEADER */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30">
        <span className="text-cyan-300 font-semibold flex items-center gap-2">
          <span className="h-2 w-2 bg-cyan-300 rounded-full animate-pulse" />
          AURA en línea — FAZO HUD
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
            <AuraRealistic emotion={emotion} talking={isTalking} listening={isListening} />
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
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
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

            {isThinking && <div className="text-cyan-300/70 text-xs">Procesando…</div>}

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
                disabled={isThinking}
                onToggle={() => {
                  if (!recognitionRef.current) return;

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
