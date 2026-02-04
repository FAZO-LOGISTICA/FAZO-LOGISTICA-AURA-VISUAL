import React, { useState, useRef, useEffect } from "react";
import { resolverPreguntaFAZO } from "../core/FAZO_DataResolver";

// Backend AURA en la nube (Render)
const API = "https://aura-g5nw.onrender.com/aura";

export default function AURAChat({ onCommand }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  // ======================================================
  // Auto-scroll al último mensaje
  // ======================================================
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ======================================================
  // Enviar mensaje
  // ======================================================
  const enviar = async () => {
    if (!input.trim()) return;

    const texto = input;
    setInput("");

    // 1️⃣ Mostrar mensaje del usuario
    setMessages((prev) => [...prev, { role: "user", content: texto }]);

    // 2️⃣ INTENTO FAZO (LOCAL, DATOS REALES)
    const respuestaFAZO = resolverPreguntaFAZO(texto);
    if (respuestaFAZO) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: respuestaFAZO },
      ]);
      return;
    }

    // 3️⃣ NUBE (AURA EN RENDER)
    try {
      const history = [...messages, { role: "user", content: texto }];

      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();

      // 🔥 COMANDO FAZO (abrir módulos, etc)
      if (data.command && onCommand) {
        onCommand(data.command);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Sin respuesta" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Error de conexión con AURA en la nube.",
        },
      ]);
    }
  };

  // ======================================================
  // UI
  // ======================================================
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "rgba(2,6,23,0.9)",
      }}
    >
      {/* ================= MENSAJES ================= */}
      <div
        style={{
          flex: 1,
          padding: 12,
          overflowY: "auto",
          fontSize: 14,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 10,
              textAlign: m.role === "user" ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 12,
                maxWidth: "85%",
                background:
                  m.role === "user"
                    ? "#2563eb"
                    : "rgba(255,255,255,0.12)",
                color: "#000", // 👈 TEXTO NEGRO VISIBLE
                fontWeight: 500,
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* ================= INPUT ABAJO ================= */}
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
          placeholder="Escribe una orden para AURA…"
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "none",
            outline: "none",
            background: "#ffffff",
            color: "#000", // 👈 TEXTO NEGRO AL ESCRIBIR
            fontSize: 14,
          }}
        />

        <button
          onClick={enviar}
          style={{
            padding: "0 16px",
            borderRadius: 8,
            border: "none",
            background: "#22d3ee",
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
