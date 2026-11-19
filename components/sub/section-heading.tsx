import { FaFutbol } from "react-icons/fa";

import { Reveal } from "@/components/sub/reveal";

type SectionHeadingProps = {
  badge: string;
  title: string;
  subtitle?: string;
};

// Encabezado de sección con el estilo de la plantilla: insignia, título y frase cursiva.
export const SectionHeading = ({ badge, title, subtitle }: SectionHeadingProps) => {
  return (
    <div className="w-full h-auto flex flex-col items-center justify-center px-6">
      {/* Entrada: la insignia cae y rebota, el título se despliega y la frase sube */}
      <Reveal effect="drop">
        <div className="Welcome-box py-[8px] px-[10px] border border-[#1ce09f8b] opacity-[0.9]">
          <FaFutbol className="ball-spin text-[#a6f4da] mr-[10px] h-[18px] w-[18px]" aria-hidden="true" />
          <p className="Welcome-text text-[13px]">{badge}</p>
        </div>
      </Reveal>

      <Reveal effect="flip" delay={0.15}>
        <h2 className="text-[30px] md:text-[40px] font-semibold mt-[14px] text-center mb-[10px] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-400">
          {title}
        </h2>
      </Reveal>

      {subtitle && (
        <Reveal delay={0.4}>
          <p className="cursive text-[20px] text-gray-200 mb-10 mt-[6px] text-center">
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
};
