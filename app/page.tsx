import { About } from "@/components/main/about";
import { Certificates } from "@/components/main/certificates";
import { Contact } from "@/components/main/contact";
import { Hero } from "@/components/main/hero";
import { Projects } from "@/components/main/projects";
import { Skills } from "@/components/main/skills";
import { Terminal } from "@/components/main/terminal";

export default function Home() {
  return (
    <main className="h-full w-full">
      <div className="flex flex-col gap-20">
        <Hero />
        <About />
        <Skills />
        <Terminal />
        <Projects />
        <Certificates />
        <Contact />
      </div>
    </main>
  );
}
