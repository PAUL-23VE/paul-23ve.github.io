"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import {
  HiChevronLeft, HiChevronRight, HiOutlineAcademicCap, HiOutlineArrowDownTray,
  HiOutlineArrowTopRightOnSquare, HiOutlineBriefcase, HiOutlineCheckBadge,
  HiOutlineEye, HiOutlineMagnifyingGlassPlus,
} from "react-icons/hi2";

import { Lightbox, type LightboxItem } from "@/components/sub/lightbox";
import { Reveal } from "@/components/sub/reveal";
import { SectionHeading } from "@/components/sub/section-heading";
import { TiltCard } from "@/components/sub/tilt-card";
import { CERTIFICATES, CV } from "@/constants";

const N = CERTIFICATES.length;
const HALF = Math.floor(N / 2);
// Posición relativa de cada tarjeta respecto a la activa, dando la vuelta (anillo): -2 … 2.
const offsetOf = (i: number, active: number) => ((((i - active) % N) + N + HALF) % N) - HALF;

const CERT_ITEMS: ReadonlyArray<LightboxItem> = CERTIFICATES.map((c) => ({
  title: c.title,
  subtitle: `${c.issuer} · ${c.date}`,
  src: c.image,
  width: 1400,
  height: 949,
  pdf: c.pdf,
}));

const CV_ITEMS: ReadonlyArray<LightboxItem> = [
  {
    title: "Currículum · Paul Velastegui",
    subtitle: `${CV.experience[0].role} · ${CV.experience[0].company}`,
    src: CV.image,
    width: 1000,
    height: 1415,
    pdf: CV.pdf,
    downloadName: CV.downloadName,
  },
];

const years = CERTIFICATES.map((c) => Number(c.date.slice(-4)));
const RANGE = `${Math.min(...years)} – ${Math.max(...years)}`;

