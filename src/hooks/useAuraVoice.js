// ========================================================
//   useAuraVoice.js — FAZO OS 2025
//   v2.1 — Palabra clave "aura" + envío automático 3s
// ========================================================

import { useState, useRef, useCallback, useEffect } from "react";

export function useAuraVoice({
  onTranscript,
  onStatusChange,
  activationWord = "aura"
}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking]   = useState(false);
  const [isActive, setIsActive]       = useState(false);
  const [transcript, setTranscript]   = useState("");

  const recognitionRef   = useRef(null);
  const synthRef         = useRef(window.speechSynthesis);
  const isListeningRef   = useRef(false);
  const isActiveRef      = useRef(false);
  const shouldRestartRef = useRef(false);
  const silenceTimerRef  = useRef(null);    // timer 3s
  const acumuladoRef     = useRef("");      // texto acumulado tras "aura"

  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);
  useEffect(() => { isActiveRef.current    = isActive;    }, [isActive]);

  const onTranscriptRef   = useRef(onTranscript);
  const onStatusChangeRef = useRef(onStatusChange);
  useEffect(() => { onTranscriptRef.current   = onTranscript;   }, [onTranscript]);
  useEffect(() => { onStatusChangeRef.current = onStatusChange; }, [onStatusChange]);

  const limpiarTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const enviarAcumulado = useCallback(() => {
    limpiarTimer();
    const texto = acumuladoRef.current.trim();
    if (texto) {
      console.log("✅ Enviando a AURA:", texto);
      onTranscriptRef.current?.(texto);
      acumuladoRef.current = "";
      setTranscript("");
      setIsActive(false);
      isActiveRef.current = false;
    }
  }, []);

  const enviarAcumuladoRef = useRef(enviarAcumulado);
  useEffect(() => { enviarAcumuladoRef.current = enviarAcumulado; }, [enviarAcumulado]);

  // ── TTS interno ──
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
    utterance.onstart = () => { setIsSpeaking(true);  onStatusChangeRef.current?.("speaking"); };
    utterance.onend   = () => { setIsSpeaking(false); onStatusChangeRef.current?.("idle"); };
    utterance.onerror = (e) => {
      if (e.error !== "interrupted") console.error("❌ TTS:", e.error);
      setIsSpeaking(false);
      onStatusChangeRef.current?.("idle");
    };
    synthRef.current.speak(utterance);
  };

  // ── Recognition UNA sola vez ──
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("❌ Navegador no soporta reconocimiento de voz");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang           = "es-CL";
    recognition.continuous     = false;
    recognition.interimResults = true;  // para mostrar texto en tiempo real

    recognition.onstart = () => {
      console.log("🎤 Reconocimiento iniciado");
      setIsListening(true);
      onStatusChangeRef.current?.("listening");
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final   = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t + " ";
        else interim += t;
      }

      // Mostrar en tiempo real
      if (interim) setTranscript(interim);

      if (!final.trim()) return;

      const texto = final.trim();
      const lower = texto.toLowerCase();
      console.log("📝 Escuché:", texto);

      // ── Detectar palabra clave ──
      if (!isActiveRef.current && lower.includes(activationWord)) {
        console.log(`🎯 "${activationWord}" detectado`);
        setIsActive(true);
        isActiveRef.current = true;
        acumuladoRef.current = "";
        onStatusChangeRef.current?.("active");
        speakInternal("¿Sí?");
        return;
      }

      // ── Si está activo, acumular y arrancar timer 3s ──
      if (isActiveRef.current) {
        acumuladoRef.current += texto + " ";
        setTranscript(acumuladoRef.current.trim());
        console.log("📝 Acumulado:", acumuladoRef.current.trim());

        // Reiniciar timer — si pasan 3s sin más habla, enviar
        limpiarTimer();
        silenceTimerRef.current = setTimeout(() => {
          enviarAcumuladoRef.current();
        }, 3000);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech") {
        console.log("⏸️ Sin habla");
        // Si hay acumulado, enviar
        if (isActiveRef.current && acumuladoRef.current.trim()) {
          enviarAcumuladoRef.current();
        }
      } else {
        console.error("❌ Error:", event.error);
        onStatusChangeRef.current?.("error");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("🛑 Reconocimiento terminado");
      setIsListening(false);
      onStatusChangeRef.current?.("idle");

      if (shouldRestartRef.current) {
        setTimeout(() => {
          try { recognition.start(); }
          catch (e) { console.warn("Reinicio fallido:", e.message); }
        }, 300);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldRestartRef.current = false;
      limpiarTimer();
      try { recognition.stop(); } catch (_) {}
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListeningRef.current) return;
    shouldRestartRef.current = true;
    try {
      recognitionRef.current.start();
      console.log("▶️ Escucha continua iniciada");
    } catch (e) {
      console.error("Error al iniciar:", e.message);
    }
  }, []);

  const stopListening = useCallback(() => {
    shouldRestartRef.current = false;
    limpiarTimer();
    if (acumuladoRef.current.trim()) enviarAcumuladoRef.current();
    setIsActive(false);
    isActiveRef.current = false;
    try { recognitionRef.current?.stop(); } catch (_) {}
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
