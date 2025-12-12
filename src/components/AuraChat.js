/* eslint-disable react-hooks/exhaustive-deps */

// =======================================================
//   AURAChat.js — GOD MODE OFFLINE 2025
//   FAZO LOGÍSTICA — Gustavo Oliva
//   Mateo IA — Operación total con Offline + Reconexión
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
  playError,
  playSuccess,
  playAlert,
} from "./AuraSounds";

import config from "../config";

// =======================================================
//   UTILS — Limpieza de texto
// =======================================================
const limpiar = (t) =>
  t
    ?.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g, "")
    .replace(/\s+/g, " ")
    .trim() || "";

// =======================================================
//   BACKEND AURA
// =======================================================
const AURA_API = config.AURA_BACKEND_URL;
const MODEL = config.AURA_PRIMARY;

console.log("🔗 Backend:", AURA_API);
console.log("🤖 Modelo:", MODEL);

// =======================================================
//   SUBRUTAS AGUARUTA
// =======================================================
const SUBS = [
  ["rutas activas", "rutas-activas", "Abriendo Rutas Activas."],
  ["no entregadas", "no-entregadas", "Mostrando No Entregadas."],
  ["comparacion semanal", "comparacion-semanal", "Cargando Comparación Semanal."],
  ["estadisticas", "camion-estadisticas", "Mostrando Estadísticas por Camión."],
  ["registrar entrega", "registrar-entrega", "Abriendo Registro de Entrega."],
  ["nueva distribucion", "nueva-distribucion", "Entrando a Nueva Distribución."],
  ["editar redistribucion", "editar-redistribucion", "Herramienta de Redistribución abierta."],
];

const detectarSubruta = (texto) => {
  if (!texto) return null;
  const n = limpiar(texto).toLowerCase();

  for (let [palabra, ruta, frase] of SUBS) {
    if (n.includes(palabra)) {
      return { tipo: "subruta", modulo: "aguaruta", ruta: "/" + ruta, frase };
    }
  }
  return null;
};

// =======================================================
//   MÓDULOS FAZO
// =======================================================
const detectarModulo = (txt) => {
  const t = txt.toLowerCase();

  if (t.includes("agua")) return { tipo: "modulo", modulo: "aguaruta", frase: "Abriendo AguaRuta." };
  if (t.includes("traslado")) return { tipo: "modulo", modulo: "traslado", frase: "Cargando Traslado Municipal." };
  if (t.includes("flota")) return { tipo: "modulo", modulo: "flota", frase: "Mostrando Flota Municipal." };
  if (t.includes("reporte")) return { tipo: "modulo", modulo: "reportes", frase: "Generando Reportes." };
  if (t.includes("ajuste")) return { tipo: "modulo", modulo: "ajustes", frase: "Abriendo Ajustes." };
  if (t.includes("inicio") || t.includes("aura")) return { tipo: "modulo", modulo: "aura", frase: "Volviendo al inicio." };

  return null;
};

// =======================================================
//   ACCIONES DIRECTAS
// =======================================================
const detectarAccion = (txt) => {
  const t = txt.toLowerCase();

  if (t.includes("abrir rutas")) return { tipo: "accion", accion: "abrir-rutas" };
  if (t.includes("abrir mapa")) return { tipo: "accion", accion: "abrir-mapa" };
  if (t.includes("abrir traslado")) return { tipo: "accion", accion: "abrir-traslado" };

  if (t.includes("cerrar sesion")) return { tipo: "accion", accion: "logout" };

  if (t.includes("filtro camion a1")) return { tipo: "accion", accion: "filtro-camion", valor: "A1" };
  if (t.includes("filtro camion a2")) return { tipo: "accion", accion: "filtro-camion", valor: "A2" };
  if (t.includes("filtro camion a3")) return { tipo: "accion", accion: "filtro-camion", valor: "A3" };

  return null;
};

