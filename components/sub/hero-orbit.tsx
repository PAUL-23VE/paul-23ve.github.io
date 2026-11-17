"use client";

import type { CSSProperties, PointerEvent } from "react";

import { HERO_TECH } from "@/constants";

// Inclina la ficha hacia donde está el cursor (valores entre -1 y 1 en --tx / --ty).
const tilt = (e: PointerEvent<HTMLButtonElement>) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  el.style.setProperty("--tx", x.toFixed(3));
  el.style.setProperty("--ty", y.toFixed(3));
};

const reset = (e: PointerEvent<HTMLButtonElement>) => {
  e.currentTarget.style.setProperty("--tx", "0");
  e.currentTarget.style.setProperty("--ty", "0");
};

// Órbita interactiva del inicio: cada ficha es una tecnología.
// Al pasar el cursor (o enfocarla con teclado / toque) crece, se inclina en 3D y toma su color.
export const HeroOrbit = () => {
  return (
    <div className="orbit" role="list" aria-label="Tecnologías que uso">
      {/* Anillos y guías de fondo */}
      <svg className="orbit__guides" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="46" />
        <circle cx="50" cy="50" r="33" />
        <circle cx="50" cy="50" r="19" />
        <line x1="50" y1="0" x2="50" y2="100" />
        <line x1="0" y1="50" x2="100" y2="50" />
        <line x1="17" y1="17" x2="83" y2="83" />
        <line x1="83" y1="17" x2="17" y2="83" />
        <line x1="0" y1="27" x2="100" y2="27" />
        <line x1="0" y1="73" x2="100" y2="73" />
        <line x1="27" y1="0" x2="27" y2="100" />
        <line x1="73" y1="0" x2="73" y2="100" />
      </svg>

      {HERO_TECH.map(({ name, icon: Icon, color, x, y, faded }, i) => (
        <div
          key={name}
          role="listitem"
          className={`orbit__slot${faded ? " orbit__slot--faded" : ""}`}
          style={
            {
              left: `${x}%`,
              top: `${y}%`,
              "--float-delay": `${(i * 0.37) % 3}s`,
              "--float-time": `${5 + (i % 4)}s`,
            } as CSSProperties
          }
        >
          <button
            type="button"
            className="orbit__tile"
            style={{ "--brand": color } as CSSProperties}
            onPointerMove={tilt}
            onPointerLeave={reset}
            aria-label={name}
          >
            <span className="orbit__face" aria-hidden="true">
              <Icon className="orbit__icon" />
            </span>
            <span className="orbit__label" aria-hidden="true">
              {name}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
};
