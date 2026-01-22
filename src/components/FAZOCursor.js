// ===============================================
//  FAZOCursor.js — Cursor holográfico FAZO OS
//  Producción estable React 18 + Netlify
//  Mateo IA + Gustavo Oliva — 2025
// ===============================================

import { useEffect, useRef } from "react";

export default function FAZOCursor() {
  const clickSoundRef = useRef(null);
  const audioEnabledRef = useRef(false);

  useEffect(() => {
    // ==============================
    // Crear cursor y rastro
    // ==============================
    const cursor = document.createElement("div");
    cursor.id = "fazo-cursor";

    const trail = document.createElement("div");
    trail.id = "fazo-cursor-trail";

    document.body.appendChild(cursor);
    document.body.appendChild(trail);

    // ==============================
    // Inicializar audio (bloqueado hasta interacción)
    // ==============================
    clickSoundRef.current = new Audio("/sounds/click-holo.mp3");
    clickSoundRef.current.volume = 0.35;

    const enableAudio = () => {
      audioEnabledRef.current = true;
      window.removeEventListener("pointerdown", enableAudio);
    };

    window.addEventListener("pointerdown", enableAudio, { once: true });

    // ==============================
    // Movimiento del cursor
    // ==============================
    const moveCursor = (e) => {
      const { clientX, clientY } = e;

      cursor.style.left = `${clientX}px`;
      cursor.style.top = `${clientY}px`;

      trail.style.left = `${clientX}px`;
      trail.style.top = `${clientY}px`;
    };

    // ==============================
    // Click visual + sonido
    // ==============================
    const handleClick = () => {
      // Animación
      cursor.classList.remove("click-pulse");
      void cursor.offsetWidth; // reflow
      cursor.classList.add("click-pulse");

      // Sonido (solo si el navegador ya lo permitió)
      if (audioEnabledRef.current && clickSoundRef.current) {
        try {
          clickSoundRef.current.currentTime = 0;
          clickSoundRef.current.play();
        } catch (_) {
          // silencio intencional
        }
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("click", handleClick);

    // ==============================
    // CLEANUP PERFECTO
    // ==============================
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("click", handleClick);

      cursor.remove();
      trail.remove();

      if (clickSoundRef.current) {
        clickSoundRef.current.pause();
        clickSoundRef.current.src = "";
        clickSoundRef.current = null;
      }
    };
  }, []);

  return null;
}
