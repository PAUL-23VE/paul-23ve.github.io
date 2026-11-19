import type { CSSProperties } from "react";
import { FaFutbol } from "react-icons/fa";

import { HeroOrbit } from "@/components/sub/hero-orbit";
import { SITE } from "@/constants";

// Entrada animada solo con CSS: no depende de JavaScript para mostrarse.
const enter = (x: string, y: string, delay: number) =>
  ({ "--rx": x, "--ry": y, "--rd": `${delay}s` }) as CSSProperties;

export const HeroContent = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center px-6 md:px-20 mt-40 w-full z-[20] gap-10">
      <div className="h-full w-full flex flex-col gap-5 justify-center m-auto text-start">
        <div
          data-reveal="in"
          style={enter("0px", "-40px", 0.2)}
          className="Welcome-box py-[8px] px-[10px] border border-[#1ce09f8b]"
        >
          <FaFutbol className="ball-spin text-[#a6f4da] mr-[10px] h-[18px] w-[18px]" aria-hidden="true" />
          <p className="Welcome-text text-[13px]">
            {SITE.role} · {SITE.location}
          </p>
        </div>

        <h1
          data-reveal="in"
          style={enter("-60px", "0px", 0.35)}
          className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-white max-w-[640px] leading-tight"
        >
          Hola, soy{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-400">
            {SITE.name}
          </span>
          .
        </h1>

        <p
          data-reveal="in"
          style={enter("-60px", "0px", 0.5)}
          className="text-lg text-gray-400 my-3 max-w-[600px]"
        >
          Estudiante de {SITE.career} y desarrollador full stack. Construyo
          aplicaciones web completas: interfaces en React y las APIs que las
          sostienen. Mira mis proyectos y habilidades.
        </p>

        <div
          data-reveal="in"
          style={enter("-60px", "0px", 0.65)}
          className="flex flex-wrap gap-4"
        >
          <a
            href="#projects"
            className="py-3 px-8 button-primary text-center text-white cursor-pointer rounded-lg"
          >
            Ver proyectos
          </a>
          <a
            href="#contact"
            className="py-3 px-8 text-center text-white cursor-pointer rounded-lg border border-[#1ce09f8b] hover:bg-[#1ce09f22] transition"
          >
            Contáctame
          </a>
          {SITE.cv && (
            <a
              href={SITE.cv}
              download="CV-Paul-Velastegui.pdf"
              className="py-3 px-8 text-center text-white cursor-pointer rounded-lg border border-[#1ce09f8b] hover:bg-[#1ce09f22] transition"
            >
              Descargar CV
            </a>
          )}
        </div>
      </div>

      <div
        data-reveal="in"
        style={enter("60px", "0px", 0.5)}
        className="w-full h-full hidden md:flex justify-center items-center"
      >
        <HeroOrbit />
      </div>
    </div>
  );
};
