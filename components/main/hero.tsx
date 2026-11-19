import { HeroContent } from "@/components/sub/hero-content";

// El estadio 3D del fondo (components/main/stadium-scene.tsx) cubre toda la página.
export const Hero = () => {
  return (
    <section id="inicio" className="relative flex flex-col h-full w-full">
      <HeroContent />
    </section>
  );
};
