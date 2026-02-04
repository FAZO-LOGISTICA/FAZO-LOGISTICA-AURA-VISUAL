import React, { useState } from "react";

const API = "https://aura-g5nw.onrender.com/aura";

export default function AURAChat({ onCommand }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const enviar = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    const history = [...messages, userMsg];

    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();

      // 👉 comando FAZO OS
      if (data.command && onCommand) {
        onCommand(data.command);
      }

      // 👉 respuesta AURA
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Error al conectar con AURA." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0f172a",
        color: "#e5e7eb",
      }}
    >
      {/* HISTORIAL */}
      <div
        style={{
          flex: 1,
          padding: 12,
          overflowY: "auto",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 8,
              textAlign: m.role === "user" ? "right" : "left",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 8,
                maxWidth: "85%",
                background:
                  m.role === "user" ? "#2563eb" : "#1e293b",
                color: "#fff",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}

        {loading && (
          <div style={{ fontStyle: "italic", opacity: 0.6 }}>
            AURA pensando…
          </div>
        )}
      </div>

      {/* INPUT ABAJO */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: 10,
          borderTop: "1px solid #334155",
          background: "#020617",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder="Escribe o da una orden a AURA…"
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 6,
            border: "none",
            outline: "none",
            background: "#e5e7eb",
            color: "#000",   // 🔥 TEXTO NEGRO
            fontSize: 14,
          }}
        />

        <button
          onClick={enviar}
          style={{
            padding: "10px 16px",
            borderRadius: 6,
            border: "none",
            background: "#22c55e",
            color: "#000",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
