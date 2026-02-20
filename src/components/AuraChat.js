import React, { useState, useRef, useEffect } from "react";

const AURA_API_URL = "https://aura-g5nw.onrender.com/api/aura";

export default function AURAChat({ onCommand }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState("openai"); // IA por defecto
  const messagesEndRef = useRef(null);

  const autoScroll = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    autoScroll();
  }, [messages]);

  const enviar = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Llamar al backend
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

      // Si hay comando, ejecutarlo
      if (data.command) {
        onCommand(data.command);
      }

      // Agregar respuesta de AURA
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      console.error("Error al llamar a AURA:", error);
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Error: ${error.message}. Verifica que el backend esté activo.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* CONTENEDOR MENSAJES */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background:
                m.role === "user" ? "#3b82f6" : "rgba(255,255,255,0.1)",
              padding: "10px 14px",
              borderRadius: 12,
              maxWidth: "80%",
              color: "white",
              fontSize: 14,
              wordWrap: "break-word",
            }}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "rgba(255,255,255,0.1)",
              padding: "10px 14px",
              borderRadius: 12,
              color: "white",
              fontSize: 14,
            }}
          >
            <span>💭 AURA está pensando...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* SELECTOR DE IA */}
      <div
        style={{
          padding: "8px 16px",
          borderTop: "1px solid #334155",
          background: "#0f172a",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <label style={{ color: "#94a3b8", fontSize: 12 }}>IA:</label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          style={{
            padding: "4px 8px",
            borderRadius: 6,
            border: "1px solid #334155",
            background: "#1e293b",
            color: "white",
            fontSize: 12,
            cursor: "pointer",
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

      {/* INPUT FIJO ABAJO */}
      <div
        style={{
          padding: 16,
          borderTop: "1px solid #334155",
          display: "flex",
          gap: 8,
          background: "#0f172a",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && enviar()}
          placeholder="Escribe una orden para AURA..."
          disabled={loading}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #334155",
            outline: "none",
            color: "black",
            background: loading ? "#e5e7eb" : "white",
            cursor: loading ? "not-allowed" : "text",
          }}
        />

        <button
          onClick={enviar}
          disabled={loading}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            background: loading ? "#64748b" : "#3b82f6",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "500",
          }}
        >
          {loading ? "..." : "Enviar"}
        </button>
      </div>
    </>
  );
}
