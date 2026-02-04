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

    // Mostrar mensaje usuario
    setMessages((prev) => [
      ...prev,
      { role: "user", content: texto },
    ]);

    // ===============================
    // 🔥 DETECCIÓN FAZO LOCAL (CLAVE)
    // ===============================
    const comando = detectarComando(texto);

    if (comando) {
      console.log("⚡ COMANDO FAZO EJECUTADO:", comando);

      if (onCommand) onCommand(comando);

      // 👉 Respuesta LOCAL (NO IA)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `✅ Acción FAZO ejecutada: ${comando.tipo.replace("_", " ")}`,
        },
      ]);

      return; // 🚨 ESTO ES LO QUE FALTABA
    }

    // ===============================
    // 🌐 SOLO SI NO ES COMANDO → IA
    // ===============================
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

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "…",
        },
      ]);
    } catch {
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
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              background: m.role === "user" ? "#2563eb" : "#0f172a",
              color: "white",
              padding: 10,
              borderRadius: 6,
              marginBottom: 8,
              maxWidth: "90%",
            }}
          >
            {m.content}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", padding: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder="Escribe una orden (ej: abre aguaruta)"
          style={{
            flex: 1,
            padding: 10,
            background: "white",
            color: "black",
          }}
        />
        <button onClick={enviar} style={{ marginLeft: 8 }}>
          Enviar
        </button>
      </div>
    </div>
  );
}
