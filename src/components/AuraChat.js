import React, { useState, useRef, useEffect } from "react";

export default function AURAChat({ onCommand }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const autoScroll = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    autoScroll();
  }, [messages]);

  const detectarComandoSimple = (texto) => {
    const t = texto.toLowerCase();

    if (t.includes("abrir aguaruta") || t.includes("abre aguaruta")) {
      return {
        type: "OPEN_EXTERNAL",
        url: "https://aguaruta.netlify.app",
      };
    }

    return null;
  };

  const enviar = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    const comando = detectarComandoSimple(input);

    if (comando) {
      onCommand(comando);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "✅ Abriendo AguaRuta en nueva pestaña...",
        },
      ]);

      setInput("");
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "🤖 AURA aún no tiene backend conectado.",
      },
    ]);

    setInput("");
  };

  return (
    <>
      {/* CONTENEDOR MENSAJES */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background:
                m.role === "user" ? "#3b82f6" : "rgba(255,255,255,0.1)",
              padding: "10px 14px",
              borderRadius: 12,
              maxWidth: "80%",
              color: "white",
              fontSize: 14,
            }}
          >
            {m.content}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT FIJO ABAJO */}
      <div
        style={{
          padding: 16,
          borderTop: "1px solid #334155",
          display: "flex",
          gap: 8,
          background: "#0f172a",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder="Escribe una orden para AURA..."
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #334155",
            outline: "none",
            color: "black",
            background: "white",
          }}
        />

        <button
          onClick={enviar}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            background: "#3b82f6",
            color: "white",
            cursor: "pointer",
          }}
        >
          Enviar
        </button>
      </div>
    </>
  );
}