// =======================================================
//   COMPONENTE PRINCIPAL AURAChat
// =======================================================
export default function AuraChat({ onComando, onSendToIframe }) {
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

  const [voices, setVoices] = useState([]);
  const [voice, setVoice] = useState(null);

  // 🌐 ESTADO DE INTERNET
  const [online, setOnline] = useState(navigator.onLine);

  const recRef = useRef(null);
  const endRef = useRef(null);

  // =======================================================
  //   DETECTOR GLOBAL OFFLINE / ONLINE
  // =======================================================
  useEffect(() => {
    const goOnline = () => {
      setOnline(true);
      playSuccess();
      setEmotion("happy");
      agregarMsg("aura", "Conexión restablecida Gustavo ✔️");
    };

    const goOffline = () => {
      setOnline(false);
      playAlert();
      setEmotion("sad");
      agregarMsg("aura", "Te quedaste sin conexión… sigo operativa en modo local.");
    };

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // =======================================================
  //   Función para agregar mensajes
  // =======================================================
  const agregarMsg = (from, text) => {
    setMessages((m) => [...m, { id: Date.now(), from, text }]);
  };
  // =======================================================
  //   ACTIVAR SONIDO DE INICIO
  // =======================================================
  useEffect(() => {
    playActivate();
  }, []);

  // =======================================================
  //   CARGA DE VOCES TTS
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
  //   RECONOCIMIENTO DE VOZ (SpeechRecognition)
  // =======================================================
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = "es-CL";
    rec.interimResults = false;

    rec.onresult = (e) => {
      const tx = e.results[0][0].transcript.trim();
      if (tx) sendMessage(tx);
    };

    rec.onerror = () => {
      playError();
      setListening(false);
    };

    rec.onend = () => setListening(false);

    recRef.current = rec;
  }, []);

  // =======================================================
  //   AUTO SCROLL EN CHAT
  // =======================================================
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  // =======================================================
  //   SISTEMA DE VOZ — TTS
  // =======================================================
  const speak = (text) => {
    if (!window.speechSynthesis) return;

    const clean = limpiar(text);
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(clean);
    if (voice) u.voice = voice;
    u.rate = 0.96;
    u.pitch = 1.03;

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
  //      CONSULTA A BACKEND (CON DETECTOR OFFLINE)
  // =======================================================
  const consultarBackend = async (hist) => {
    if (!online) {
      console.warn("⚠️ OFFLINE — No se llamará al backend.");
      return null;
    }

    if (!AURA_API) return null;

    try {
      const res = await fetch(AURA_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: MODEL,
          messages: hist.map((m) => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      if (!res.ok) {
        playAlert();
        return null;
      }

      const data = await res.json();
      return data.reply;
    } catch (e) {
      playError();
      return null;
    }
  };

  // =======================================================
  //        FALLBACK → RESPUESTA LOCAL SIN INTERNET
  // =======================================================
  const fallback = (txt) => {
    txt = txt.toLowerCase();

    if (txt.includes("agua")) return "Sin conexión Gustavo, pero sé que necesitas AguaRuta.";
    if (txt.includes("traslado")) return "Modo sin conexión activo. Traslado Municipal no cargará.";
    if (txt.includes("hola")) return "Aquí sigo Gustavo, aunque estemos offline.";
    if (txt.includes("estado")) return "Estoy 100% operativa en modo local.";

    return "Estoy sin internet, pero aún puedo ayudarte con funciones básicas.";
  };

  // =======================================================
  //            ENVÍO PRINCIPAL DE MENSAJES
  // =======================================================
  const sendMessage = async (texto) => {
    const cleaned = limpiar(texto || input);
    if (!cleaned) return;

    // detener voz si está hablando
    if (talking) {
      window.speechSynthesis.cancel();
      stopTalk();
      setTalking(false);
    }

    const userMsg = { id: Date.now(), from: "user", text: cleaned };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);

    // Detectar emoción del usuario
    try {
      setEmotion(detectarEmocion(cleaned) || "neutral");
    } catch {}

    // 🔹 ACCIONES DIRECTAS
    const acc = detectarAccion(cleaned);
    if (acc) {
      playCommand();
      speak("Ejecutando instrucción.");
      agregarMsg("aura", "Ejecutando instrucción…");
      setThinking(false);
      onComando?.(acc);
      return;
    }

    // 🔹 SUBRUTAS AguaRuta
    const sub = detectarSubruta(cleaned);
    if (sub) {
      playCommand();
      speak(sub.frase);
      agregarMsg("aura", sub.frase);
      setThinking(false);

      onComando?.(sub);
      onSendToIframe?.("aguaruta", {
        type: "FAZO_CMD",
        command: "open-tab",
        tab: sub.ruta.replace("/", ""),
      });

      return;
    }

    // 🔹 MÓDULO PRINCIPAL
    const mod = detectarModulo(cleaned);
    if (mod) {
      playCommand();
      speak(mod.frase);
      agregarMsg("aura", mod.frase);
      setThinking(false);
      onComando?.(mod);
      return;
    }

    // =======================================================
    //     MODO ONLINE → Consultar backend real
    // =======================================================
    const hist = [...messages, userMsg];
    let reply = await consultarBackend(hist);

    // Si backend no responde → fallback local
    if (!reply) {
      playAlert();
      reply = fallback(cleaned);
    }

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
  //   UTILIDAD PARA AGREGAR MENSAJES DE AURA
  // =======================================================
  const agregarMsg = (from, text) =>
    setMessages((m) => [...m, { id: Date.now(), from, text }]);

  // =======================================================
  //   ESTILOS BASE
  // =======================================================
  const contenedor =
    "bg-black/40 border border-cyan-500/40 rounded-2xl backdrop-blur-xl p-4 shadow-[0_0_25px_rgba(0,255,255,0.25)]";

  return (
    <section className={contenedor}>
      {/* =======================================================
            ENCABEZADO AURA OS / SELECCIÓN DE VOZ
      ======================================================= */}
      <div className="flex justify-between items-center border-b border-cyan-400/30 pb-2">
        <span className="text-cyan-300 text-sm flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              online ? "bg-green-400 animate-pulse" : "bg-red-400"
            }`}
          />
          {online ? "AURA Operativa — Online" : "AURA Modo Offline"}
        </span>

        {voices.length > 0 && (
          <select
            className="bg-black/60 border border-cyan-400/30 rounded px-2 py-1 text-xs text-cyan-200"
            value={voice?.name || ""}
            onChange={(e) => {
              const v = voices.find((x) => x.name === e.target.value);
              setVoice(v);
              localStorage.setItem("auraVoice", v.name);
              playClick();
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

      {/* =======================================================
            BODY: AVATAR + CHAT
      ======================================================= */}
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        {/* -------------------------------------------------------
                AVATAR AURA HOLOGRÁFICA
        -------------------------------------------------------- */}
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="w-44 h-44 rounded-3xl bg-black/50 border border-cyan-300/30 
                          shadow-[0_0_20px_rgba(0,255,255,0.3)] flex items-center 
                          justify-center overflow-hidden">
            <AuraRealistic
              emotion={emotion}
              talking={talking}
              listening={listening}
              offline={!online}
            />
          </div>

          <p className="text-xs mt-3 text-cyan-200/70">
            Estado emocional:{" "}
            <span className="text-cyan-300 font-medium">{emotion}</span>
          </p>

          {!online && (
            <p className="text-xs text-red-300 mt-1 animate-pulse">
              ⚠ Modo sin conexión — funciones limitadas
            </p>
          )}
        </div>

        {/* -------------------------------------------------------
                PANEL DE CHAT
        -------------------------------------------------------- */}
        <div className="md:w-2/3 flex flex-col">
          <div className="bg-black/30 border border-cyan-400/30 rounded-xl p-4 
                          max-h-[420px] overflow-y-auto custom-scroll shadow-inner">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`my-1 flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 text-sm rounded-xl border max-w-[80%] whitespace-pre-wrap
                    ${
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

            <div ref={endRef} />
          </div>

          {/* -------------------------------------------------------
                  INPUT + MIC
          -------------------------------------------------------- */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2 mt-3 items-end"
          >
            {/* ÁREA DE ESCRITURA */}
            <textarea
              rows={2}
              className="flex-1 bg-black/40 border border-cyan-300/30 
                         rounded-xl text-sm p-3 text-cyan-100 outline-none 
                         focus:border-cyan-400 shadow-[0_0_12px_rgba(0,255,255,0.15)]"
              placeholder={
                online
                  ? "Escríbeme lo que necesites, Gustavo…"
                  : "Modo offline activo… ¿qué necesitas?"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            {/* MIC + BOTÓN DE ENVIAR */}
            <div className="flex flex-col items-center gap-2">
              <FloatingMic
                isListening={listening}
                disabled={!recRef.current}
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

              {/* BOTÓN ENVIAR */}
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 text-white rounded-xl 
                           hover:bg-cyan-700 border border-cyan-300/40 
                           shadow-[0_0_14px_rgba(0,255,255,0.35)]"
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
