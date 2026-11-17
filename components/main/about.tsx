import Image from "next/image";
import {
  HiOutlineAcademicCap, HiOutlineCodeBracket, HiOutlineMapPin, HiOutlineServerStack,
  HiOutlineUserGroup, HiOutlineUsers,
} from "react-icons/hi2";

import { Reveal } from "@/components/sub/reveal";
import { SectionHeading } from "@/components/sub/section-heading";
import { TiltCard } from "@/components/sub/tilt-card";
import { ABOUT, PROJECTS, SERVICES, SITE } from "@/constants";

// Un icono por tarjeta de servicio, en el mismo orden que SERVICES.
const SERVICE_ICONS = [HiOutlineCodeBracket, HiOutlineServerStack, HiOutlineUserGroup];

export const About = () => {
  return (
    <section id="about-me" className="flex flex-col items-center py-20 px-6 md:px-20">
      <SectionHeading
        badge="Sobre mí"
        title="Quién soy y cómo trabajo"
        subtitle="Constancia, equipo y ganas de mejorar."
      />

      <div className="w-full max-w-6xl grid grid-cols-1 gap-8 md:grid-cols-[300px_minmax(0,1fr)] items-start">
        <Reveal from="left">
          <TiltCard max={6} className="glass-card p-6 flex flex-col gap-3">
            <div className="tilt__pop relative">
              <div
                aria-hidden="true"
                className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 opacity-60 blur-md"
              />
              <Image
                src={SITE.photo}
                alt="Retrato de Paul Velastegui"
                width={300}
                height={248}
                className="relative w-full aspect-square object-cover object-[50%_20%] rounded-xl"
              />
            </div>
            <h3 className="text-xl font-semibold text-white mt-2">{SITE.name}</h3>
            <p className="text-gray-400">{SITE.role}</p>
            <p className="flex items-center gap-2 text-sm text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
              Disponible para proyectos
            </p>
            <ul className="mt-2 pt-4 border-t border-[#7042f861] flex flex-col gap-3 text-sm text-gray-300">
              <li className="flex gap-3">
                <HiOutlineAcademicCap className="h-5 w-5 shrink-0 text-[#b49bff]" />
                {SITE.career} · {SITE.university}
              </li>
              <li className="flex gap-3">
                <HiOutlineMapPin className="h-5 w-5 shrink-0 text-[#b49bff]" />
                {SITE.location}
              </li>
              <li className="flex gap-3">
                <HiOutlineUsers className="h-5 w-5 shrink-0 text-[#b49bff]" />
                {PROJECTS.length} proyectos, uno en prácticas
              </li>
            </ul>
          </TiltCard>
        </Reveal>

        <div className="flex flex-col gap-5">
          {ABOUT.map((paragraph, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "text-xl md:text-2xl text-white leading-snug"
                  : "text-lg text-gray-300"
              }
            >
              {paragraph}
            </p>
          ))}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mt-6">
            {SERVICES.map((service, i) => {
              const Icon = SERVICE_ICONS[i];
              return (
                <Reveal key={service.title} delay={i * 0.12} className="h-full">
                  <TiltCard className="service-card h-full p-5 flex flex-col">
                    <div className="flex items-start justify-between">
                      <span className="tilt__pop service-card__icon">
                        <Icon className="h-7 w-7" aria-hidden="true" />
                      </span>
                      <span className="service-card__num" aria-hidden="true">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="tilt__pop-soft text-lg font-semibold text-white mt-5">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2">{service.text}</p>
                    <ul className="tilt__pop-soft flex flex-wrap gap-1.5 mt-auto pt-4" aria-label="Tecnologías">
                      {service.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-[#7042f861] bg-[#7042f81f] px-2.5 py-0.5 text-[11px] text-gray-200"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
