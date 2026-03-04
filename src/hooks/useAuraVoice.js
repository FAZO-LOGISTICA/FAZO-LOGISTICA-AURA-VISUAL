// ========================================================
//   useAuraVoice.js — FAZO OS 2025
//   v2.0 — Fix error network + reconocimiento estable
// ========================================================

import { useState, useRef, useCallback, useEffect } from "react";

export function useAuraVoice({
  onTranscript,
  onStatusChange,
  activationWord = "aura"
}) {
  const [isListening, setIsListening]   = useState(false);
  const [isSpeaking, setIsSpeaking]     = useState(false);
  const [isActive, setIsActive]         = useState(false);
  const [transcript, setTranscript]     = useState("");

  const recognitionRef  = useRef(null);
  const synthRef        = useRef(window.speechSynthesis);
  const isListeningRef  = useRef(false);   // ref para evitar stale closures
  const isActiveRef     = useRef(false);
  const shouldRestartRef = useRef(false);  // controla reinicio automático

  // Mantener refs sincronizados con estado
  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);
  useEffect(() => { isActiveRef.current    = isActive;    }, [isActive]);

  // Refs para callbacks — evita recrear recognition cuando cambian
  const onTranscriptRef   = useRef(onTranscript);
  const onStatusChangeRef = useRef(onStatusChange);
  useEffect(() => { onTranscriptRef.current   = onTranscript;   }, [onTranscript]);
  useEffect(() => { onStatusChangeRef.current = onStatusChange; }, [onStatusChange]);

  // ── Inicializar recognition UNA SOLA VEZ ──
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("❌ Navegador no soporta reconocimiento de voz");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang            = "es-CL";
    recognition.continuous      = false;  // FIX: false evita error network en Netlify
    recognition.interimResults  = false;  // Solo resultados finales — más estable

    recognition.onstart = () => {
      console.log("🎤 Reconocimiento iniciado");
      setIsListening(true);
      onStatusChangeRef.current?.("listening");
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }

      const texto = finalTranscript.trim();
      if (!texto) return;

      console.log("📝 Escuché:", texto);
      setTranscript(texto);

      const lower = texto.toLowerCase();

      if (!isActiveRef.current && lower.includes(activationWord)) {
        console.log(`🎯 "${activationWord}" detectado`);
        setIsActive(true);
        onStatusChangeRef.current?.("active");
        speakInternal("¿Sí?");
        return;
      }

      if (isActiveRef.current) {
        console.log("✅ Enviando a AURA:", texto);
        onTranscriptRef.current?.(texto);
        setTranscript("");
        setIsActive(false);
      }
    };

    recognition.onerror = (event) => {
      // "no-speech" es normal — no es error real
      if (event.error === "no-speech") {
        console.log("⏸️ Sin habla detectada");
      } else {
        console.error("❌ Error reconocimiento:", event.error);
        onStatusChangeRef.current?.("error");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("🛑 Reconocimiento terminado");
      setIsListening(false);
      onStatusChangeRef.current?.("idle");

      // Reiniciar automáticamente si shouldRestart está activo
      if (shouldRestartRef.current) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            console.warn("No se pudo reiniciar:", e.message);
          }
        }, 300); // pequeño delay para evitar conflictos
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldRestartRef.current = false;
      try { recognition.stop(); } catch (_) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← Sin dependencias: se crea UNA sola vez

  // ── TTS interno (sin useCallback para evitar dependencias) ──
  const speakInternal = (text, options = {}) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang   = "es-CL";
    utterance.rate   = options.rate   || 1.0;
    utterance.pitch  = options.pitch  || 1.0;
    utterance.volume = options.volume || 1.0;

    const voices = synthRef.current.getVoices();
    const voz = voices.find(v => v.lang.startsWith("es") && v.name.toLowerCase().includes("female"))
             || voices.find(v => v.lang.startsWith("es"));
    if (voz) utterance.voice = voz;

    utterance.onstart = () => {
      setIsSpeaking(true);
      onStatusChangeRef.current?.("speaking");
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      onStatusChangeRef.current?.("idle");
    };
    utterance.onerror = (e) => {
      if (e.error !== "interrupted") {
        console.error("❌ Error TTS:", e.error);
      }
      setIsSpeaking(false);
      onStatusChangeRef.current?.("error");
    };

    synthRef.current.speak(utterance);
  };

  // ── API pública ──

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListeningRef.current) return;
    shouldRestartRef.current = true;
    try {
      recognitionRef.current.start();
      console.log("▶️ Iniciando escucha continua...");
    } catch (e) {
      console.error("Error al iniciar:", e.message);
    }
  }, []);

  const stopListening = useCallback(() => {
    shouldRestartRef.current = false;
    setIsActive(false);
    try {
      recognitionRef.current?.stop();
      console.log("⏹️ Escucha detenida");
    } catch (e) {}
  }, []);

  const speak = useCallback((text, options = {}) => {
    speakInternal(text, options);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    isListening,
    isSpeaking,
    isActive,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
