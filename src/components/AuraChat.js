import React, { useState, useRef, useEffect } from "react";
import { useAuraVoice } from "../hooks/useAuraVoice";

const AURA_API_URL = "https://aura-g5nw.onrender.com/api/aura";

export default function AURAChat({ onCommand }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState("openai");
  const [orbStatus, setOrbStatus] = useState("idle");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef(null);

  // Hook de voz
  const {
    isListening,
    isSpeaking,
    isActive,
    transcript,
    startListening,
    stopListening,
    speak,
  } = useAuraVoice({
    onTranscript: (text) => {
      console.log("📝 Transcript recibido:", text);
      setInput(text);
      setTimeout(() => {
        if (text.trim()) {
          enviarMensaje(text);
        }
      }, 1000);
    },
    onStatusChange: (status) => {
      console.log("🔄 Status change:", status);
      if (status === "listening") setOrbStatus("listening");
      else if (status === "speaking") setOrbStatus("speaking");
      else if (status === "active") setOrbStatus("listening");
      else if (status === "error") setOrbStatus("error");
      else setOrbStatus("idle");
    },
    activationWord: "aura",
  });

  const autoScroll = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    autoScroll();
  }, [messages]);

  useEffect(() => {
    if (transcript && isActive) {
      setInput(transcript);
    }
  }, [transcript, isActive]);

  const enviarMensaje = async (texto = input) => {
    if (!texto.trim() || loading) return;

    const userMessage = { role: "user", content: texto };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setOrbStatus("thinking");

    try {
      const response = await fetch(AURA_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: provider,
          messages: [...messages, userMessage],
          audio: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.command) {
        onCommand(data.command);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);

      if (voiceEnabled) {
        speak(data.reply);
      } else {
        setOrbStatus("speaking");
        setTimeout(() => setOrbStatus("idle"), 2000);
      }
    } catch (error) {
      console.error("Error al llamar a AURA:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Error: ${error.message}. Verifica que el backend esté activo.`,
        },
      ]);

      setOrbStatus("error");
      setTimeout(() => setOrbStatus("idle"), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleOrbClick = () => {
    if (!voiceEnabled) {
      setVoiceEnabled(true);
      startListening();
      speak("Sistema de voz activado. Di 'Aura' para comenzar.");
    } else {
      if (isListening) {
        stopListening();
        setOrbStatus("idle");
      } else {
        startListening();
      }
    }
  };

  const toggleVoice = () => {
    if (voiceEnabled) {
      stopListening();
      setVoiceEnabled(false);
      setOrbStatus("idle");
    } else {
      setVoiceEnabled(true);
      startListening();
      speak("Voz activada");
    }
  };

  return (
    <div
      className="h-screen flex flex-col"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* HEADER FIJO */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(100, 200, 255, 0.2)",
          background: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(10px)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background:
                  orbStatus === "error" ? "#ef4444" :
                  orbStatus === "thinking" ? "#a855f7" :
                  orbStatus === "speaking" ? "#22c55e" :
                  orbStatus === "listening" ? "#ec4899" : "#06b6d4",
                boxShadow: `0 0 12px ${
                  orbStatus === "error" ? "#ef4444" :
                  orbStatus === "thinking" ? "#a855f7" :
                  orbStatus === "speaking" ? "#22c55e" :
                  orbStatus === "listening" ? "#ec4899" : "#06b6d4"
                }`,
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 600,
                background: "linear-gradient(90deg, #06b6d4, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "0.5px",
              }}
            >
              AURA • Sistema Inteligente
            </h2>
          </div>

          {voiceEnabled && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 12px",
                borderRadius: 20,
                background: "rgba(236, 72, 153, 0.2)",
                border: "1px solid rgba(236, 72, 153, 0.4)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#ec4899",
                  fontWeight: 500,
                }}
              >
                🎤 VOZ ACTIVA
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CONTENEDOR MENSAJES CON SCROLL INDEPENDIENTE */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          position: "relative",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#64748b",
              textAlign: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                fontSize: 48,
                filter: "drop-shadow(0 0 20px rgba(6, 182, 212, 0.5))",
              }}
            >
              🤖
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: "#94a3b8" }}>
                Buenos días. Soy AURA.
              </div>
              <div style={{ fontSize: 14, opacity: 0.7 }}>
                ¿En qué puedo asistirte hoy?
              </div>
            </div>
            <div style={{ fontSize: 12, opacity: 0.5, marginTop: 20 }}>
              💬 Escribe o 🎤 Activa el micrófono
            </div>
            <div style={{ fontSize: 11, opacity: 0.4 }}>
              Prueba: "Abre AguaRuta" • "Abre mapas" • "Muestra gráficos"
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background:
                m.role === "user"
                  ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                  : "rgba(30, 41, 59, 0.8)",
              padding: "12px 16px",
              borderRadius: 16,
              maxWidth: "80%",
              color: "white",
              fontSize: 14,
              wordWrap: "break-word",
              border: m.role === "assistant" ? "1px solid rgba(100, 200, 255, 0.2)" : "none",
              boxShadow:
                m.role === "user"
                  ? "0 4px 12px rgba(59, 130, 246, 0.3)"
                  : "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "rgba(30, 41, 59, 0.8)",
              padding: "12px 16px",
              borderRadius: 16,
              color: "#94a3b8",
              fontSize: 14,
              border: "1px solid rgba(100, 200, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#a855f7",
                animation: "pulse 1s ease-in-out infinite",
              }}
            />
            <span>AURA está procesando...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* SELECTOR DE IA */}
      <div
        style={{
          padding: "12px 20px",
          borderTop: "1px solid rgba(100, 200, 255, 0.2)",
          background: "rgba(15, 23, 42, 0.95)",
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <label style={{ color: "#94a3b8", fontSize: 12, fontWeight: 500 }}>
          MOTOR IA:
        </label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid rgba(100, 200, 255, 0.3)",
            background: "rgba(30, 41, 59, 0.8)",
            color: "white",
            fontSize: 12,
            cursor: "pointer",
            outline: "none",
            fontWeight: 500,
          }}
        >
          <option value="openai">OpenAI (GPT-4o-mini)</option>
          <option value="claude">Claude (Sonnet 3.5)</option>
          <option value="groq">Groq (Llama 3.1)</option>
          <option value="deepseek">DeepSeek</option>
          <option value="gemini">Gemini (Flash)</option>
          <option value="cohere">Cohere (Command-R)</option>
        </select>
      </div>

      {/* INPUT ESTILO WHATSAPP */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid rgba(100, 200, 255, 0.2)",
          display: "flex",
          gap: 12,
          background: "rgba(15, 23, 42, 0.95)",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && enviarMensaje()}
          placeholder={
            isActive
              ? "🎤 Escuchando..."
              : "Escribe un comando o pregunta para AURA..."
          }
          disabled={loading}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: 24,
            border: isActive
              ? "1px solid rgba(236, 72, 153, 0.5)"
              : "1px solid rgba(100, 200, 255, 0.3)",
            outline: "none",
            background: "rgba(30, 41, 59, 0.8)",
            color: "white",
            fontSize: 14,
            cursor: loading ? "not-allowed" : "text",
            transition: "all 0.2s",
          }}
        />

        {/* BOTÓN MIC ESTILO WHATSAPP */}
        <button
          onClick={toggleVoice}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: voiceEnabled
              ? "linear-gradient(135deg, #ec4899 0%, #ef4444 100%)"
              : "rgba(100, 116, 139, 0.3)",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            transition: "all 0.2s",
            boxShadow: voiceEnabled
              ? "0 2px 8px rgba(236, 72, 153, 0.4)"
              : "none",
            flexShrink: 0,
          }}
          title={voiceEnabled ? "Desactivar voz" : "Activar voz"}
        >
          🎤
        </button>

        <button
          onClick={() => enviarMensaje()}
          disabled={loading}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: loading
              ? "rgba(100, 116, 139, 0.5)"
              : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: "bold",
            transition: "all 0.2s",
            boxShadow: loading ? "none" : "0 2px 8px rgba(59, 130, 246, 0.4)",
            flexShrink: 0,
          }}
        >
          {loading ? "●●●" : "➤"}
        </button>
      </div>

      {/* ORBE FLOTANTE ELIMINADO */}
    </div>
  );
}
