"use client";

import type { CSSProperties, PointerEvent, ReactNode } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Inclinación máxima en grados. */
  max?: number;
  style?: CSSProperties;
};

// Tarjeta que se inclina en 3D hacia el cursor y muestra un reflejo de luz que lo sigue.
// Dentro, cualquier elemento con la clase `tilt__pop` sobresale hacia el frente.
export const TiltCard = ({ children, className = "", max = 12, style }: TiltCardProps) => {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--tx", (px * 2 - 1).toFixed(3));
    el.style.setProperty("--ty", (py * 2 - 1).toFixed(3));
    el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
  };

  const onLeave = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--tx", "0");
    e.currentTarget.style.setProperty("--ty", "0");
  };

  return (
    <div
      className={`tilt ${className}`}
      style={{ "--tilt-max": `${max}deg`, ...style } as CSSProperties}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </div>
  );
};
