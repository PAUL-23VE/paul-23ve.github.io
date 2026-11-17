import type { Metadata } from "next";

export const siteConfig: Metadata = {
  metadataBase: new URL("https://paul-23ve.github.io"),
  title: "Paul Velastegui | Desarrollador Full Stack",
  description:
    "Portafolio de Paul Velastegui, desarrollador full stack y estudiante de Ingeniería de Software en Ambato, Ecuador. React, Node.js, .NET, Spring Boot y más.",
  keywords: [
    "Paul Velastegui",
    "portafolio",
    "desarrollador full stack",
    "ingeniería de software",
    "Ambato",
    "Ecuador",
    "React",
    "Next.js",
    "Node.js",
    "NestJS",
    ".NET",
    "Spring Boot",
  ],
  authors: { name: "Paul Velastegui", url: "https://github.com/PAUL-23VE" },
  openGraph: {
    type: "website",
    url: "https://paul-23ve.github.io",
    title: "Paul Velastegui | Desarrollador Full Stack",
    description:
      "Proyectos web, móviles y de videojuegos construidos en equipo: FuelWise, Farma Ya, Marketplace Multiempresa y Pixel Odyssey.",
    images: ["/images/combustible2.png"],
    locale: "es_EC",
  },
};
