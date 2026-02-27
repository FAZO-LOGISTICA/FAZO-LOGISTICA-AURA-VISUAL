// ========================================================
//   useAuraVoice.js — FAZO OS 2025
//   Sistema de voz completo para AURA
//   Reconocimiento + TTS + Activación por palabra clave
// ========================================================

import { useState, useRef, useCallback, useEffect } from "react";

export function useAuraVoice({ 
  onTranscript,           // Callback cuando hay texto transcrito
  onStatusChange,         // Callback cuando cambia el estado
  activationWord = "aura" // Palabra de activación
}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isActive, setIsActive] = useState(false); // Activado por palabra clave
  const [transcript, setTranscript] = useState("");
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Inicializar Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("❌ Navegador no soporta reconocimiento de voz");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-CL";
    recognition.continuous = true; // Reconocimiento continuo
    recognition.interimResults = true; // Resultados parciales

    recognition.onstart = () => {
      console.log("🎤 Reconocimiento iniciado");
      setIsListening(true);
      onStatusChange?.("listening");
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece + " ";
        } else {
          interimTranscript += transcriptPiece;
        }
      }

      // Actualizar transcript en tiempo real
      setTranscript(interimTranscript || finalTranscript);

      // Detectar palabra de activación
      const lowerText = (finalTranscript || interimTranscript).toLowerCase();
      
      if (!isActive && lowerText.includes(activationWord)) {
        console.log(`🎯 Palabra clave "${activationWord}" detectada`);
        setIsActive(true);
        onStatusChange?.("active");
        speak("¿Sí?"); // Confirmación de activación
      }

      // Si está activo y hay transcript final, procesar
      if (isActive && finalTranscript.trim()) {
        console.log("📝 Transcript final:", finalTranscript);
        onTranscript?.(finalTranscript.trim());
        setTranscript("");
        setIsActive(false); // Desactivar después de procesar
      }
    };

    recognition.onerror = (event) => {
      console.error("❌ Error de reconocimiento:", event.error);
      
      if (event.error === "no-speech") {
        console.log("⏸️ No se detectó habla");
      }
      
      onStatusChange?.("error");
    };

    recognition.onend = () => {
      console.log("🛑 Reconocimiento detenido");
      setIsListening(false);
      onStatusChange?.("idle");
      
      // Reiniciar automáticamente si estaba activo
      if (isListening) {
        try {
          recognition.start();
        } catch (e) {
          console.warn("No se pudo reiniciar reconocimiento");
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isListening, activationWord, onTranscript, onStatusChange]);

  // Iniciar escucha
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        console.log("▶️ Iniciando reconocimiento...");
      } catch (error) {
        console.error("Error al iniciar:", error);
      }
    }
  }, [isListening]);

  // Detener escucha
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsActive(false);
      console.log("⏹️ Deteniendo reconocimiento...");
    }
  }, [isListening]);

  // Text-to-Speech
  const speak = useCallback((text, options = {}) => {
    if (!synthRef.current) {
      console.warn("❌ TTS no disponible");
      return;
    }

    // Cancelar speech anterior
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configuración de voz
    utterance.lang = "es-CL";
    utterance.rate = options.rate || 1.0; // Velocidad
    utterance.pitch = options.pitch || 1.0; // Tono
    utterance.volume = options.volume || 1.0; // Volumen

    // Intentar usar una voz femenina si está disponible
    const voices = synthRef.current.getVoices();
    const spanishVoice = voices.find(
      (voice) => voice.lang.startsWith("es") && voice.name.includes("Female")
    );
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    utterance.onstart = () => {
      console.log("🔊 AURA hablando:", text);
      setIsSpeaking(true);
      onStatusChange?.("speaking");
    };

    utterance.onend = () => {
      console.log("🔇 AURA terminó de hablar");
      setIsSpeaking(false);
      onStatusChange?.("idle");
    };

    utterance.onerror = (event) => {
      console.error("❌ Error TTS:", event.error);
      setIsSpeaking(false);
      onStatusChange?.("error");
    };

    synthRef.current.speak(utterance);
  }, [onStatusChange]);

  // Detener speech
  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      console.log("🔇 Speech cancelado");
    }
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
