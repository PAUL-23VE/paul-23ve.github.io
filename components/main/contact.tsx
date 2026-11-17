"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  HiArrowUpRight, HiCheck, HiOutlineClipboard, HiOutlineEnvelope, HiOutlineMapPin,
} from "react-icons/hi2";

import { SectionHeading } from "@/components/sub/section-heading";
import { CONTACT_CHANNELS, SITE } from "@/constants";

const inputClass =
  "w-full rounded-lg border border-[#7042f861] bg-[#ffffff0a] px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#b49bff] focus:outline-none focus:ring-2 focus:ring-[#7042f855]";

export const Contact = () => {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${SITE.email}`;
    }
  };

  // Sin servidor: el formulario abre el cliente de correo con el mensaje ya escrito.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Contacto desde tu portafolio — ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}`);
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="flex flex-col items-center py-20 px-6 md:px-10">
      <SectionHeading
        badge="Contacto"
        title="Trabajemos juntos"
        subtitle="¿Una propuesta, un proyecto o solo un saludo? Escríbeme."
      />

      <div className="w-full max-w-6xl grid grid-cols-1 gap-8 md:grid-cols-2 items-start">
        <div className="glass-card p-6 md:p-8">
          <h3 className="text-2xl font-semibold text-white">Escríbeme</h3>
          <p className="text-gray-400 mt-1">
            Al enviar se abrirá tu aplicación de correo con el mensaje listo.
          </p>
          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-sm text-gray-300">
              Tu nombre
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="¿Cómo te llamas?"
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-gray-300">
              Mensaje
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Cuéntame sobre tu proyecto o idea…"
                className={inputClass}
              />
            </label>
            <button type="submit" className="button-primary rounded-lg py-3 px-8 text-white w-max">
              Enviar mensaje
            </button>
          </form>
        </div>

        <div className="glass-card p-6 md:p-8">
          <h3 className="text-2xl font-semibold text-white">O directo</h3>

          <div className="mt-5 flex items-center gap-3 rounded-lg border border-[#7042f861] py-2 pl-4 pr-2">
            <HiOutlineEnvelope className="h-5 w-5 shrink-0 text-[#b49bff]" />
            <a href={`mailto:${SITE.email}`} className="min-w-0 flex-1 truncate text-white hover:text-[#b49bff]">
              {SITE.email}
            </a>
            <button
              onClick={copyEmail}
              aria-label="Copiar correo"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#7042f861] text-white hover:bg-[#7042f833] transition"
            >
              {copied ? <HiCheck className="h-5 w-5" /> : <HiOutlineClipboard className="h-5 w-5" />}
            </button>
            <span className="sr-only" aria-live="polite">{copied ? "Correo copiado" : ""}</span>
          </div>

          <ul className="mt-4 flex flex-col">
            {CONTACT_CHANNELS.map(({ name: channel, value, icon: Icon, link }) => (
              <li key={channel}>
                <Link
                  href={link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center gap-4 border-b border-[#7042f833] py-3 text-gray-200 transition hover:text-[#b49bff]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#7042f861]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="font-semibold text-white group-hover:text-[#b49bff]">{channel}</span>
                    <span className="truncate text-sm text-gray-400">{value}</span>
                  </span>
                  <HiArrowUpRight className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-5 flex items-center gap-2 text-sm text-gray-400">
            <HiOutlineMapPin className="h-5 w-5 text-[#b49bff]" /> {SITE.location}
          </p>
        </div>
      </div>
    </section>
  );
};
