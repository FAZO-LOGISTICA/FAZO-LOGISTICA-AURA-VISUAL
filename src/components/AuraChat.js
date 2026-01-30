/* =====================================================
   AURAChat.js — PRODUCCIÓN REAL
   FAZO OS 2025
   Autor: Gustavo Oliva + Mateo IA
===================================================== */

import React, { useEffect, useRef, useState } from "react";

/* ================= CONFIG ================= */

const MAX_HISTORY = 15;
const RESPONSE_TIMEOUT = 12000;

const SAFE_FALLBACK =
  "Estoy operativo. Hubo una demora, pero sigo contigo. Reformula o continuamos.";

/* ================= BACKEND ================= */

const BACKEND_URL = "https://aura-g5nw.onrender.com";
const API_ENDPOINT = `${BACKEND_URL}/aura`;

/* ================= UTILS ================= */

const safeTrimHistory = (history) =>
  Array.isArray(history) ? history.slice(-MAX_HISTORY) : [];

/* ================= COMPONENT ================= */

export default function AURAChat({ onUserMessage = () => {} }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const abortControllerRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      clearTimeout(timeoutRef.current);
    };
  }, []);

  /* ================= SEND ================= */

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const textoUsuario = input.trim();

    // 🔥 AVISA AL CORE FAZO OS
    try {
      onUserMessage(textoUsuario);
    } catch (_) {}

    const userMessage = { role: "user", content: textoUsuario };
    const history = safeTrimHistory([...messages, userMessage]);

    setMessages(history);
    setInput("");
    setLoading(true);

    abortControllerRef.current = new AbortController();
    timeoutRef.current = setTimeout(
      () => abortControllerRef.current?.abort(),
      RESPONSE_TIMEOUT
    );

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          provider: "auto",
          messages: history,
        }),
      });

      if (!res.ok) throw new Error("Backend error");

      const data = await res.json();

      setMessages((prev) =>
        safeTrimHistory([
          ...prev,
          { role: "assistant", content: data.reply || SAFE_FALLBACK },
        ])
      );
    } catch {
      setMessages((prev) =>
        safeTrimHistory([
          ...prev,
          { role: "assistant", content: SAFE_FALLBACK },
        ])
      );
    } finally {
      setLoading(false);
      clearTimeout(timeoutRef.current);
    }
  };

  /* ================= UI ================= */

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, padding: 12, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              maxWidth: "80%",
              marginBottom: 8,
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "#2563eb" : "#1e293b",
              color: "#fff",
              padding: 10,
              borderRadius: 10,
            }}
          >
            {m.content}
          </div>
        ))}
        {loading && <div>Pensando…</div>}
      </div>

      <div style={{ display: "flex", padding: 10 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Habla con AURA…"
          style={{ flex: 1 }}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}
