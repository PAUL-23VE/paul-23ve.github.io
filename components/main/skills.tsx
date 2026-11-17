"use client";

import type { CSSProperties } from "react";

import { SectionHeading } from "@/components/sub/section-heading";
import { SkillDataProvider } from "@/components/sub/skill-data-provider";
import { SKILL_GROUPS } from "@/constants";

export const Skills = () => {
  return (
    <section
      id="skills"
      className="flex flex-col items-center justify-center gap-3 h-full relative overflow-hidden py-20 px-6"
    >
      <SectionHeading
        badge="Habilidades"
        title="Tecnologías con las que construyo"
        subtitle="Del navegador a la base de datos."
      />

      <div className="flex w-full max-w-5xl flex-col gap-12">
        {SKILL_GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col items-center gap-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b49bff]">
              {group.title}
            </h3>
            <ul className="skill-row" style={{ "--per-row": group.perRow } as CSSProperties}>
              {group.skills.map((skill, i) => (
                <li key={skill.skill_name}>
                  <SkillDataProvider skill={skill} index={i} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="w-full h-full absolute pointer-events-none" aria-hidden="true">
        <div className="w-full h-full z-[-10] opacity-30 absolute flex items-center justify-center bg-cover">
          <video className="w-full h-auto" preload="none" playsInline loop muted autoPlay>
            <source src="/videos/skills-bg.webm" type="video/webm" />
          </video>
        </div>
      </div>
    </section>
  );
};
