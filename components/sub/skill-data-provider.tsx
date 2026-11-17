import Image from "next/image";
import type { CSSProperties } from "react";

import { Reveal } from "@/components/sub/reveal";
import { TiltCard } from "@/components/sub/tilt-card";
import type { Skill } from "@/constants";

type SkillDataProviderProps = {
  skill: Skill;
  index: number;
};

// Logo de una tecnología con efecto 3D: se inclina hacia el cursor y sobresale, sin tarjeta.
export const SkillDataProvider = ({ skill, index }: SkillDataProviderProps) => {
  const { skill_name: name, image, icon: Icon, color = "#b49bff", size } = skill;
  const logo = size;

  return (
    <Reveal delay={index * 0.06}>
      <TiltCard max={20} className="skill-tile" style={{ "--brand": color } as CSSProperties}>
        <span className="skill-tile__logo">
          {image ? (
            <Image
              src={`/skills/${image}`}
              width={logo}
              height={logo}
              alt=""
              style={{ width: logo, height: "auto", maxHeight: 80, objectFit: "contain" }}
            />
          ) : Icon ? (
            <Icon size={logo} color={color} aria-hidden="true" />
          ) : null}
        </span>
        <span className="skill-tile__name">{name}</span>
      </TiltCard>
    </Reveal>
  );
};
