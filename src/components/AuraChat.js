// ======================================================================
//  AURAChat.js — Núcleo Conversacional FINAL PRO
//  FAZO-OS 2025 — FAZO LOGÍSTICA
//  Gustavo Oliva · Mateo IA
// ======================================================================

import { useEffect, useRef, useState } from "react";

// Núcleos AURA
import { emitirEvento } from "./FAZO_OS_EventBridge";
import { registrarAccion } from "./AURAMemory";
import { AURA_NEXUS } from "./AURA_NEXUS";

// Utilidades
import { normalizarTexto } from "./utils/normalizarTexto";

// ======================================================================
// CONFIGURACIÓN
// ======================================================================

const AURA_NAME = "AURA";
const ACTIVATION_WORDS = ["aura", "mateo"];

// ======================================================================
// HOOK PRINCIPAL
// ======================================================================

export default function useAURAChat() {
  const recognitionRef = useRef(null);

  const [activo, setActivo] = useState(false);
  const [escuchando, setEscuchando] = useState(false);
  const [ultimoMensaje, setUltimoMensaje] = useState("");
  const [respuesta, setRespuesta] = useState("");

  // ============================================================
  // INICIALIZAR RECONOCIMIENTO DE VOZ
  // ============================================================

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("⚠️ Reconocimiento de voz no soportado");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-CL";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const texto = event.results[event.results.length - 1][0].transcript;
      procesarEntrada(texto);
    };

    recognition.onerror = (err) => {
      console.error("🎤 Error de micrófono:", err);
      setEscuchando(false);
    };

    recognitionRef.current = recognition;
  }, []);

  // ============================================================
  // PROCESAR ENTRADA DE USUARIO (VOZ O TEXTO)
  // ============================================================

  function procesarEntrada(textoCrudo) {
    const texto = normalizarTexto(textoCrudo);
    setUltimoMensaje(texto);

    // Ver si invoca a Aura
    const invoca = ACTIVATION_WORDS.some((w) => texto.includes(w));

    if (!activo && invoca) {
      setActivo(true);
      hablar("Dime Gustavo, te escucho.");
      return;
    }

    if (!activo) return;

    registrarAccion("comando_usuario", texto);

    // Delegar análisis al NEXUS
    const decision = AURA_NEXUS.analizar(texto);

    ejecutarDecision(decision);
  }

  // ============================================================
  // EJECUTAR DECISION DEL NEXUS
  // ============================================================

  function ejecutarDecision(decision) {
    if (!decision) {
      hablar("No entendí eso. ¿Puedes repetirlo?");
      return;
    }

    const { tipo, payload, respuestaVoz } = decision;

    if (respuestaVoz) {
      hablar(respuestaVoz);
    }

    // Emitir evento global FAZO-OS
    emitirEvento(tipo, payload);
  }

  // ============================================================
  // HABLAR (TTS)
  // ============================================================

  function hablar(texto) {
    setRespuesta(texto);

    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "es-CL";
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  // ============================================================
  // CONTROLES EXTERNOS
  // ============================================================

  function iniciarEscucha() {
    if (!recognitionRef.current) return;
    recognitionRef.current.start();
    setEscuchando(true);
  }

  function detenerEscucha() {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setEscuchando(false);
  }

  function enviarTexto(texto) {
    procesarEntrada(texto);
  }

  function apagarAura() {
    setActivo(false);
    hablar("Quedo en silencio. Avísame cuando me necesites.");
  }

  // ============================================================
  // API DEL HOOK
  // ============================================================

  return {
    activo,
    escuchando,
    ultimoMensaje,
    respuesta,
    iniciarEscucha,
    detenerEscucha,
    enviarTexto,
    apagarAura,
  };
}
