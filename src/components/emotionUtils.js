export function detectarEmocion(texto) {
  const msg = texto.toLowerCase();

  const alegria = ["gracias", "genial", "bacán", "feliz", "bueno", "excelente", "perfecto"];
  const enojo = ["mal", "enojo", "rabia", "molesto", "injusto", "odio"];
  const tristeza = ["triste", "pena", "cansado", "agotado", "decepcionado", "solo"];

  if (alegria.some(p => msg.includes(p))) return "happy";
  if (enojo.some(p => msg.includes(p))) return "angry";
  if (tristeza.some(p => msg.includes(p))) return "sad";
  return "neutral";
}
