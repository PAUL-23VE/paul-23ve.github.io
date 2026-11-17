"use client";

import { useState } from "react";

import { ProjectCard } from "@/components/sub/project-card";
import { SectionHeading } from "@/components/sub/section-heading";
import { PROJECT_FILTERS, PROJECTS, type ProjectKind } from "@/constants";

const TECH_COUNT = new Set(PROJECTS.flatMap((p) => p.stack)).size;
const SHOT_COUNT = PROJECTS.reduce((n, p) => n + p.images.length, 0);

const countFor = (id: ProjectKind | "todos") =>
  id === "todos" ? PROJECTS.length : PROJECTS.filter((p) => p.kinds.includes(id)).length;

export const Projects = () => {
  const [filter, setFilter] = useState<ProjectKind | "todos">("todos");
  const list = PROJECTS.filter((p) => filter === "todos" || p.kinds.includes(filter));

  return (
    <section id="projects" className="flex flex-col items-center justify-center py-20">
      <SectionHeading
        badge="Proyectos"
        title="Mis proyectos"
        subtitle="Sistemas completos: en prácticas preprofesionales y construidos en equipo."
      />

      <ul className="proj-stats" aria-label="Resumen">
        <li>
          <b>{PROJECTS.length}</b> proyectos
        </li>
        <li>
          <b>{TECH_COUNT}</b> tecnologías
        </li>
        <li>
          <b>{SHOT_COUNT}</b> capturas
        </li>
      </ul>

      <div className="proj-filters" role="group" aria-label="Filtrar proyectos">
        {PROJECT_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`proj-filter ${filter === f.id ? "is-active" : ""}`}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
            <span className="proj-filter__count">{countFor(f.id)}</span>
          </button>
        ))}
      </div>

      {/* La clave cambia con el filtro: las tarjetas se montan de nuevo y repiten su entrada. */}
      <div key={filter} className="w-full max-w-6xl flex flex-col gap-24 px-5 md:px-10">
        {list.map((project, i) => (
          <ProjectCard
            key={project.title}
            project={project}
            number={PROJECTS.indexOf(project)}
            reverse={i % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
};
