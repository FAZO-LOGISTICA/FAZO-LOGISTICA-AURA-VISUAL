import React, { useState } from "react";
import { detectarComando } from "../AURACommandDetector";

const API = "https://aura-g5nw.onrender.com/aura";

export default function AURAChat({ onCommand }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const enviar = async () => {
    if (!input.trim()) return;

    // 1️⃣ DETECTAR COMANDO FAZO (PRIORIDAD ABSOLUTA)
    const comando = detectarComando(input);

    if (comando && onCommand) {
      onCommand(comando);

      setMessages((prev) => [
        ...prev,
        { role: "user", content: input },
        {
          role: "assistant",
          content: `✔️ Acción FAZO ejecutada: ${
            comando.module || comando.action
          }`,
        },
      ]);

      setInput("");
      return; // ⛔ NO PASA A IA
    }

    // 2️⃣ SI NO ES COMANDO → IA
    const history = [...messages, { role: "user", content: input }];
    setMessages(history);
    setInput("");

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.reply },
    ]);
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#0f172a",
        padding: 12,
      }}
    >
      {/* MENSAJES */}
      <div style={{ flex: 1, overflowY: "auto", marginBottom: 10 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              background: m.role === "user" ? "#2563eb" : "#1e293b",
              color: "#fff",
              padding: 10,
              borderRadius: 8,
              marginBottom: 6,
            }}
          >
            {m.content}
          </div>
        ))}
      </div>

      {/* INPUT ABAJO */}
      <div style={{ display: "flex", gap: 6 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder="Escribe un comando FAZO…"
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 6,
            border: "none",
            color: "#000", // 👈 LETRAS NEGRAS
          }}
        />
        <button onClick={enviar}>Enviar</button>
      </div>
    </div>
  );
}
