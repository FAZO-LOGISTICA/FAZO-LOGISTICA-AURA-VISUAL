import React, { useState } from "react";

const API = "https://aura-g5nw.onrender.com/aura";

export default function AURAChat({ onCommand }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const enviar = async () => {
    if (!input.trim()) return;

    const history = [...messages, { role: "user", content: input }];
    setMessages(history);
    setInput("");

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();

      // 👉 comando FAZO
      if (data.command && onCommand) {
        onCommand(data.command);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Sin respuesta." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Error conectando con AURA." },
      ]);
    }
  };

  return (
    <div className="aura-chat aura-chat-container">
      {/* HISTORIAL */}
      <div className="aura-chat-messages">
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div
              style={{
                background: m.role === "user" ? "#2563eb" : "#1e293b",
                color: "#ffffff",
                padding: "8px 12px",
                borderRadius: 8,
                maxWidth: "90%",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT ABAJO */}
      <div className="aura-chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder="Escribe una orden para AURA…"
        />
        <button onClick={enviar}>Enviar</button>
      </div>
    </div>
  );
}
