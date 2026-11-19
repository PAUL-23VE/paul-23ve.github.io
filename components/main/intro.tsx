"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { SITE } from "@/constants";
import { INTRO_KEY } from "@/lib/intro";

// Intro antes del portafolio: escena 3D estilo videojuego (components/main/intro-scene.tsx).
// Un futbolista entra corriendo, dispara a la cámara y aparece tu nombre; luego celebra
// hasta que el usuario presiona algo o se desplaza. Solo existe en el navegador.
const IntroScene = dynamic(() => import("@/components/main/intro-scene"), { ssr: false });

// ¿Hay que mostrar la intro? Lo decide el script de <head> (lib/intro.ts) con una clase en <html>.
// En el servidor y durante la hidratación se asume que sí (el CSS ya la oculta si no toca).
const subscribe = () => () => {};
const shouldPlay = () => !document.documentElement.classList.contains("intro-skip");

export const Intro = () => {
  const play = useSyncExternalStore(subscribe, shouldPlay, () => true);
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const ended = useRef(false);

  const mark = useCallback((cls: string) => rootRef.current?.classList.add(cls), []);

  const finish = useCallback(() => {
    if (ended.current) return;
    ended.current = true;
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {}
    rootRef.current?.classList.add("intro--out");
    document.documentElement.classList.remove("intro-lock"); // arrancan las animaciones del inicio
    window.setTimeout(() => setGone(true), 900);
  }, []);

  const started = useRef(false);
  const start = useCallback(() => {
    started.current = true;
    mark("is-playing");
  }, [mark]);
  const impact = useCallback(() => mark("is-impact"), [mark]);
  const ready = useCallback(() => mark("is-ready"), [mark]);

  // La intro no se cierra sola: espera a que el usuario presione una tecla, haga clic/toque
  // o intente desplazarse (rueda o deslizar). Funciona también a mitad de la animación.
  useEffect(() => {
    // Al terminar la intro se quitan los escuchadores: si no, seguirían bloqueando
    // el teclado en todo el portafolio (por ejemplo, en el formulario de contacto)
    if (!play || gone) return;
    const onKey = (e: KeyboardEvent) => {
      if (ended.current) return;
      // Ignora teclas modificadoras solas y atajos (Ctrl+R, Ctrl+Shift+I…)
      if (["Shift", "Control", "Alt", "Meta"].includes(e.key) || e.ctrlKey || e.metaKey || e.altKey) return;
      e.preventDefault();
      finish();
    };
    const onWheel = (e: WheelEvent) => Math.abs(e.deltaY) + Math.abs(e.deltaX) > 0 && finish();
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", finish, { passive: true });
    // Relieve con el mouse (sin hacer clic): el título se inclina hacia el cursor
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const root = rootRef.current;
      if (!root) return;
      root.style.setProperty("--mx", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
      root.style.setProperty("--my", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    // Si la escena 3D no llegara a cargar, la intro no debe bloquear la página
    const failsafe = window.setTimeout(() => {
      if (!started.current) finish();
    }, 9000);
    return () => {
      clearTimeout(failsafe);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", finish);
      window.removeEventListener("pointermove", onMove);
      // El bloqueo de scroll solo lo quita finish() (en desarrollo React monta los efectos dos veces)
    };
  }, [play, gone, finish]);

  if (!play || gone) return null;

  const [first, ...rest] = SITE.name.split(" ");
  // Cada letra del apellido toma su color del degradado verde → dorado
  const accent = (i: number, n: number) => {
    const t = n > 1 ? i / (n - 1) : 0;
    const stops = [[52, 211, 153], [110, 231, 183], [251, 191, 36]];
    const k = t < 0.5 ? t * 2 : (t - 0.5) * 2;
    const [a, b] = t < 0.5 ? [stops[0], stops[1]] : [stops[1], stops[2]];
    return `rgb(${a.map((v, j) => Math.round(v + (b[j] - v) * k)).join(",")})`;
  };
  const letters = (word: string, offset: number, colored = false) =>
    [...word].map((ch, i) => (
      <span
        key={i}
        style={{ animationDelay: `${0.3 + (offset + i) * 0.045}s`, color: colored ? accent(i, word.length) : undefined }}
      >
        {ch}
      </span>
    ));

  return (
    <div ref={rootRef} className="intro" aria-label="Introducción" onClick={finish}>
      <IntroScene onStart={start} onReady={ready} onImpact={impact} />
      <div className="intro__vignette" aria-hidden="true" />
      <div className="intro__bars" aria-hidden="true" />
      <div className="intro__flash" aria-hidden="true" />
      <div className="intro__ring" aria-hidden="true" />

      <div className="intro__title">
        <p className="intro__kicker">Bienvenido al portafolio de</p>
        <h2 className="intro__name" aria-label={SITE.name}>
          <span className="intro__word" aria-hidden="true">
            {letters(first, 0)}
          </span>{" "}
          <span className="intro__word intro__word--accent" aria-hidden="true">
            {letters(rest.join(" "), first.length, true)}
          </span>
        </h2>
        <svg className="intro__underline" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true">
          <path d="M4 8 Q 80 2 150 6 T 296 5" />
        </svg>
        <p className="intro__role">{SITE.role}</p>
      </div>

      {/* Pista para entrar (también es el botón accesible por teclado/lector) */}
      <button type="button" className="intro__enter" onClick={finish}>
        <span className="intro__mouse" aria-hidden="true">
          <span />
        </span>
        <span className="intro__enter-text intro__enter-text--desktop">Presiona cualquier tecla o desplázate para entrar</span>
        <span className="intro__enter-text intro__enter-text--touch">Toca o desliza para entrar</span>
      </button>
    </div>
  );
};
