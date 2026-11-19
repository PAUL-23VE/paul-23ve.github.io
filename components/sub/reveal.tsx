"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Efectos de entrada (definidos en globals.css, bloque "Animaciones de entrada"):
 * - rise:        sube/se desliza en plano (usa `from` para la dirección)
 * - flip:        se despliega girando hacia adelante desde abajo
 * - drop:        cae desde arriba girando y rebota al aterrizar
 * - door-left:   se abre como una puerta con la bisagra a la izquierda
 * - door-right:  igual, con la bisagra a la derecha
 * - deal:        llega como una carta repartida sobre la mesa
 * - coin:        gira como una moneda viniendo desde el fondo
 * - depth:       se acerca desde la profundidad
 * - boot:        se enciende como una pantalla (de una línea a pantalla completa)
 */
export type RevealEffect =
  | "rise"
  | "flip"
  | "drop"
  | "door-left"
  | "door-right"
  | "deal"
  | "coin"
  | "depth"
  | "boot";

type RevealProps = {
  children: ReactNode;
  className?: string;
  effect?: RevealEffect;
  /** Dirección del efecto "rise". */
  from?: "left" | "right" | "top" | "bottom";
  delay?: number;
};

const OFFSET: Record<NonNullable<RevealProps["from"]>, [string, string]> = {
  left: ["-60px", "0px"],
  right: ["60px", "0px"],
  top: ["0px", "-40px"],
  bottom: ["0px", "24px"],
};

// Anima la entrada de un bloque cuando aparece en pantalla.
// El contenido es visible por defecto: si el JavaScript no llega a ejecutarse,
// la página se lee igual (solo se pierde la animación).
export const Reveal = ({ children, className, effect = "rise", from = "bottom", delay = 0 }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.reveal = "armed";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = "in";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [x, y] = OFFSET[from];
  const style = { "--rx": x, "--ry": y, "--rd": `${delay}s` } as CSSProperties;

  return (
    <div ref={ref} className={className} style={style} data-effect={effect}>
      {children}
    </div>
  );
};
