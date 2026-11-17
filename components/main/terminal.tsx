"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

import { SectionHeading } from "@/components/sub/section-heading";
import { TiltCard } from "@/components/sub/tilt-card";
import { ABOUT, CERTIFICATES, CONTACT_CHANNELS, CV, PROJECTS, SITE, SKILL_GROUPS } from "@/constants";

type Entry = { id: number; cmd?: string; out: ReactNode };

// Comandos disponibles. Para añadir uno, agrégalo aquí: aparece solo en `ayuda` y en los botones.
const COMMANDS: Record<string, { desc: string; run: () => ReactNode }> = {
  "sobre-mi": {
    desc: "quién soy",
    run: () => (
      <>
        <p>
          <b className="term__hi">{SITE.name}</b> — {SITE.role}
        </p>
        <p>
          {SITE.career} · {SITE.university}
        </p>
        <p>{SITE.location}</p>
        <p className="term__ok">● Disponible para proyectos</p>
        <p className="term__dim">{ABOUT[0]}</p>
      </>
    ),
  },
  stack: {
    desc: "tecnologías que uso",
    run: () => (
      <>
        {SKILL_GROUPS.map((group) => (
          <p key={group.title}>
            <b className="term__key">{group.title.toLowerCase()}:</b>{" "}
            {group.skills.map((skill) => skill.skill_name).join(", ")}
          </p>
        ))}
      </>
    ),
  },
  proyectos: {
    desc: "en qué he trabajado",
    run: () => (
      <>
        {PROJECTS.map((project, i) => (
          <p key={project.title}>
            <span className="term__dim">{i + 1}.</span> <b className="term__hi">{project.title}</b>{" "}
            <span className="term__dim">({project.category})</span> — {project.stack.join(", ")}
          </p>
        ))}
        <p>
          <a href="#projects" className="term__link">
            → ver capturas y repositorios
          </a>
        </p>
      </>
    ),
  },
  certificados: {
    desc: "mis certificados",
    run: () => (
      <>
        {CERTIFICATES.map((cert) => (
          <p key={cert.id}>
            <span className="term__ok">✔</span> <b className="term__hi">{cert.title}</b>{" "}
            <span className="term__dim">— {cert.date}</span>
          </p>
        ))}
        <p>
          <a href="#certificates" className="term__link">
            → verlos en 3D
          </a>
        </p>
      </>
    ),
  },
  cv: {
    desc: "experiencia y currículum",
    run: () => (
      <>
        {CV.experience.map((job) => (
          <div key={job.company} className="mb-2">
            <p>
              <b className="term__hi">{job.role}</b> — {job.company}{" "}
              <span className="term__dim">({job.period})</span>
            </p>
            {job.highlights.map((item) => (
              <p key={item} className="term__dim">
                · {item}
              </p>
            ))}
          </div>
        ))}
        <p>
          <a href={CV.pdf} target="_blank" rel="noreferrer noopener" className="term__link">
            → abrir CV (PDF)
          </a>
        </p>
      </>
    ),
  },
  contacto: {
    desc: "cómo escribirme",
    run: () => (
      <>
        <p>
          <b className="term__key">correo:</b>{" "}
          <a href={`mailto:${SITE.email}`} className="term__link">
            {SITE.email}
          </a>
        </p>
        {CONTACT_CHANNELS.map((channel) => (
          <p key={channel.name}>
            <b className="term__key">{channel.name.toLowerCase()}:</b>{" "}
            <a href={channel.link} target="_blank" rel="noreferrer noopener" className="term__link">
              {channel.value}
            </a>
          </p>
        ))}
      </>
    ),
  },
};

const NAMES = Object.keys(COMMANDS);
const ALIASES: Record<string, string> = {
  help: "ayuda",
  clear: "limpiar",
  cls: "limpiar",
  whoami: "sobre-mi",
  ls: "proyectos",
};

const HELP = (
  <>
    {NAMES.map((name) => (
      <p key={name}>
        <b className="term__key">{name}</b> <span className="term__dim">— {COMMANDS[name].desc}</span>
      </p>
    ))}
    <p>
      <b className="term__key">limpiar</b> <span className="term__dim">— vaciar la consola</span>
    </p>
  </>
);

const WELCOME: Entry = {
  id: 0,
  out: (
    <p className="term__dim">
      Bienvenido. Escribe <b className="term__key">ayuda</b> o toca un comando de abajo.
    </p>
  ),
};

const DEMO = "sobre-mi";

export const Terminal = () => {
  const [entries, setEntries] = useState<Entry[]>([WELCOME]);
  const [input, setInput] = useState("");
  const nextId = useRef(1);
  const touched = useRef(false); // el visitante ya interactuó: no más demostración automática
  const sectionRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const run = (raw: string) => {
    const typed = raw.trim().toLowerCase();
    if (!typed) return;
    const cmd = ALIASES[typed] ?? typed;
    if (cmd === "limpiar") {
      setEntries([]);
      return;
    }
    const out =
      cmd === "ayuda" ? (
        HELP
      ) : COMMANDS[cmd] ? (
        COMMANDS[cmd].run()
      ) : (
        <p className="term__err">
          comando no encontrado: {typed}. Escribe <b className="term__key">ayuda</b>.
        </p>
      );
    const id = nextId.current++;
    setEntries((list) => [...list, { id, cmd: typed, out }]);
  };

  // La consola se desplaza sola hasta la última respuesta (sin mover la página).
  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [entries]);

  // Demostración: la primera vez que la sección aparece, se escribe sola un comando.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let timer: ReturnType<typeof setInterval> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (touched.current) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          run(DEMO);
          return;
        }
        let i = 0;
        timer = setInterval(() => {
          if (touched.current) {
            clearInterval(timer);
            return;
          }
          i += 1;
          setInput(DEMO.slice(0, i));
          if (i === DEMO.length) {
            clearInterval(timer);
            setTimeout(() => {
              if (touched.current) return;
              setInput("");
              run(DEMO);
            }, 450);
          }
        }, 110);
      },
      { threshold: 0.45 }
    );
    observer.observe(section);
    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, []);

  const interact = () => {
    if (!touched.current) {
      touched.current = true;
      setInput("");
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(input);
    setInput("");
  };

  return (
    <section
      id="terminal"
      ref={sectionRef}
      aria-label="Terminal interactiva"
      className="flex flex-col items-center py-20 px-6"
    >
      <SectionHeading
        badge="Terminal"
        title="Explora mi perfil desde la consola"
        subtitle="Escribe un comando o toca uno."
      />

      <div className="term-wrap">
        <TiltCard max={5} className="term">
          <div className="term__bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>paul@portafolio: ~</span>
          </div>

          <div
            ref={bodyRef}
            className="term__body"
            onClick={() => inputRef.current?.focus({ preventScroll: true })}
          >
            <div aria-live="polite">
              {entries.map((entry) => (
                <div key={entry.id} className="term__entry">
                  {entry.cmd && (
                    <p>
                      <span className="term__prompt">paul@portafolio:~$</span> {entry.cmd}
                    </p>
                  )}
                  <div className="term__out">{entry.out}</div>
                </div>
              ))}
            </div>

            <form onSubmit={onSubmit} className="term__line">
              <label htmlFor="term-input" className="term__prompt">
                paul@portafolio:~$
              </label>
              <input
                id="term-input"
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  touched.current = true;
                  setInput(e.target.value);
                }}
                onFocus={interact}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                aria-label="Escribe un comando"
              />
            </form>
          </div>
        </TiltCard>

        <div className="term__chips">
          {["ayuda", ...NAMES, "limpiar"].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                interact();
                run(name);
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
