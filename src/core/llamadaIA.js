import config from "../config";

// ================================
// Llamada universal a cualquier IA
// ================================

export async function llamarIA(prompt) {
  const ordenMotores = [
    config.AURA_PRIMARY, // IA principal definida en .env
    "claude",
    "openai",
    "gemini",
    "llama",
    "deepseek",
    "cohere",
    "groq",
  ];

  for (let motor of ordenMotores) {
    try {
      const apiKey = obtenerKey(motor);
      if (!apiKey) continue; // si no hay key → saltar

      const respuesta = await consultarModelo(motor, apiKey, prompt);
      if (respuesta) return respuesta;
    } catch (err) {
      console.warn(`❌ ${motor.toUpperCase()} falló. Probando el siguiente...`);
    }
  }

  return "No fue posible contactar ninguna IA ahora mismo, Gustavo, pero sigo aquí contigo.";
}

// =========================================
// OBTENER KEY SEGÚN MOTOR
// =========================================
function obtenerKey(motor) {
  switch (motor) {
    case "claude":
      return config.CLAUDE_KEY;
    case "openai":
      return config.OPENAI_KEY;
    case "gemini":
      return config.GEMINI_KEY;
    case "llama":
      return config.LLAMA_KEY;
    case "deepseek":
      return config.DEEPSEEK_KEY;
    case "cohere":
      return config.COHERE_KEY;
    case "groq":
      return config.GROQ_KEY;
    default:
      return null;
  }
}

// =========================================
// CONSULTAR MODELO
// =========================================
async function consultarModelo(motor, key, prompt) {
  const url = config.URLS[motor];
  const modelo = config.MODELOS[motor];

  let body = {};

  // 🔹 Formatos distintos por proveedor
  if (motor === "cohere") {
    body = {
      model: modelo,
      message: prompt,
    };
  } else if (motor === "claude") {
    body = {
      model: modelo,
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    };
  } else {
    body = {
      model: modelo,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400,
    };
  }

  const headers = crearHeaders(motor, key);

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) return null;

  const data = await res.json();

  // ==========================
  // Normalizar respuesta AURA
  // ==========================

  if (motor === "claude") {
    return data.content?.[0]?.text || null;
  }

  if (motor === "cohere") {
    return data.text || null;
  }

  // OpenAI, Gemini, Llama, Groq, DeepSeek
  return (
    data.choices?.[0]?.message?.content ||
    data.choices?.[0]?.text ||
    null
  );
}

// =========================================
// HEADERS POR MOTOR
// =========================================
function crearHeaders(motor, key) {
  switch (motor) {
    case "claude":
      return {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      };

    case "cohere":
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      };

    default:
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      };
  }
}
