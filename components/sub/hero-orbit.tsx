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

// Pizarra táctica interactiva del inicio: cada ficha es una tecnología (un "jugador").
// Al pasar el cursor (o enfocarla con teclado / toque) crece, se inclina en 3D y toma su color.
export const HeroOrbit = () => {
  return (
    <div className="orbit" role="list" aria-label="Tecnologías que uso">
      {/* Pizarra táctica: cancha vista desde arriba */}
      <svg className="orbit__guides" viewBox="0 0 100 100" aria-hidden="true">
        <rect x="4" y="3" width="92" height="94" rx="1.5" />
        <line x1="4" y1="50" x2="96" y2="50" />
        <circle cx="50" cy="50" r="13" />
        <circle cx="50" cy="50" r="0.9" className="orbit__spot" />
        <rect x="25" y="3" width="50" height="17" />
        <rect x="38" y="3" width="24" height="6.5" />
        <circle cx="50" cy="14" r="0.8" className="orbit__spot" />
        <path d="M 41 20 A 10 10 0 0 0 59 20" />
        <rect x="25" y="80" width="50" height="17" />
        <rect x="38" y="90.5" width="24" height="6.5" />
        <circle cx="50" cy="86" r="0.8" className="orbit__spot" />
        <path d="M 41 80 A 10 10 0 0 1 59 80" />
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
