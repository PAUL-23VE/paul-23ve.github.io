"use client";

import Link from "next/link";
import { useState } from "react";
import {
  HiArrowUpRight, HiCheck, HiOutlineClipboard, HiOutlineEnvelope, HiOutlineMapPin,
} from "react-icons/hi2";

import { CallUpLetter } from "@/components/sub/call-up-letter";
import { Reveal } from "@/components/sub/reveal";
import { SectionHeading } from "@/components/sub/section-heading";
import { CONTACT_CHANNELS, SITE } from "@/constants";

export const Contact = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${SITE.email}`;
    }
  };

  return (
    <section id="contact" className="flex flex-col items-center py-20 px-6 md:px-10">
      <SectionHeading
        badge="Contacto"
        title="Trabajemos juntos"
        subtitle="¿Una propuesta, un proyecto o solo un saludo? Escríbeme."
      />

      <div className="w-full max-w-6xl grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-start">
        {/* Formulario dentro de un sobre de "convocatoria" que se abre en 3D */}
        <Reveal effect="drop">
          <CallUpLetter />
        </Reveal>

        <Reveal effect="door-right" delay={0.15}>
        <div className="glass-card p-6 md:p-8">
          <h3 className="text-2xl font-semibold text-white">O directo</h3>

          <div className="mt-5 flex items-center gap-3 rounded-lg border border-[#1ce09f61] py-2 pl-4 pr-2">
            <HiOutlineEnvelope className="h-5 w-5 shrink-0 text-[#a6f4da]" />
            <a href={`mailto:${SITE.email}`} className="min-w-0 flex-1 truncate text-white hover:text-[#a6f4da]">
              {SITE.email}
            </a>
            <button
              onClick={copyEmail}
              aria-label="Copiar correo"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#1ce09f61] text-white hover:bg-[#1ce09f33] transition"
            >
              {copied ? <HiCheck className="h-5 w-5" /> : <HiOutlineClipboard className="h-5 w-5" />}
            </button>
            <span className="sr-only" aria-live="polite">{copied ? "Correo copiado" : ""}</span>
          </div>

          <ul className="mt-4 flex flex-col">
            {CONTACT_CHANNELS.map(({ name: channel, value, icon: Icon, link }, i) => (
              <li key={channel}>
                <Reveal effect="flip" delay={0.5 + i * 0.08}>
                <Link
                  href={link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center gap-4 border-b border-[#1ce09f33] py-3 text-gray-200 transition hover:text-[#a6f4da]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1ce09f61]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="font-semibold text-white group-hover:text-[#a6f4da]">{channel}</span>
                    <span className="truncate text-sm text-gray-400">{value}</span>
                  </span>
                  <HiArrowUpRight className="h-4 w-4" />
                </Link>
                </Reveal>
              </li>
            ))}
          </ul>

          <p className="mt-5 flex items-center gap-2 text-sm text-gray-400">
            <HiOutlineMapPin className="h-5 w-5 text-[#a6f4da]" /> {SITE.location}
          </p>
        </div>
        </Reveal>
      </div>
    </section>
  );
};
