"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  HiChevronLeft, HiChevronRight, HiOutlineArrowDownTray, HiOutlineArrowTopRightOnSquare, HiXMark,
} from "react-icons/hi2";

export type LightboxItem = {
  title: string;
  subtitle?: string;
  src: string;
  width: number;
  height: number;
  /** Si se indica, el visor ofrece abrir y descargar el PDF. */
  pdf?: string;
  downloadName?: string;
};

type LightboxProps = {
  items: ReadonlyArray<LightboxItem>;
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
};

// Visor a pantalla completa para un documento (certificado o CV) o una captura.
// Se cierra con Esc o tocando fuera; las flechas pasan al anterior/siguiente.
export const Lightbox = ({ items, index, onIndex, onClose }: LightboxProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const item = items[index];
  const many = items.length > 1;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (many && e.key === "ArrowRight") onIndex((index + 1) % items.length);
      if (many && e.key === "ArrowLeft") onIndex((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, many, onClose, onIndex]);

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="lightbox__bar">
        <div className="min-w-0">
          <p className="lightbox__title">{item.title}</p>
          {item.subtitle && <p className="lightbox__subtitle">{item.subtitle}</p>}
        </div>
        <button ref={closeRef} type="button" className="lightbox__round" onClick={onClose} aria-label="Cerrar">
          <HiXMark className="h-6 w-6" />
        </button>
      </div>

      <div className="lightbox__stage" onClick={(e) => e.target === e.currentTarget && onClose()}>
        {many && (
          <button
            type="button"
            className="lightbox__round lightbox__nav lightbox__nav--prev"
            onClick={() => onIndex((index - 1 + items.length) % items.length)}
            aria-label="Anterior"
          >
            <HiChevronLeft className="h-6 w-6" />
          </button>
        )}
        <Image
          key={item.src}
          src={item.src}
          alt={item.title}
          width={item.width}
          height={item.height}
          className="lightbox__img"
        />
        {many && (
          <button
            type="button"
            className="lightbox__round lightbox__nav lightbox__nav--next"
            onClick={() => onIndex((index + 1) % items.length)}
            aria-label="Siguiente"
          >
            <HiChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="lightbox__actions">
        {many && (
          <span className="lightbox__count" aria-hidden="true">
            {index + 1} / {items.length}
          </span>
        )}
        {item.pdf && (
          <>
            <a href={item.pdf} target="_blank" rel="noreferrer noopener" className="doc-btn">
              <HiOutlineArrowTopRightOnSquare className="h-5 w-5" /> Abrir PDF
            </a>
            <a href={item.pdf} download={item.downloadName ?? true} className="doc-btn doc-btn--solid">
              <HiOutlineArrowDownTray className="h-5 w-5" /> Descargar
            </a>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};
