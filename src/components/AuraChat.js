// ======================================================
// AURAChat.js — AURA OPERATIVA REAL (FAZO OS)
// Abre sistemas + responde con FAZO_DATA + fallback IA
// ======================================================

import React, { useState } from "react";
import { FAZO_DATA } from "../FAZO_DATA";

const BACKEND = "https://aura-g5nw.onrender.com/aura"; // IA nube (fallback)

export default function AURAChat({ onCommand }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "🧠 AURA operativa. ¿Qué necesitas?" },
  ]);
  const [input, setInput] = useState("");

  // ======================================================
  // 🔍 INTÉRPRETE FAZO (PRIORIDAD ABSOLUTA)
  // ======================================================
  function procesarFAZO(texto) {
    const t = texto.toLowerCase();

    // ---- ABRIR AGUARUTA ----
    if (
      t.includes("abre aguaruta") ||
      t.includes("abrir aguaruta") ||
      t.includes("ir a aguaruta")
    ) {
      window.open("https://aguaruta.netlify.app", "_blank");
      return "🚚 Abriendo AguaRuta en una nueva pestaña.";
    }

    // ---- DATOS REALES ----
    if (t.includes("litros")) {
      const total = FAZO_DATA.camiones.reduce(
        (sum, c) => sum + (c.litros || 0),
        0
      );
      return total
        ? `💧 Total entregado: ${total.toLocaleString("es-CL")} litros.`
        : "⚠️ Aún no tengo datos de litros.";
    }

    if (t.includes("camion") || t.includes("camión")) {
      if (!FAZO_DATA.camiones.length)
        return "⚠️ No hay camiones cargados aún.";
      return (
        "🚛 Camiones activos:\n" +
        FAZO_DATA.camiones
          .map((c) => `• ${c.nombre}: ${c.litros} L`)
          .join("\n")
      );
    }

    if (t.includes("estado")) {
      return "✅ FAZO OS operativo. Datos sincronizados correctamente.";
    }

    return null; // no era FAZO → IA
  }

  // ======================================================
  // 🚀 ENVÍO DE MENSAJE
  // ======================================================
  async function enviar() {
    if (!input.trim()) return;

    const texto = input;
    setInput("");

    setMessages((m) => [...m, { role: "user", content: texto }]);

    // 1️⃣ INTENTO FAZO LOCAL
    const respuestaFAZO = procesarFAZO(texto);
    if (respuestaFAZO) {
      setMessages((m) => [...m, { role: "assistant", content: respuestaFAZO }]);
      return;
    }

    // 2️⃣ FALLBACK IA NUBE
    try {
      const res = await fetch(BACKEND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: texto }],
        }),
      });

      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply || "Sin respuesta" },
      ]);

      if (data.command && onCommand) onCommand(data.command);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "⚠️ No pude conectar con la IA.",
        },
      ]);
    }
  }

  // ======================================================
  // 🖥️ UI (VISIBLE Y FUNCIONAL)
  // ======================================================
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#020617",
        color: "#fff",
      }}
    >
      {/* HISTORIAL */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
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
                  m.role === "user" ? "#2563eb" : "#0f172a",
                color: "#fff",
                maxWidth: "85%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
      </div>

      {/* INPUT ABAJO */}
      <div
        style={{
          display: "flex",
          padding: 10,
          borderTop: "1px solid #334155",
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
            color: "#000",          // 🔥 TEXTO NEGRO (VISIBLE)
          }}
        />
        <button
          onClick={enviar}
          style={{
            marginLeft: 8,
            padding: "0 16px",
            borderRadius: 8,
            background: "#22d3ee",
            border: "none",
            fontWeight: "bold",
          }}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
