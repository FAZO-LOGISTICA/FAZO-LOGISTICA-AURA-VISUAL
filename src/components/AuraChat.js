/* =====================================================
   AURAChat.js — FINAL PRO BLINDADO
   FAZO-OS 2025
   Autor: Mateo (IA)
   Objetivo: Chat robusto, sin bloqueos, sin pantallazos
===================================================== */

import React, { useEffect, useRef, useState } from "react";

/* ================= CONFIGURACIÓN ================= */

const MAX_HISTORY = 15;              // memoria corta controlada
const RESPONSE_TIMEOUT = 12000;      // 12 segundos máx de espera
const SAFE_FALLBACK =
  "Estoy operativo. Hubo una demora, pero sigo contigo. Reformula o continuamos.";

/* ================= UTILIDADES ================= */

const now = () => new Date().toISOString();

const safeTrimHistory = (history) => {
  if (!Array.isArray(history)) return [];
  return history.slice(-MAX_HISTORY);
};

/* ================= COMPONENTE ================= */

export default function AURAChat({
  onCommandDetected = () => {},
  apiEndpoint = "/api/aura/chat",
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const abortControllerRef = useRef(null);
  const timeoutRef = useRef(null);

  /* ========== LIMPIEZA SEGURA ========== */

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /* ========== ENVÍO DE MENSAJE ========== */

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input.trim(),
      ts: now(),
    };

    setInput("");
    setMessages((prev) => safeTrimHistory([...prev, userMessage]));
    setLoading(true);

    abortControllerRef.current = new AbortController();

    /* ---------- TIMEOUT DURO ---------- */
    timeoutRef.current = setTimeout(() => {
      try {
        abortControllerRef.current?.abort();
      } catch (_) {}
    }, RESPONSE_TIMEOUT);

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          messages: safeTrimHistory([...messages, userMessage]),
        }),
      });

      if (!response.ok) {
        throw new Error("Respuesta no OK");
      }

      const data = await response.json();

      /* ---------- COMANDO DETECTADO ---------- */
      if (data?.command) {
        try {
          onCommandDetected(data.command);
        } catch (_) {
          // comando falló, no bloquea chat
        }
      }

      const assistantMessage = {
        role: "assistant",
        content: data?.reply || SAFE_FALLBACK,
        ts: now(),
      };

      setMessages((prev) =>
        safeTrimHistory([...prev, assistantMessage])
      );
    } catch (error) {
      /* ---------- ERROR SILENCIOSO ---------- */
      const fallbackMessage = {
        role: "assistant",
        content: SAFE_FALLBACK,
        ts: now(),
      };

      setMessages((prev) =>
        safeTrimHistory([...prev, fallbackMessage])
      );
    } finally {
      clearTimeout(timeoutRef.current);
      setLoading(false);
    }
  };

  /* ========== ENTER PARA ENVIAR ========== */

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ================= UI ================= */

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              ...(msg.role === "user"
                ? styles.user
                : styles.assistant),
            }}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.message, ...styles.assistant }}>
            Pensando…
          </div>
        )}
      </div>

      <div style={styles.inputBox}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Habla con AURA…"
          style={styles.textarea}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={styles.button}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

/* ================= ESTILOS ================= */

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "12px",
    backgroundColor: "#0f172a",
  },
  message: {
    maxWidth: "80%",
    marginBottom: "10px",
    padding: "10px 14px",
    borderRadius: "12px",
    fontSize: "14px",
    lineHeight: "1.4",
    wordBreak: "break-word",
  },
  user: {
    alignSelf: "flex-end",
    backgroundColor: "#2563eb",
    color: "#fff",
  },
  assistant: {
    alignSelf: "flex-start",
    backgroundColor: "#1e293b",
    color: "#e5e7eb",
  },
  inputBox: {
    display: "flex",
    gap: "8px",
    padding: "10px",
    borderTop: "1px solid #334155",
    backgroundColor: "#020617",
  },
  textarea: {
    flex: 1,
    resize: "none",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#020617",
    color: "#e5e7eb",
  },
  button: {
    padding: "0 18px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#22c55e",
    color: "#022c22",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
