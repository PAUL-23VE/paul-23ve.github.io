"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect, useRef, useState,
  type CSSProperties, type KeyboardEvent, type PointerEvent,
} from "react";
import {
  HiChevronLeft, HiChevronRight, HiOutlineArrowsPointingOut, HiOutlineLockClosed,
} from "react-icons/hi2";
import { RxGithubLogo } from "react-icons/rx";

import { Lightbox, type LightboxItem } from "@/components/sub/lightbox";
import { Reveal } from "@/components/sub/reveal";
import type { Project } from "@/constants";

const AUTOPLAY_MS = 4200;

type ProjectCardProps = {
  project: Project;
  /** Posición en la lista completa (para el número 01, 02…). */
  number: number;
  /** Escenario a la derecha y texto a la izquierda. */
  reverse?: boolean;
};

// Proyecto presentado como escena 3D: las capturas forman un mazo en profundidad
// dentro de un marco de navegador que se inclina con el cursor, y pasan solas
// mientras el proyecto está en pantalla. Si hay capturas de móvil, un teléfono
// flota delante del navegador.
export const ProjectCard = ({ project, number, reverse = false }: ProjectCardProps) => {
  const desktop = project.images.filter((img) => !img.mobile);
  const mobile = project.images.filter((img) => img.mobile);
  const total = desktop.length;

  const [active, setActive] = useState(0);
  const [viewer, setViewer] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; moved: boolean } | null>(null);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(el);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    return () => observer.disconnect();
  }, []);

  const playing = visible && !hovered && viewer === null && total > 1 && !reducedMotion;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setActive((a) => (a + 1) % total), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [playing, active, total]);

  const go = (step: number) => setActive((a) => (a + step + total) % total);
  const phoneIndex = mobile.length ? active % mobile.length : 0;

  const items: LightboxItem[] = [...desktop, ...mobile].map((img, i, all) => ({
    title: project.title,
    subtitle: `${img.mobile ? "App móvil · " : ""}captura ${i + 1} de ${all.length}`,
    src: img.src,
    width: img.mobile ? 600 : 1600,
    height: img.mobile ? 1300 : 1000,
  }));

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--tx", (((e.clientX - rect.left) / rect.width) * 2 - 1).toFixed(3));
    el.style.setProperty("--ty", (((e.clientY - rect.top) / rect.height) * 2 - 1).toFixed(3));
    if (swipe.current && Math.abs(e.clientX - swipe.current.x) > 10) swipe.current.moved = true;
  };

  const onLeave = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--tx", "0");
    e.currentTarget.style.setProperty("--ty", "0");
    setHovered(false);
    swipe.current = null;
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    swipe.current = { x: e.clientX, moved: false };
  };

  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!swipe.current) return;
    const dx = e.clientX - swipe.current.x;
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
    // Se conserva `moved` hasta el clic que sigue, para no abrir el visor tras arrastrar.
    window.setTimeout(() => (swipe.current = null), 0);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  const open = (index: number) => {
    if (swipe.current?.moved) return;
    setViewer(index);
  };

  // Posición de cada captura en el mazo: 0 al frente, 1 y 2 detrás; la que acaba de
  // salir del frente sale volando hacia el espectador ("out") y el resto queda oculto.
  const slot = (i: number) => {
    const o = (i - active + total) % total;
    if (o <= 2) return String(o);
    if (o === total - 1 && total >= 5) return "out";
    return "hide";
  };

  const style = { "--accent": project.color, "--dir": reverse ? -1 : 1 } as CSSProperties;
  const num = String(number + 1).padStart(2, "0");

  return (
    <article
      className={`proj ${reverse ? "proj--reverse" : ""}`}
      style={style}
      aria-labelledby={`proj-${number}`}
    >
      {/* ── Escenario 3D ── */}
      <Reveal from={reverse ? "right" : "left"} className="proj__stage-wrap">
        <div
          ref={sceneRef}
          className="pscene"
          onPointerEnter={() => setHovered(true)}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onKeyDown={onKey}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
        >
          <div className="pscene__rig">
            <div className="pdeck">
              {desktop.map((img, i) => (
                <div key={img.src} className="pdeck__card" data-o={slot(i)} aria-hidden={i !== active}>
                  <div className="pwin">
                    <div className="pwin__bar">
                      <span className="pwin__dot" />
                      <span className="pwin__dot" />
                      <span className="pwin__dot" />
                      <span className="pwin__url">{project.domain}</span>
                    </div>
                    <div className="pwin__screen">
                      <Image
                        src={img.src}
                        alt={`${project.title}: captura ${i + 1} de ${total}`}
                        fill
                        sizes="(min-width: 1024px) 640px, 92vw"
                        className="object-cover object-top"
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="pdeck__hit"
                onClick={() => open(active)}
                aria-label={`Ampliar captura ${active + 1} de ${total} de ${project.title}`}
              >
                <span className="pdeck__zoom" aria-hidden="true">
                  <HiOutlineArrowsPointingOut className="h-5 w-5" /> Ampliar
                </span>
              </button>
            </div>

            {mobile.length > 0 && (
              <button
                type="button"
                className="pphone"
                onClick={() => open(total + phoneIndex)}
                aria-label={`Ampliar captura de la app móvil de ${project.title}`}
              >
                <span className="pphone__notch" aria-hidden="true" />
                {mobile.map((img, i) => (
                  <Image
                    key={img.src}
                    src={img.src}
                    alt=""
                    fill
                    sizes="160px"
                    className={`pphone__img ${i === phoneIndex ? "is-on" : ""}`}
                    draggable={false}
                  />
                ))}
              </button>
            )}
          </div>
        </div>

        {total > 1 && (
          <div className="pctrl">
            <button type="button" className="pctrl__round" onClick={() => go(-1)} aria-label="Captura anterior">
              <HiChevronLeft className="h-5 w-5" />
            </button>
            <div className="pctrl__segs">
              {desktop.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  className={`pseg ${i === active ? "is-active" : ""} ${i < active ? "is-done" : ""}`}
                  onClick={() => setActive(i)}
                  aria-label={`Ver captura ${i + 1}`}
                  aria-current={i === active}
                >
                  {i === active && (
                    <span
                      key={`${active}-${playing}`}
                      className={`pseg__fill ${playing ? "is-playing" : ""}`}
                      style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                    />
                  )}
                </button>
              ))}
            </div>
            <span className="pctrl__count" aria-live="polite">
              {active + 1}/{total}
            </span>
            <button type="button" className="pctrl__round" onClick={() => go(1)} aria-label="Captura siguiente">
              <HiChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </Reveal>

      {/* ── Información ── */}
      <Reveal from={reverse ? "left" : "right"} delay={0.1} className="proj__info">
        <span className="proj__num" aria-hidden="true">{num}</span>
        <div className="flex flex-wrap items-center gap-2">
          <span className="proj__cat">{project.category}</span>
          {project.badge && <span className="proj__badge">{project.badge}</span>}
        </div>
        <h3 id={`proj-${number}`} className="proj__title">
          {project.title}
        </h3>
        <p className="text-gray-300 leading-relaxed">{project.description}</p>

        <ul className="flex flex-col gap-2 text-sm text-gray-400">
          {project.highlights.map((item) => (
            <li key={item} className="flex gap-2.5">
              <span className="proj__bullet" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        <ul className="proj__stack" aria-label="Tecnologías">
          {project.stack.map((tech, i) => (
            <li key={tech} style={{ "--i": i } as CSSProperties}>
              {tech}
            </li>
          ))}
        </ul>

        <p className="text-sm text-gray-500">{project.team}</p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button type="button" onClick={() => setViewer(0)} className="doc-btn doc-btn--solid">
            <HiOutlineArrowsPointingOut className="h-5 w-5" /> Ver capturas ({items.length})
          </button>
          {project.links.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              className="doc-btn"
            >
              <RxGithubLogo className="h-4 w-4" /> {link.label}
            </Link>
          ))}
          {project.privateRepo && (
            <span className="proj__private">
              <HiOutlineLockClosed className="h-4 w-4" /> Repositorio privado
            </span>
          )}
        </div>
      </Reveal>

      {viewer !== null && (
        <Lightbox
          items={items}
          index={viewer}
          onIndex={(i) => {
            setViewer(i);
            if (i < total) setActive(i);
          }}
          onClose={() => setViewer(null)}
        />
      )}
    </article>
  );
};
