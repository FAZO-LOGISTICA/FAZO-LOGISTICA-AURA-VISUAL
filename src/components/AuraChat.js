/* =====================================================
   AURAChat.js — FAZO OS PRODUCCIÓN REAL
   Autor: Gustavo Oliva + Mateo IA
===================================================== */

import React, { useEffect, useRef, useState } from "react";

const MAX_HISTORY = 15;
const RESPONSE_TIMEOUT = 12000;

const SAFE_FALLBACK =
  "Estoy operativo. Hubo una demora, pero sigo contigo.";

const BACKEND_URL = "https://aura-g5nw.onrender.com";
const API_ENDPOINT = `${BACKEND_URL}/aura`;

const safeTrimHistory = (h) =>
  Array.isArray(h) ? h.slice(-MAX_HISTORY) : [];

export default function AURAChat({ onUserMessage = () => {} }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const abortRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const texto = input.trim();
    onUserMessage(texto);

    const history = safeTrimHistory([
      ...messages,
      { role: "user", content: texto },
    ]);

    setMessages(history);
    setInput("");
    setLoading(true);

    abortRef.current = new AbortController();
    timeoutRef.current = setTimeout(
      () => abortRef.current?.abort(),
      RESPONSE_TIMEOUT
    );

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current.signal,
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
          {
            role: "assistant",
            content: data.reply || SAFE_FALLBACK,
          },
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

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, padding: 12, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "#2563eb" : "#1e293b",
              color: "#fff",
              padding: 10,
              borderRadius: 10,
              marginBottom: 8,
              maxWidth: "80%",
            }}
          >
            {m.content}
          </div>
        ))}
        {loading && <div>Pensando…</div>}
      </div>

      <div style={{ display: "flex", padding: 10, gap: 8 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Habla con AURA…"
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}
