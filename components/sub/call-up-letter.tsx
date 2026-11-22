"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { FaFutbol } from "react-icons/fa";
import { HiCheck, HiOutlineEnvelope, HiOutlinePaperAirplane, HiXMark } from "react-icons/hi2";

import { CONTACT_FORM_KEY, SITE } from "@/constants";

const REASONS = ["Propuesta laboral", "Proyecto freelance", "Colaboración", "Solo un saludo"] as const;

// idle → opening (se abre el sobre) → open (hoja en el modal)
//   → tearing (cancelar: la hoja se rompe) → idle
//   → sending (enviar: la hoja vuelve al sobre) → sent
type Phase = "idle" | "opening" | "open" | "tearing" | "sending" | "sent";

const OPEN_MS = 700;
const TEAR_MS = 950;
const SEND_MS = 650;

// Borde rasgado irregular (fijo). Las dos mitades comparten el mismo zigzag para encajar.
const TEAR = [50, 46, 53, 47, 55, 49, 44, 52, 48, 56, 45, 51, 47, 54, 50, 46, 53, 49, 55, 48, 51];
const EDGE = TEAR.map((x, i) => `${x}% ${((i / (TEAR.length - 1)) * 100).toFixed(1)}%`).join(", ");
const CLIP_L = `polygon(0 0, ${EDGE}, 0 100%)`;
const CLIP_R = `polygon(100% 0, ${EDGE}, 100% 100%)`;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Envío sin servidor propio ni base de datos: Web3Forms (https://web3forms.com) recibe el
// formulario y lo reenvía al correo asociado a la clave (CONTACT_FORM_KEY en constants).
// Mientras no haya clave, "Enviar" abre el correo del visitante con el mensaje ya escrito.
const FORM_ENDPOINT = "https://api.web3forms.com/submit";

// Contacto: un sobre con sello de balón. Al abrirlo, la hoja sale a un modal con el
// formulario. Cancelar rompe la hoja; enviar la manda a mi correo y la devuelve al sobre.
export const CallUpLetter = () => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [name, setName] = useState("");
  const [reason, setReason] = useState<string>(REASONS[0]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState("");

  const phaseRef = useRef<Phase>("idle");
  const timers = useRef<number[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const peekRef = useRef<HTMLDivElement>(null);
  const halfL = useRef<HTMLDivElement>(null);
  const halfR = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      document.documentElement.style.overflow = "";
    };
  }, []);

  const go = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, reducedMotion() ? 0 : ms));
  };

  // Distancia y escala entre la hoja del sobre y la del modal (para el vuelo de ida/vuelta)
  const measureFlight = () => {
    const sheet = sheetRef.current;
    const from = peekRef.current?.getBoundingClientRect();
    const to = sheet?.getBoundingClientRect();
    if (!sheet || !from || !to?.width) return;
    sheet.style.setProperty("--dx", `${from.left + from.width / 2 - (to.left + to.width / 2)}px`);
    sheet.style.setProperty("--dy", `${from.top + from.height / 2 - (to.top + to.height / 2)}px`);
    sheet.style.setProperty("--s", `${Math.min(1, from.width / to.width)}`);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setReason(REASONS[0]);
    setMessage("");
    setError("");
  };

  const closeModal = (next: Phase) => {
    halfL.current?.replaceChildren();
    halfR.current?.replaceChildren();
    dialogRef.current?.close();
    document.documentElement.style.overflow = "";
    ctaRef.current?.focus({ preventScroll: true });
    go(next);
  };

  const openLetter = () => {
    if (phaseRef.current !== "idle" && phaseRef.current !== "sent") return;
    go("opening");
    later(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
      measureFlight();
      go("open");
      nameRef.current?.focus({ preventScroll: true });
    }, OPEN_MS);
  };

  // Cancelar: la hoja se parte en dos mitades (copias de la hoja real) que caen
  const tearLetter = () => {
    if (phaseRef.current !== "open") return;
    const paper = paperRef.current;
    for (const half of [halfL.current, halfR.current]) {
      if (!half || !paper) continue;
      const copy = paper.cloneNode(true) as HTMLElement;
      copy.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
      copy.querySelectorAll("input[type=radio]").forEach((n) => n.removeAttribute("name"));
      half.replaceChildren(copy);
    }
    go("tearing");
    later(() => {
      resetForm();
      closeModal("idle");
    }, TEAR_MS);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (phaseRef.current !== "open" || sending) return;
    // Trampa para bots: un campo oculto que una persona nunca llena
    const honey = (e.currentTarget.elements.namedItem("botcheck") as HTMLInputElement | null)?.value;
    if (honey) return;

    // Sin clave del servicio: se abre el correo del visitante con todo ya escrito
    if (!CONTACT_FORM_KEY) {
      window.location.href = mailtoHref;
      measureFlight();
      go("sending");
      later(() => {
        resetForm();
        closeModal("sent");
      }, SEND_MS);
      return;
    }

    setSending(true);
    setSlow(false);
    setError("");
    // Si tarda, se avisa; si pasa de 60 s se cancela y se ofrece enviarlo desde el correo
    const ctrl = new AbortController();
    const slowTimer = window.setTimeout(() => setSlow(true), 5000);
    const abortTimer = window.setTimeout(() => ctrl.abort(), 60000);
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        signal: ctrl.signal,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: CONTACT_FORM_KEY,
          subject: `Portafolio · ${reason} — ${name}`,
          from_name: "Portafolio Paul Velastegui",
          replyto: email, // al responder desde Gmail, la respuesta va al visitante
          Nombre: name,
          Correo: email,
          Motivo: reason,
          Mensaje: message,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
      if (!res.ok || String(data.success) !== "true") throw new Error(data.message || `HTTP ${res.status}`);

      // Enviado: la hoja vuelve al sobre
      clearTimeout(slowTimer);
      clearTimeout(abortTimer);
      setSending(false);
      measureFlight();
      go("sending");
      later(() => {
        resetForm();
        closeModal("sent");
      }, SEND_MS);
    } catch (err) {
      clearTimeout(slowTimer);
      clearTimeout(abortTimer);
      setSending(false);
      const msg = err instanceof Error ? err.message : "";
      setError(
        /access.?key/i.test(msg)
          ? "El formulario no está disponible ahora. Envíame tu mensaje desde tu correo:"
          : ctrl.signal.aborted
            ? "El envío está tardando demasiado. Puedes enviármelo desde tu correo:"
            : "No se pudo enviar el mensaje. Inténtalo de nuevo o envíamelo desde tu correo:",
      );
    }
  };

  // Alternativa si el envío falla: abre el correo del visitante con todo ya escrito
  const mailtoHref = `mailto:${SITE.email}?subject=${encodeURIComponent(`Portafolio · ${reason} — ${name}`)}&body=${encodeURIComponent(
    `${message}\n\n— ${name}${email ? ` (${email})` : ""}`,
  )}`;

  // Si el navegador cerrara el modal por su cuenta, se sincroniza el estado
  const onDialogClose = () => {
    if (phaseRef.current === "open") {
      document.documentElement.style.overflow = "";
      go("idle");
    }
  };

  const envOpen = phase === "opening" || phase === "open" || phase === "sending";
  const inModal = phase === "open" || phase === "tearing" || phase === "sending";
  const busy = phase !== "idle" && phase !== "sent";

  return (
    <div className={`callup${envOpen ? " is-open" : ""}${inModal ? " is-modal" : ""}`}>
      <p className="callup__hint" aria-live="polite">
        {phase === "sent" ? (
          <>
            <HiCheck className="h-4 w-4" aria-hidden="true" />{" "}
            {CONTACT_FORM_KEY ? "¡Mensaje enviado! Te responderé pronto." : "¡Listo! Termina de enviarlo desde tu correo."}
          </>
        ) : (
          <>
            <FaFutbol className="ball-spin h-4 w-4" aria-hidden="true" /> Abre el sobre para escribirme
          </>
        )}
      </p>

      <div className="env">
        <div className="env__back" aria-hidden="true" />

        {/* Hoja que asoma al abrir el sobre (decorativa) */}
        <div ref={peekRef} className="env__peek" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="env__front" aria-hidden="true">
          <svg className="env__fold" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline points="0,0 50,42 100,0" />
          </svg>
          <div className="env__address">
            <small>Para</small>
            <b>{SITE.name}</b>
            <span>
              {SITE.role} · {SITE.location}
            </span>
          </div>
          <div className="env__stamp">
            <FaFutbol />
            <span>EC · 2026</span>
          </div>
        </div>

        <div className="env__flap" aria-hidden="true">
          <span className="env__seal">{phase === "sent" ? <HiCheck /> : <FaFutbol />}</span>
        </div>

        {/* Todo el sobre es clicable; el botón de abajo es el accesible por teclado */}
        <button type="button" className="env__hit" onClick={openLetter} tabIndex={-1} aria-hidden="true" />
      </div>

      <button
        ref={ctaRef}
        type="button"
        className="doc-btn doc-btn--solid callup__cta"
        onClick={openLetter}
        aria-disabled={busy}
        aria-haspopup="dialog"
      >
        <HiOutlineEnvelope className="h-5 w-5" aria-hidden="true" />
        {phase === "sent" ? "Escribir otro mensaje" : "Escribir mensaje"}
      </button>

      <dialog
        ref={dialogRef}
        className={`callup-modal is-${phase}`}
        aria-labelledby="callup-title"
        onCancel={(e) => {
          e.preventDefault(); // Esc también rompe la hoja
          tearLetter();
        }}
        onClose={onDialogClose}
      >
        <div ref={sheetRef} className="sheet">
          <div ref={paperRef} className="sheet__paper">
            <svg className="sheet__watermark" viewBox="0 0 100 64" aria-hidden="true">
              <rect x="2" y="2" width="96" height="60" rx="1" />
              <line x1="50" y1="2" x2="50" y2="62" />
              <circle cx="50" cy="32" r="9" />
              <rect x="2" y="18" width="14" height="28" />
              <rect x="84" y="18" width="14" height="28" />
            </svg>

            <header className="sheet__head">
              <span className="sheet__crest" aria-hidden="true">
                <FaFutbol />
              </span>
              <div className="min-w-0">
                <p className="sheet__kicker">Nuevo mensaje</p>
                <h3 id="callup-title" className="sheet__title">
                  Hablemos de tu proyecto
                </h3>
              </div>
              <button type="button" className="sheet__x" onClick={tearLetter} aria-label="Cancelar y cerrar">
                <HiXMark className="h-5 w-5" />
              </button>
            </header>

            <p className="sheet__intro">
              Hola, soy {SITE.name.split(" ")[0]}. Cuéntame qué necesitas y te respondo lo antes posible.
            </p>

            <form onSubmit={onSubmit} className="sheet__form">
              <label className="sheet__field">
                <span>Tu nombre</span>
                <input
                  ref={nameRef}
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Ana Torres"
                />
              </label>

              <label className="sheet__field">
                <span>Tu correo</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                />
              </label>

              {/* Trampa para bots: invisible para las personas */}
              <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" className="sheet__honey" aria-hidden="true" />

              <fieldset className="sheet__field">
                <legend>¿De qué se trata?</legend>
                <div className="sheet__reasons">
                  {REASONS.map((r) => (
                    <label key={r} className={`sheet__reason${reason === r ? " is-on" : ""}`}>
                      <input
                        type="radio"
                        name="reason"
                        value={r}
                        checked={reason === r}
                        onChange={() => setReason(r)}
                      />
                      {r}
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="sheet__field">
                <span>Tu mensaje</span>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Cuéntame sobre tu proyecto, propuesta o idea…"
                />
              </label>

              <div className="sheet__foot">
                <button type="button" className="sheet__cancel" onClick={tearLetter}>
                  <HiXMark className="h-5 w-5" aria-hidden="true" /> Cancelar
                </button>
                <button type="submit" className="sheet__send" disabled={sending} aria-busy={sending}>
                  {sending ? (
                    <>
                      <FaFutbol className="ball-spin h-5 w-5" aria-hidden="true" />
                      {slow ? "Enviando… puede tardar unos segundos" : "Enviando…"}
                    </>
                  ) : (
                    <>
                      <HiOutlinePaperAirplane className="h-5 w-5" aria-hidden="true" /> Enviar mensaje
                    </>
                  )}
                </button>
              </div>
              {error ? (
                <div className="sheet__error" role="alert">
                  <p>{error}</p>
                  <a href={mailtoHref} className="sheet__fallback">
                    <HiOutlineEnvelope className="h-4 w-4" aria-hidden="true" /> Enviar desde mi correo
                  </a>
                </div>
              ) : (
                <p className="sheet__note">
                  {CONTACT_FORM_KEY ? "Tu mensaje me llegará directo al correo." : "Se abrirá tu correo con el mensaje listo para enviar."}
                </p>
              )}
            </form>
          </div>

          {/* Mitades de la hoja rota: se rellenan con una copia al cancelar */}
          <div ref={halfL} className="sheet__half sheet__half--l" style={{ clipPath: CLIP_L }} inert aria-hidden="true" />
          <div ref={halfR} className="sheet__half sheet__half--r" style={{ clipPath: CLIP_R }} inert aria-hidden="true" />
        </div>
      </dialog>
    </div>
  );
};
