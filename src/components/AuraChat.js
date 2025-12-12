/* eslint-disable react-hooks/exhaustive-deps */

// =======================================================
//   AURAChat.js — GOD MODE 2025 (VERSIÓN DEFINITIVA)
//   FAZO LOGÍSTICA — Gustavo Oliva
//   Mateo IA — Motor conversacional + HUD + AURA Operativa
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
  playClick,
} from "./AuraSounds";

import config from "../config";

// =======================================================
//   UTILS — Limpieza de texto
// =======================================================
const limpiar = (t) =>
  t
    .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g, "")
    .replace(/\s+/g, " ")
    .trim();

// =======================================================
//   BACKEND AURA
// =======================================================
const AURA_API_URL = config.AURA_BACKEND_URL;
const AURA_PROVIDER = config.AURA_PRIMARY || "claude";

console.log("🔗 AURA API:", AURA_API_URL);
console.log("🤖 MODELO:", AURA_PROVIDER);

// =======================================================
//   SUBRUTAS AGUARUTA
// =======================================================
const SUBS = [
  ["rutas activas", "rutas-activas", "Abriendo Rutas Activas."],
  ["no entregadas", "no-entregadas", "Mostrando panel de No Entregadas."],
  ["comparacion semanal", "comparacion-semanal", "Cargando Comparación Semanal."],
  ["estadisticas por camion", "camion-estadisticas", "Estadísticas por Camión listas."],
  ["registrar entrega", "registrar-entrega", "Abriendo Registro de Entrega."],
  ["nueva distribucion", "nueva-distribucion", "Ingresando a Nueva Distribución."],
  ["editar redistribucion", "editar-redistribucion", "Editor de Redistribución listo."],
  ["inicio", "", "Volviendo al Inicio de AguaRuta."],
];

const detectarSub = (texto) => {
  if (!texto) return null;
  const n = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  for (let [palabra, ruta, frase] of SUBS) {
    if (n.includes(palabra)) {
      return {
        tipo: "subruta",
        modulo: "aguaruta",
        ruta: "/" + ruta,
        frase,
      };
    }
  }
  return null;
};

// =======================================================
//   DETECTOR DE MÓDULOS
// =======================================================
const detectarModulo = (txt) => {
  const t = txt.toLowerCase();

  if (t.includes("agua")) return { tipo: "modulo", modulo: "aguaruta", frase: "Abriendo AguaRuta." };
  if (t.includes("traslado")) return { tipo: "modulo", modulo: "traslado", frase: "Cargando Traslado Municipal." };
  if (t.includes("flota")) return { tipo: "modulo", modulo: "flota", frase: "Abriendo Flota Municipal." };
  if (t.includes("reporte")) return { tipo: "modulo", modulo: "reportes", frase: "Generando panel de Reportes." };
  if (t.includes("ajuste")) return { tipo: "modulo", modulo: "ajustes", frase: "Abriendo Ajustes del Sistema." };

  if (t.includes("inicio") || t.includes("aura"))
    return { tipo: "modulo", modulo: "aura", frase: "Volviendo al panel principal." };

  return null;
};