export const Certificates = () => {
  const [active, setActive] = useState(0);
  const [viewer, setViewer] = useState<{ items: ReadonlyArray<LightboxItem>; index: number } | null>(null);

  // Otras secciones (p. ej. el comando "cv" de la terminal) piden abrir el visor del CV
  useEffect(() => {
    const openCv = () => setViewer({ items: CV_ITEMS, index: 0 });
    window.addEventListener("cv:open", openCv);
    return () => window.removeEventListener("cv:open", openCv);
  }, []);
  const swipe = useRef<{ x: number; moved: boolean } | null>(null);

  const go = (step: number) => setActive((i) => (i + step + N) % N);
  const cert = CERTIFICATES[active];

  // Deslizar con el dedo o arrastrar con el mouse cambia de certificado.
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    swipe.current = { x: e.clientX, moved: false };
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const start = swipe.current;
    if (!start) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) > 45) {
      start.moved = true;
      go(dx < 0 ? 1 : -1);
    }
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  const onCardClick = (i: number) => {
    // Un deslizamiento no cuenta como clic.
    if (swipe.current?.moved) {
      swipe.current = null;
      return;
    }
    if (i === active) setViewer({ items: CERT_ITEMS, index: i });
    else setActive(i);
  };

  return (
    <section id="certificates" className="flex flex-col items-center py-20 px-6">
      <SectionHeading
        badge="Certificados"
        title="Certificados y CV"
        subtitle="Lo que he aprendido, con respaldo."
      />

      <ul className="cert-stats" aria-label="Resumen">
        <li>
          <HiOutlineCheckBadge className="h-5 w-5" aria-hidden="true" /> {N} certificados
        </li>
        <li>Cisco Networking Academy</li>
        <li>{RANGE}</li>
      </ul>

      {/* ── Carrusel 3D de certificados (entra desde la profundidad) ── */}
      <Reveal effect="depth" delay={0.1} className="w-full">
      <div
        className="coverflow"
        role="group"
        aria-roledescription="carrusel"
        aria-label="Certificados. Usa las flechas del teclado para cambiar."
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {CERTIFICATES.map((c, i) => {
          const o = offsetOf(i, active);
          const isActive = o === 0;
          return (
            <div
              key={c.id}
              className={`cf-card${isActive ? " is-active" : ""}`}
              style={{ "--o": o, "--abs": Math.abs(o), "--accent": c.color } as CSSProperties}
            >
              <TiltCard max={isActive ? 10 : 0} className="cf-card__inner">
                <button
                  type="button"
                  className="cf-card__btn"
                  onClick={() => onCardClick(i)}
                  tabIndex={isActive ? 0 : -1}
                  aria-label={isActive ? `Ampliar certificado: ${c.title}` : `Mostrar certificado: ${c.title}`}
                >
                  <Image
                    src={c.image}
                    alt=""
                    width={1400}
                    height={949}
                    sizes="(min-width: 768px) 560px, 80vw"
                    className="cf-card__img"
                    draggable={false}
                  />
                </button>
              </TiltCard>
            </div>
          );
        })}
      </div>
      </Reveal>

      {/* Controles */}
      <div className="cf-controls">
        <button type="button" className="cf-round" onClick={() => go(-1)} aria-label="Certificado anterior">
          <HiChevronLeft className="h-5 w-5" />
        </button>
        <div className="cf-dots">
          {CERTIFICATES.map((c, i) => (
            <button
              key={c.id}
              type="button"
              className={i === active ? "is-active" : ""}
              style={{ "--accent": c.color } as CSSProperties}
              onClick={() => setActive(i)}
              aria-label={`Ir al certificado ${i + 1}: ${c.title}`}
              aria-current={i === active ? "true" : undefined}
            />
          ))}
        </div>
        <button type="button" className="cf-round" onClick={() => go(1)} aria-label="Certificado siguiente">
          <HiChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Detalle del certificado activo */}
      <div key={active} className="cf-caption" aria-live="polite" style={{ "--accent": cert.color } as CSSProperties}>
        <p className="cf-caption__count">
          Certificado {active + 1} de {N}
        </p>
        <h3 className="text-2xl font-semibold text-white">{cert.title}</h3>
        <p className="text-gray-400">
          {cert.issuer} · {cert.date}
        </p>
        <ul className="cf-caption__tags">
          {cert.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <div className="cf-caption__actions">
          <button type="button" className="doc-btn" onClick={() => setViewer({ items: CERT_ITEMS, index: active })}>
            <HiOutlineMagnifyingGlassPlus className="h-5 w-5" /> Ampliar
          </button>
          <a href={cert.pdf} target="_blank" rel="noreferrer noopener" className="doc-btn">
            <HiOutlineArrowTopRightOnSquare className="h-5 w-5" /> Ver PDF
          </a>
        </div>
        <p className="cf-caption__id">ID: {cert.id}</p>
      </div>

      {/* ── CV ── */}
      <div className="cv-block">
        {/* El CV aterriza girando; el resumen se abre como una puerta */}
        <Reveal effect="drop" className="cv-stage">
          <TiltCard max={10} className="cv-paper">
            <button
              type="button"
              className="block w-full"
              onClick={() => setViewer({ items: CV_ITEMS, index: 0 })}
              aria-label="Ampliar CV"
            >
              <Image
                src={CV.image}
                alt="Vista previa del CV de Paul Velastegui"
                width={1000}
                height={1415}
                sizes="(min-width: 1024px) 360px, 80vw"
                className="w-full h-auto rounded-[10px]"
              />
            </button>
          </TiltCard>
        </Reveal>

        <Reveal effect="door-right" delay={0.15} className="flex flex-col gap-5">
          <div>
            <p className="cv-kicker">Mi CV</p>
            <h3 className="text-3xl font-semibold text-white">Currículum</h3>
          </div>

          {CV.experience.map((job) => (
            <div key={job.company} className="cv-card">
              <div className="flex items-start gap-4">
                <span className="cv-card__icon">
                  <HiOutlineBriefcase className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-white">{job.role}</p>
                  <p className="text-gray-400">
                    {job.company} · {job.period}
                  </p>
                </div>
              </div>
              <ul className="cv-card__list">
                {job.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <p className="flex items-start gap-3 text-gray-300">
            <HiOutlineAcademicCap className="mt-0.5 h-6 w-6 shrink-0 text-[#a6f4da]" aria-hidden="true" />
            {CV.education}
          </p>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setViewer({ items: CV_ITEMS, index: 0 })} className="doc-btn">
              <HiOutlineEye className="h-5 w-5" /> Ver CV
            </button>
            <a href={CV.pdf} download={CV.downloadName} className="doc-btn doc-btn--solid">
              <HiOutlineArrowDownTray className="h-5 w-5" /> Descargar CV
            </a>
          </div>
        </Reveal>
      </div>

      {viewer && (
        <Lightbox
          items={viewer.items}
          index={viewer.index}
          onIndex={(index) => {
            setViewer({ ...viewer, index });
            if (viewer.items === CERT_ITEMS) setActive(index);
          }}
          onClose={() => setViewer(null)}
        />
      )}
    </section>
  );
};
