import React, { useState } from "react";
import { detectarComando } from "../AURACommandDetector";

const API = "https://aura-g5nw.onrender.com/aura";

export default function AURAChat({ onCommand }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const enviar = async () => {
    if (!input.trim() || loading) return;

    const texto = input;
    setInput("");

    // 👉 mostrar mensaje del usuario
    setMessages((prev) => [
      ...prev,
      { role: "user", content: texto },
    ]);

    // 🔥 DETECCIÓN DE COMANDO FAZO (LOCAL)
    const comando = detectarComando(texto);
    if (comando && onCommand) {
      console.log("⚡ Comando FAZO detectado:", comando);
      onCommand(comando);
    }

    setLoading(true);

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: texto }],
        }),
      });

      const data = await res.json();

      // 👉 mostrar respuesta de AURA
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "…" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Error de conexión con AURA",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#020617",
        borderLeft: "1px solid #0ea5e9",
      }}
    >
      {/* ================= MENSAJES ================= */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 8,
              padding: "8px 10px",
              borderRadius: 6,
              maxWidth: "90%",
              background:
                m.role === "user"
                  ? "#0ea5e9"
                  : "#0f172a",
              color: "white",
              alignSelf:
                m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div style={{ color: "#94a3b8", fontSize: 12 }}>
            AURA está pensando…
          </div>
        )}
      </div>

      {/* ================= INPUT ABAJO ================= */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #0ea5e9",
          background: "#020617",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder="Escribe una orden… (ej: abre aguaruta)"
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: 6,
            border: "1px solid #64748b",
            background: "white",
            color: "black", // 👈 CLAVE: letras visibles
            outline: "none",
          }}
        />

        <button
          onClick={enviar}
          style={{
            marginLeft: 8,
            padding: "10px 14px",
            background: "#0ea5e9",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
