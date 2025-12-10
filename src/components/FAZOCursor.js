// ===============================================
//  FAZOCursor.js — Cursor holográfico FAZO OS
//  by Mateo IA + Gustavo Oliva — 2025
// ===============================================

import { useEffect } from "react";

export default function FAZOCursor() {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.id = "fazo-cursor";
    document.body.appendChild(cursor);

    const trail = document.createElement("div");
    trail.id = "fazo-cursor-trail";
    document.body.appendChild(trail);

    const moveCursor = (e) => {
      cursor.style.top = `${e.clientY}px`;
      cursor.style.left = `${e.clientX}px`;

      // rastro
      trail.style.top = `${e.clientY}px`;
      trail.style.left = `${e.clientX}px`;
    };

    const clickEffect = () => {
      cursor.classList.remove("click-pulse");
      void cursor.offsetWidth; // fuerza reflow
      cursor.classList.add("click-pulse");
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("click", clickEffect);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("click", clickEffect);
    };
  }, []);

  return null;
}
const clickSound = new Audio("/sounds/click-holo.mp3");
clickSound.volume = 0.35;

const playClickSound = () => {
  try {
    clickSound.currentTime = 0;
    clickSound.play();
  } catch (_) {}
};

window.addEventListener("click", playClickSound);
