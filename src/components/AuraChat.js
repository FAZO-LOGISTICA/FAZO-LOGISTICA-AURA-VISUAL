import React, { useState } from "react";

const API = "https://aura-g5nw.onrender.com/aura";

export default function AURAChat({ onUserMessage }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const enviar = async () => {
    if (!input.trim()) return;

    const history = [...messages, { role: "user", content: input }];
    setMessages(history);
    setInput("");

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });

    const data = await res.json();

    // 🔥 SI VIENE COMANDO → NO TEXTO IA
    if (data.command) {
      onUserMessage(data.command); // FAZO manda
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
      return;
    }

    // Respuesta normal IA
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.reply },
    ]);
  };

  return (
    <div>
      <div>
        {messages.map((m, i) => (
          <div key={i}>{m.content}</div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && enviar()}
      />
      <button onClick={enviar}>Enviar</button>
    </div>
  );
}