// =======================================================
//   DETECTOR DE ACCIONES PRECISAS
// =======================================================
const detectarAccion = (txt) => {
  const t = txt.toLowerCase();

  if (t.includes("abrir rutas")) return { tipo: "accion", accion: "abrir-rutas" };
  if (t.includes("abrir mapa")) return { tipo: "accion", accion: "abrir-mapa" };
  if (t.includes("abrir traslado")) return { tipo: "accion", accion: "abrir-traslado" };
  if (t.includes("cerrar sesion")) return { tipo: "accion", accion: "logout" };

  // FILTROS CAMIONES
  if (t.includes("filtra camion a1")) return { tipo: "accion", accion: "filtro-camion", valor: "A1" };
  if (t.includes("filtra camion a2")) return { tipo: "accion", accion: "filtro-camion", valor: "A2" };
  if (t.includes("filtra camion a3")) return { tipo: "accion", accion: "filtro-camion", valor: "A3" };

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
      text: `Hola Gustavo 👋, soy AURA (${config.BRAND.version}). ¿Qué hacemos hoy?`,
    },
  ]);

  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [emotion, setEmotion] = useState("neutral");
  const [voices, setVoices] = useState([]);
  const [voice, setVoice] = useState(null);
  const [talking, setTalking] = useState(false);
  const [listening, setListening] = useState(false);

  const recRef = useRef(null);
  const endRef = useRef(null);

  // =======================================================
  //   ACTIVAR SONIDO DE INICIO
  // =======================================================
  useEffect(() => playActivate(), []);

  // =======================================================
  //   CARGAR VOCES
  // =======================================================
  useEffect(() => {
    if (!window.speechSynthesis) return;

    const loadVoices = () => {
      const list = window.speechSynthesis.getVoices();
      setVoices(list);

      const guardada = localStorage.getItem("auraVoice");
      const preferida =
        list.find((v) => v.name === guardada) ||
        list.find((v) => v.lang.startsWith("es") && v.name.includes("female")) ||
        list.find((v) => v.lang.startsWith("es")) ||
        list[0];

      setVoice(preferida);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // =======================================================
  //   RECONOCIMIENTO DE VOZ
  // =======================================================
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = "es-CL";
    rec.onresult = (e) => {
      const tx = e.results[0][0].transcript.trim();
      if (tx) sendMessage(tx);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);

    recRef.current = rec;
  }, []);

  // =======================================================
  //   AUTO SCROLL
  // =======================================================
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  // =======================================================
  //   HABLAR (TTS)
  // =======================================================
  const speak = (text) => {
    if (!window.speechSynthesis) return;

    const clean = limpiar(text);
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(clean);
    if (voice) u.voice = voice;
    u.rate = 0.97;
    u.pitch = 1.02;

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

  // =======================================================
  //   CONSULTA AL BACKEND
  // =======================================================
  const consultaBackend = async (hist) => {
    if (!AURA_API_URL) return null;

    try {
      const res = await fetch(AURA_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: AURA_PROVIDER,
          messages: hist.map((m) => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return data.reply;
      }
    } catch {}

    return null;
  };

  // =======================================================
  //   FALLBACK
  // =======================================================
  const fallback = (t) => {
    if (t.includes("agua")) return "Revisando módulo AguaRuta.";
    if (t.includes("traslado")) return "Abriendo Traslado Municipal.";
    return "Listo Gustavo, dime qué hacemos.";
  };

  // =======================================================
  //   ENVÍO DE MENSAJES
  // =======================================================
  const sendMessage = async (texto) => {
    const msgText = limpiar(texto || input);
    if (!msgText) return;

    if (talking) {
      window.speechSynthesis.cancel();
      stopTalk();
    }

    const userMsg = { id: Date.now(), from: "user", text: msgText };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);

    // Emoción del usuario
    try {
      setEmotion(detectarEmocion(msgText) || "neutral");
    } catch {}

    // ACCIONES DIRECTAS
    const accion = detectarAccion(msgText);
    if (accion) {
      playCommand();
      speak("Ejecutando instrucción.");
      setMessages((m) => [...m, { id: Date.now(), from: "aura", text: "Ejecutando instrucción." }]);
      setThinking(false);
      onComando?.(accion);
      return;
    }

    // SUBRUTA AGUARUTA
    const sub = detectarSub(msgText);
    if (sub) {
      playCommand();
      speak(sub.frase);
      setMessages((m) => [...m, { id: Date.now(), from: "aura", text: sub.frase }]);
      setThinking(false);

      onComando?.(sub);
      onSendToIframe?.("aguaruta", {
        type: "FAZO_CMD",
        command: "open-tab",
        tab: sub.ruta.replace("/", ""),
      });

      return;
    }

    // MÓDULO PRINCIPAL
    const mod = detectarModulo(msgText);
    if (mod) {
      playCommand();
      speak(mod.frase);
      setMessages((m) => [...m, { id: Date.now(), from: "aura", text: mod.frase }]);
      setThinking(false);
      onComando?.(mod);
      return;
    }

    // BACKEND
    const hist = [...messages, userMsg];
    let reply = await consultaBackend(hist);
    if (!reply) reply = fallback(msgText);

    const auraMsg = { id: Date.now() + 1, from: "aura", text: reply };
    setMessages((m) => [...m, auraMsg]);

    speak(reply);
    playClick();
    setThinking(false);

    try {
      setEmotion(detectarEmocion(limpiar(reply)) || "neutral");
    } catch {}
  };

  // =======================================================
  //   HUD VISUAL
  // =======================================================
  const box = "bg-black/40 border border-cyan-500/40 rounded-2xl backdrop-blur-xl p-4";

  return (
    <section className={box}>
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-cyan-400/30 pb-2">
        <span className="text-cyan-300 text-sm flex items-center gap-2">
          <span className="h-2 w-2 bg-cyan-300 rounded-full animate-pulse" />
          AURA Operativa — FAZO OS
        </span>

        {voices.length > 0 && (
          <select
            className="bg-black/60 border border-cyan-400/30 rounded px-2 py-1 text-xs"
            value={voice?.name || ""}
            onChange={(e) => {
              const v = voices.find((x) => x.name === e.target.value);
              setVoice(v);
              localStorage.setItem("auraVoice", v.name);
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
      <div className="flex flex-col md:flex-row gap-4 mt-4">

        {/* AVATAR */}
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="w-44 h-44 rounded-3xl bg-black/50 border border-cyan-300/30 shadow-[0_0_20px_rgba(0,255,255,0.4)] flex items-center justify-center overflow-hidden">
            <AuraRealistic emotion={emotion} talking={talking} listening={listening} />
          </div>

          <p className="text-xs mt-3 text-cyan-200/70">
            Estado emocional: <span className="text-cyan-300">{emotion}</span>
          </p>
        </div>

        {/* CHAT */}
        <div className="md:w-2/3 flex flex-col">
          <div className="bg-black/30 border border-cyan-400/30 rounded-xl p-4 max-h-[420px] overflow-y-auto custom-scroll">
            {messages.map((m) => (
              <div key={m.id} className={`my-1 flex ${m.from === "user" ? "justify-end" : ""}`}>
                <div
                  className={`px-3 py-2 text-sm rounded-xl border ${
                    m.from === "user"
                      ? "bg-cyan-800 text-white border-cyan-500/30"
                      : "bg-cyan-600/20 text-cyan-100 border-cyan-300/30"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {thinking && <p className="text-cyan-300/70 text-xs">AURA está pensando...</p>}

            <div ref={endRef} />
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
              placeholder="Escríbeme lo que necesites, Gustavo..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <div className="flex flex-col items-center">
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
                type="submit"
                className="mt-2 px-4 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700"
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
