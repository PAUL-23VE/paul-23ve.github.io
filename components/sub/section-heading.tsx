import { SparklesIcon } from "@heroicons/react/24/solid";

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
      <Reveal from="top">
        <div className="Welcome-box py-[8px] px-[10px] border border-[#7042f88b] opacity-[0.9]">
          <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
          <p className="Welcome-text text-[13px]">{badge}</p>
        </div>
      </Reveal>

      <Reveal from="left" delay={0.15}>
        <h2 className="text-[30px] md:text-[40px] font-semibold mt-[14px] text-center mb-[10px] text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
          {title}
        </h2>
      </Reveal>

      {subtitle && (
        <Reveal from="right" delay={0.15}>
          <p className="cursive text-[20px] text-gray-200 mb-10 mt-[6px] text-center">
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
};
