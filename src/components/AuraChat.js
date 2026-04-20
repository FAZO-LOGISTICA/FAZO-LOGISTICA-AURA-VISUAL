import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuraVoice } from "../hooks/useAuraVoice";
import MercadoPublicoPanel from "./MercadoPublicoPanel";

const AURA_API_URL     = "https://aura-g5nw.onrender.com/api/aura";
const AURA_BACKEND_URL = "https://aura-g5nw.onrender.com";

export default function AURAChat({ onCommand }) {
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [provider, setProvider]     = useState("openai");
  const [orbStatus, setOrbStatus]   = useState("idle");
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Estados Mercado Público
  const [mpResultados, setMpResultados] = useState([]);
  const [mpQuery, setMpQuery]           = useState("");
  const [mpTipo, setMpTipo]             = useState("licitacion");
  const [mpLoading, setMpLoading]       = useState(false);

  const messagesEndRef = useRef(null);
  const messagesRef    = useRef(messages);
  const loadingRef     = useRef(loading);
  const providerRef    = useRef(provider);

  useEffect(() => { messagesRef.current = messages;  }, [messages]);
  useEffect(() => { loadingRef.current  = loading;   }, [loading]);
  useEffect(() => { providerRef.current = provider;  }, [provider]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mpResultados]);

  // ── Handler Mercado Público ────────────────────────────────
  const handleMercadoPublico = useCallback(async (comando) => {
    const { query, tipo = "licitacion" } = comando;

    setMpLoading(true);
    setMpQuery(query);
    setMpTipo(tipo);
    setMpResultados([]);

    const endpoint = tipo === "convenio-marco"
      ? `/aura/convenio-marco?q=${encodeURIComponent(query)}`
      : `/aura/licitaciones?q=${encodeURIComponent(query)}`;

    try {
      const res  = await fetch(`${AURA_BACKEND_URL}${endpoint}`);
      const data = await res.json();

      if (data.error) {
        setMpLoading(false);
        return `❌ Error Mercado Público: ${data.error}`;
      }

      setMpResultados(data.resultados || []);
      setMpLoading(false);

      const label = tipo === "convenio-marco" ? "productos en Convenio Marco" : "licitaciones";
      if (!data.total || data.total === 0) {
        return `🏛️ No encontré ${label} para "${query}". Intenta con otros términos.`;
      }
      return `🏛️ Encontré ${data.total} ${label} para "${query}". Mostrando resultados.`;

    } catch (err) {
      setMpLoading(false);
      return `❌ Error al consultar Mercado Público: ${err.message}`;
    }
  }, []);

  // ── Enviar mensaje ─────────────────────────────────────────
  const enviarMensaje = useCallback(async (texto) => {
    const textoFinal = (texto || "").trim();
    if (!textoFinal || loadingRef.current) return;

    const userMessage = { role: "user", content: textoFinal };
    const historial   = messagesRef.current;

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setOrbStatus("thinking");

    try {
      const response = await fetch(AURA_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: providerRef.current,
          messages: [...historial, userMessage],
          audio: false,
        }),
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);

      const data = await response.json();

      // ── Mercado Público: resolver en frontend ──
      if (data.command?.type === "BUSCAR_LICITACIONES") {
        const respuestaMp = await handleMercadoPublico(data.command);
        setMessages(prev => [...prev, { role: "assistant", content: respuestaMp }]);
        setOrbStatus("idle");
        setLoading(false);
        if (voiceEnabledRef.current) speak(respuestaMp);
        return;
      }

      // ── Resto de comandos pasan al padre (App.js) ──
      if (data.command) onCommand?.(data.command);

      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      setOrbStatus("idle");

      if (voiceEnabledRef.current) speak(data.reply);

    } catch (error) {
      console.error("Error AURA:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `❌ Error: ${error.message}`,
      }]);
      setOrbStatus("error");
      setTimeout(() => setOrbStatus("idle"), 3000);
    } finally {
      setLoading(false);
    }
  }, [onCommand, handleMercadoPublico]); // eslint-disable-line

  const enviarMensajeRef = useRef(enviarMensaje);
  useEffect(() => { enviarMensajeRef.current = enviarMensaje; }, [enviarMensaje]);

  const voiceEnabledRef = useRef(voiceEnabled);
  useEffect(() => { voiceEnabledRef.current = voiceEnabled; }, [voiceEnabled]);

  // ── Hook de voz ──────────────────────────────────────────
  const { isActive, transcript, startListening, stopListening, speak } = useAuraVoice({
    onTranscript: useCallback((text) => {
      console.log("🎤 Voz recibida:", text);
      setInput(text);
      enviarMensajeRef.current(text);
    }, []),
    onStatusChange: useCallback((status) => {
      console.log("🔄 Status:", status);
      if (status === "listening")     setOrbStatus("listening");
      else if (status === "speaking") setOrbStatus("speaking");
      else if (status === "active")   setOrbStatus("listening");
      else if (status === "error")    setOrbStatus("error");
      else                            setOrbStatus("idle");
    }, []),
    activationWord: "aura",
  });

  useEffect(() => {
    if (transcript && isActive) setInput(transcript);
  }, [transcript, isActive]);

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

  const orbColor = {
    error: "#ef4444", thinking: "#a855f7",
    speaking: "#22c55e", listening: "#ec4899"
  }[orbStatus] || "#06b6d4";

  return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    }}>
      {/* HEADER */}
      <div style={{
        padding: "16px 20px", borderBottom: "1px solid rgba(100,200,255,0.2)",
        background: "rgba(15,23,42,0.95)", backdropFilter: "blur(10px)", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 12, height: 12, borderRadius: "50%",
              background: orbColor, boxShadow: `0 0 12px ${orbColor}`,
              animation: "pulse 2s ease-in-out infinite",
            }} />
            <h2 style={{
              margin: 0, fontSize: 18, fontWeight: 600,
              background: "linear-gradient(90deg, #06b6d4, #3b82f6)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              AURA • Sistema Inteligente
            </h2>
          </div>
          {voiceEnabled && (
            <div style={{
              padding: "6px 12px", borderRadius: 20,
              background: "rgba(236,72,153,0.2)", border: "1px solid rgba(236,72,153,0.4)",
              fontSize: 12, color: "#ec4899", fontWeight: 500,
            }}>
              🎤 VOZ ACTIVA
            </div>
          )}
        </div>
      </div>

      {/* MENSAJES */}
      <div style={{
        flex: 1, overflowY: "scroll", overflowX: "hidden",
        padding: "20px", display: "flex", flexDirection: "column",
        gap: 12, minHeight: 0,
      }}>
        {messages.length === 0 && !mpResultados.length && !mpLoading && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: "100%", color: "#64748b",
            textAlign: "center", gap: 16,
          }}>
            <div style={{ fontSize: 48, filter: "drop-shadow(0 0 20px rgba(6,182,212,0.5))" }}>🤖</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: "#94a3b8" }}>
                Buenos días. Soy AURA.
              </div>
              <div style={{ fontSize: 14, opacity: 0.7 }}>¿En qué puedo asistirte hoy?</div>
            </div>
            <div style={{ fontSize: 12, opacity: 0.5, marginTop: 20 }}>
              💬 Escribe o 🎤 Activa el micrófono
            </div>
            <div style={{ fontSize: 11, opacity: 0.4, lineHeight: 1.8 }}>
              "Abre AguaRuta" • "Abre mapas" • "Muestra gráficos"<br/>
              "Busca licitaciones de ropa de invierno"<br/>
              "Busca convenio marco de herramientas"
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            background: m.role === "user"
              ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
              : "rgba(30,41,59,0.8)",
            padding: "12px 16px", borderRadius: 16, maxWidth: "80%",
            color: "white", fontSize: 14, wordWrap: "break-word",
            border: m.role === "assistant" ? "1px solid rgba(100,200,255,0.2)" : "none",
            boxShadow: m.role === "user"
              ? "0 4px 12px rgba(59,130,246,0.3)"
              : "0 4px 12px rgba(0,0,0,0.3)",
          }}>
            {m.content}
          </div>
        ))}

        {loading && (
          <div style={{
            alignSelf: "flex-start", background: "rgba(30,41,59,0.8)",
            padding: "12px 16px", borderRadius: 16, color: "#94a3b8",
            fontSize: 14, border: "1px solid rgba(100,200,255,0.2)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#a855f7", animation: "pulse 1s ease-in-out infinite",
            }} />
            <span>AURA está procesando...</span>
          </div>
        )}

        {/* Panel Mercado Público */}
        {(mpResultados.length > 0 || mpLoading) && (
          <MercadoPublicoPanel
            resultados={mpResultados}
            query={mpQuery}
            tipo={mpTipo}
            loading={mpLoading}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* SELECTOR IA */}
      <div style={{
        padding: "12px 20px", borderTop: "1px solid rgba(100,200,255,0.2)",
        background: "rgba(15,23,42,0.95)", display: "flex",
        gap: 8, alignItems: "center", flexShrink: 0,
      }}>
        <label style={{ color: "#94a3b8", fontSize: 12, fontWeight: 500 }}>MOTOR IA:</label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          style={{
            padding: "6px 12px", borderRadius: 8,
            border: "1px solid rgba(100,200,255,0.3)",
            background: "rgba(30,41,59,0.8)", color: "white",
            fontSize: 12, cursor: "pointer", outline: "none", fontWeight: 500,
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

      {/* INPUT */}
      <div style={{
        padding: "16px 20px", borderTop: "1px solid rgba(100,200,255,0.2)",
        display: "flex", gap: 12, background: "rgba(15,23,42,0.95)",
        alignItems: "center", flexShrink: 0,
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && enviarMensaje(input)}
          placeholder={isActive ? "🎤 Escuchando..." : "Escribe un comando o pregunta para AURA..."}
          disabled={loading}
          style={{
            flex: 1, padding: "12px 16px", borderRadius: 24,
            border: isActive ? "1px solid rgba(236,72,153,0.5)" : "1px solid rgba(100,200,255,0.3)",
            outline: "none", background: "rgba(30,41,59,0.8)",
            color: "white", fontSize: 14,
            cursor: loading ? "not-allowed" : "text", transition: "all 0.2s",
          }}
        />

        <button
          onClick={toggleVoice}
          style={{
            width: 36, height: 36, borderRadius: "50%", border: "none",
            background: voiceEnabled
              ? "linear-gradient(135deg, #ec4899 0%, #ef4444 100%)"
              : "rgba(100,116,139,0.3)",
            color: "white", cursor: "pointer", fontSize: 16, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: voiceEnabled ? "0 2px 8px rgba(236,72,153,0.4)" : "none",
          }}
          title={voiceEnabled ? "Desactivar voz" : "Activar voz"}
        >
          🎤
        </button>

        <button
          onClick={() => enviarMensaje(input)}
          disabled={loading}
          style={{
            width: 36, height: 36, borderRadius: "50%", border: "none",
            background: loading
              ? "rgba(100,116,139,0.5)"
              : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            color: "white", cursor: loading ? "not-allowed" : "pointer",
            fontSize: 16, fontWeight: "bold", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: loading ? "none" : "0 2px 8px rgba(59,130,246,0.4)",
          }}
        >
          {loading ? "···" : "➤"}
        </button>
      </div>
    </div>
  );
}
