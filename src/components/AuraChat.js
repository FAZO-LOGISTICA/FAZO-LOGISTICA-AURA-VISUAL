import React, { useState, useEffect, useRef } from "react";
import { detectarComando } from "../AURACommandDetector";

const API = "https://aura-g5nw.onrender.com/aura"; // backend AURA en la nube

export default function AURAChat({ onCommand }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "🧠 AURA en línea. ¿Qué necesitas?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // =========================
  // ENVÍO DE MENSAJE
  // =========================
  const enviar = async () => {
    if (!input.trim()) return;

    const texto = input.trim();
    setInput("");

    // Mostrar mensaje usuario
    setMessages((prev) => [...prev, { role: "user", content: texto }]);

    // =========================
    // 1️⃣ DETECTOR DE COMANDOS (FAZO)
    // =========================
    const comando = detectarComando(texto);

    if (comando) {
      // 👉 RESPUESTA VISUAL
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚡ Ejecutando comando FAZO…",
        },
      ]);

      // 👉 EJECUTA EN APP.JS
      if (onCommand) onCommand(comando);

      return; // ❗ NO PASA A LA IA
    }

    // =========================
    // 2️⃣ IA (solo si no es comando)
    // =========================
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({
              role: m.role === "assistant" ? "assistant" : "user",
              content: m.content,
            })),
            { role: "user", content: texto },
          ],
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "No pude responder eso.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Error conectando con AURA.",
        },
      ]);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0f172a",
        borderLeft: "1px solid #334155",
      }}
    >
      {/* MENSAJES */}
      <div
        style={{
          flex: 1,
          padding: 16,
          overflowY: "auto",
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
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 12,
                background:
                  m.role === "user" ? "#38bdf8" : "#1e293b",
                color: m.role === "user" ? "#000" : "#fff",
                maxWidth: "80%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT ABAJO */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: 12,
          borderTop: "1px solid #334155",
          background: "#020617",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder="Escribe o di un comando…"
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "none",
            outline: "none",
            color: "#000",          // 🔥 TEXTO NEGRO
            background: "#e5e7eb",  // 🔥 FONDO CLARO
          }}
        />
        <button
          onClick={enviar}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: "#22d3ee",
            color: "#000",
            fontWeight: "bold",
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
