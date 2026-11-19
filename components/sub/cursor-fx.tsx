"use client";

import { useEffect } from "react";

// Al hacer clic con el mouse sale una onda verde desde el cursor de balón,
// como si se pateara. El cursor en sí es CSS (app/globals.css → "Cursor de balón").
export const CursorFx = () => {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      const ring = document.createElement("span");
      ring.className = "kick-ripple";
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
      ring.setAttribute("aria-hidden", "true");
      document.body.appendChild(ring);
      ring.addEventListener("animationend", () => ring.remove(), { once: true });
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);
  return null;
};
