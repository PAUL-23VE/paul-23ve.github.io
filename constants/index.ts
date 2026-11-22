// ─────────────────────────────────────────────────────────────
//  Todo el contenido del portafolio vive aquí.
//  Para actualizar textos, proyectos o enlaces, edita solo este archivo.
// ─────────────────────────────────────────────────────────────
import type { IconType } from "react-icons";
import { FaAws, FaFacebook, FaJava, FaWhatsapp } from "react-icons/fa";
import { RxGithubLogo, RxInstagramLogo, RxLinkedinLogo } from "react-icons/rx";
import {
  SiDocker, SiDotnet, SiGit, SiGithub, SiHtml5, SiJavascript, SiJest, SiLaravel,
  SiMongodb, SiNestjs, SiNextdotjs, SiNodedotjs, SiPhp, SiPostgresql, SiReact,
  SiRuby, SiSpringboot, SiTailwindcss, SiTestinglibrary, SiTypescript, SiUnity,
} from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb";

// Clave de Web3Forms para el formulario de contacto (pública por diseño: solo permite
// enviar mensajes a tu correo). Se obtiene gratis en https://web3forms.com escribiendo tu
// correo; llega al instante. Vacía = el botón "Enviar" abre el correo del visitante.
export const CONTACT_FORM_KEY = "7671035b-6738-4800-9c77-9751626da139";

export const SITE = {
  name: "Paul Velastegui",
  role: "Desarrollador Full Stack",
  location: "Ambato, Ecuador",
  university: "Universidad Técnica de Ambato",
  career: "Ingeniería de Software",
  email: "paulvelastegui2016@gmail.com",
  url: "https://paul-23ve.github.io",
  photo: "/images/PERFIL1.png",
  // CV publicado (copia sin la cédula). Activa el botón "Descargar CV" del inicio.
  cv: "/cv/cv-paul-velastegui.pdf",
  whatsapp: "https://wa.me/593978954385",
  whatsappLabel: "+593 97 895 4385",
  github: "https://github.com/PAUL-23VE",
  linkedin: "https://www.linkedin.com/in/paul-velastegui-703942226/",
  instagram: "https://www.instagram.com/paul_velastegui25",
  facebook: "https://www.facebook.com/share/1CVtFZ5Ujm/",
} as const;

// Fichas de la órbita del inicio. `x` / `y` son la posición del centro de la ficha
// en % dentro del círculo; `color` es el color de marca que aparece al pasar el cursor.
export type HeroTech = { name: string; icon: IconType; color: string; x: number; y: number; faded?: boolean };

export const HERO_TECH: ReadonlyArray<HeroTech> = [
  { name: "React", icon: SiReact, color: "#61dafb", x: 22, y: 10 },
  { name: "JavaScript", icon: SiJavascript, color: "#f7df1e", x: 55, y: 15 },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#6aa5e0", x: 85, y: 27 },
  { name: "Node.js", icon: SiNodedotjs, color: "#7cc327", x: 37, y: 31 },
  { name: "Next.js", icon: SiNextdotjs, color: "#ffffff", x: 67, y: 38 },
  { name: "MongoDB", icon: SiMongodb, color: "#4db33d", x: 7, y: 30 },
  { name: "NestJS", icon: SiNestjs, color: "#ff3b62", x: 19, y: 50 },
  { name: "TypeScript", icon: SiTypescript, color: "#3b9cf5", x: 45, y: 53 },
  { name: ".NET", icon: SiDotnet, color: "#a78bfa", x: 66, y: 62 },
  { name: "C#", icon: TbBrandCSharp, color: "#c792ea", x: 88, y: 55 },
  { name: "Spring Boot", icon: SiSpringboot, color: "#7ed957", x: 23, y: 73 },
  { name: "GitHub", icon: SiGithub, color: "#ffffff", x: 49, y: 77 },
  { name: "Docker", icon: SiDocker, color: "#38a9f0", x: 76, y: 82 },
  { name: "HTML", icon: SiHtml5, color: "#ff6a33", x: 14, y: 93, faded: true },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#38bdf8", x: 58, y: 95, faded: true },
];

export const ABOUT = [
  "Soy estudiante de Ingeniería de Software en la Universidad Técnica de Ambato y me enfoco en el desarrollo web full stack: interfaces modernas con React y APIs REST que las sostienen.",
  "He trabajado en equipo en sistemas completos —control de flotas, farmacias, marketplaces y hasta un videojuego— conectando frontend, backend y base de datos de principio a fin.",
  "Fuera del código juego fútbol, y de ahí me llevo lo mismo que aplico en cada proyecto: trabajo en equipo, constancia y ganas de mejorar en cada partido.",
] as const;

export const SERVICES = [
  {
    title: "Desarrollo web",
    text: "Sitios y aplicaciones responsivas con React, pensadas primero para quien las usa.",
    tags: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    title: "Backend y APIs",
    text: "APIs REST con Node.js, NestJS, .NET o Spring Boot, y bases de datos relacionales y NoSQL.",
    tags: ["Node.js", "NestJS", ".NET", "Spring Boot"],
  },
  {
    title: "Trabajo en equipo",
    text: "Git, ramas, revisiones y entregas por partes: frontend y backend independientes que se integran sin sorpresas.",
    tags: ["Git", "GitHub", "API REST"],
  },
] as const;

// Una habilidad usa `image` (archivo en /public/skills) o `icon`.
// `color` es el color de marca: tiñe el icono y el brillo de la ficha al pasar el cursor.
export type Skill = {
  skill_name: string;
  image?: string;
  icon?: IconType;
  color?: string;
  size: number;
};

// `perRow` es cuántas fichas caben por fila en escritorio (para que las filas queden parejas).
export const SKILL_GROUPS: ReadonlyArray<{ title: string; perRow: number; skills: ReadonlyArray<Skill> }> = [
  {
    title: "Frontend",
    perRow: 7,
    skills: [
      { skill_name: "HTML", image: "html.png", color: "#e34f26", size: 72 },
      { skill_name: "CSS", image: "css.png", color: "#2965f1", size: 72 },
      { skill_name: "JavaScript", image: "js.png", color: "#f7df1e", size: 60 },
      { skill_name: "TypeScript", image: "ts.png", color: "#3178c6", size: 72 },
      { skill_name: "React", image: "react.png", color: "#61dafb", size: 72 },
      { skill_name: "Next.js", image: "next.png", color: "#ffffff", size: 72 },
      { skill_name: "Tailwind CSS", image: "tailwind.png", color: "#38bdf8", size: 72 },
    ],
  },
  {
    title: "Backend",
    perRow: 5,
    skills: [
      { skill_name: "Node.js", image: "node.png", color: "#7cc327", size: 72 },
      { skill_name: "Express", image: "express.png", color: "#ffffff", size: 72 },
      { skill_name: "NestJS", icon: SiNestjs, color: "#e0234e", size: 56 },
      { skill_name: ".NET", icon: SiDotnet, color: "#8f6bff", size: 60 },
      { skill_name: "C#", icon: TbBrandCSharp, color: "#b77fd0", size: 60 },
      { skill_name: "Java", icon: FaJava, color: "#f89820", size: 58 },
      { skill_name: "Spring Boot", icon: SiSpringboot, color: "#6db33f", size: 54 },
      { skill_name: "PHP", icon: SiPhp, color: "#8892bf", size: 64 },
      { skill_name: "Laravel", icon: SiLaravel, color: "#ff2d20", size: 54 },
      { skill_name: "Ruby", icon: SiRuby, color: "#e0423b", size: 50 },
    ],
  },
  {
    title: "Bases de datos",
    perRow: 4,
    skills: [
      { skill_name: "PostgreSQL", image: "postgresql.png", color: "#6aa5e0", size: 64 },
      { skill_name: "MySQL", image: "mysql.png", color: "#00a4c7", size: 64 },
      { skill_name: "MongoDB", image: "mongodb.png", color: "#4db33d", size: 36 },
      { skill_name: "GraphQL", image: "graphql.png", color: "#e535ab", size: 72 },
    ],
  },
  {
    title: "Herramientas",
    perRow: 7,
    skills: [
      { skill_name: "Git", icon: SiGit, color: "#f1502f", size: 54 },
      { skill_name: "GitHub", icon: SiGithub, color: "#ffffff", size: 54 },
      { skill_name: "Docker", image: "docker.png", color: "#38a9f0", size: 64 },
      { skill_name: "AWS", icon: FaAws, color: "#ff9900", size: 60 },
      { skill_name: "Unity", icon: SiUnity, color: "#e6e6e6", size: 54 },
      { skill_name: "Jest", icon: SiJest, color: "#c63d14", size: 52 },
      { skill_name: "Testing Library", icon: SiTestinglibrary, color: "#e33332", size: 54 },
    ],
  },
];

export type Project = {
  title: string;
  category: string;
  description: string;
  highlights: ReadonlyArray<string>;
  stack: ReadonlyArray<string>;
  team: string;
  images: ReadonlyArray<{ src: string; mobile?: boolean }>;
  links: ReadonlyArray<{ label: string; url: string }>;
  privateRepo?: boolean;
  /** Etiqueta destacada junto a la categoría. */
  badge?: string;
  /** Filtros en los que aparece (ver PROJECT_FILTERS). */
  kinds: ReadonlyArray<ProjectKind>;
  /** Color de acento del escenario 3D. */
  color: string;
  /** Texto de la barra de direcciones del marco de navegador. */
  domain: string;
};

export type ProjectKind = "pasantias" | "web" | "movil" | "juegos";

export const PROJECT_FILTERS: ReadonlyArray<{ id: ProjectKind | "todos"; label: string }> = [
  { id: "todos", label: "Todos" },
  { id: "pasantias", label: "Prácticas" },
  { id: "web", label: "Web" },
  { id: "movil", label: "Móvil" },
  { id: "juegos", label: "Videojuegos" },
];

export const PROJECTS: ReadonlyArray<Project> = [
  {
    title: "Mushuc Granja",
    category: "Sistema de gestión ganadera",
    badge: "Prácticas preprofesionales",
    kinds: ["pasantias", "web"],
    color: "#4ade80",
    domain: "mushuc-granja/dashboard",
    description:
      "Sistema web para administrar la granja del Complejo Intercultural y Deportivo Mushuc Runa: ganado, recursos, contabilidad y reportes en un solo lugar.",
    highlights: [
      "Ficha completa de cada animal: tratamientos, alimentación, medidas, crías, controles de embarazo y árbol genealógico",
      "Almacenes, inventario con alertas de stock bajo y equipos con historial de uso y mantenimiento",
      "Contabilidad con actas, flujo de fondos y balance; reportes exportables a PDF y Excel",
      "Notificaciones en tiempo real (Socket.io) y recordatorios automáticos por correo",
      "Control de acceso por roles y auditoría de cambios",
    ],
    stack: ["Angular", "TypeScript", "Node.js", "Express", "Prisma", "PostgreSQL", "Socket.io"],
    team: "Prácticas preprofesionales · Cooperativa Mushuc Runa Ltda.",
    images: [
      { src: "/images/granja-dashboard.png" },
      { src: "/images/granja-animal.png" },
      { src: "/images/granja-genealogia.png" },
      { src: "/images/granja-flujo.png" },
      { src: "/images/granja-reportes.png" },
      { src: "/images/granja-grupos.png" },
      { src: "/images/granja-almacenes.png" },
      { src: "/images/granja-login.png" },
    ],
    // Los repositorios pertenecen a la organización ComplejoMushucRuna y son privados.
    links: [],
    privateRepo: true,
  },
  {
    title: "FuelWise",
    category: "Gestión de flotas",
    kinds: ["web"],
    color: "#22d3ee",
    domain: "fuelwise/panel",
    description:
      "Sistema para registrar, gestionar y analizar el consumo de combustible de una flota de vehículos.",
    highlights: [
      "Panel de control con indicadores de vehículos, mantenimiento y usuarios",
      "Gestión de vehículos, registros de consumo y reportes",
      "Frontend y backend independientes, integrados por API REST",
    ],
    stack: ["React", "TypeScript", "C#", ".NET", "Docker"],
    team: "Proyecto en equipo · Grupo FuelWise",
    images: [
      { src: "/images/combustible2.png" },
      { src: "/images/combustible1.png" },
      { src: "/images/combustible3.png" },
      { src: "/images/combustible4.png" },
    ],
    links: [
      { label: "Frontend", url: "https://github.com/GrupoDistribuidas/Frontend_ControlCombustible" },
      { label: "Backend", url: "https://github.com/GrupoDistribuidas/Backend_ControlCombustible" },
    ],
  },
  {
    title: "Farma Ya",
    category: "Plataforma para farmacias",
    kinds: ["web", "movil"],
    color: "#60a5fa",
    domain: "farmaya/admin",
    description:
      "Plataforma integral para farmacias: inventario, ventas y pedidos, con aplicación web y móvil conectadas al mismo backend.",
    highlights: [
      "Panel administrativo con ventas, stock bajo y pedidos pendientes",
      "Tienda en línea y app móvil para clientes",
      "Web, móvil y backend integrados por una sola API REST",
    ],
    stack: ["React", "Next.js", "NestJS", "Node.js"],
    team: "Proyecto en equipo · con HamiltonStJJ",
    images: [
      { src: "/images/farmaYaWeb2.png" },
      { src: "/images/farmaYaWeb3.png" },
      { src: "/images/farmaYaWeb4.png" },
      { src: "/images/farmaYaWeb1.png" },
      { src: "/images/farmaYaMovil1.png", mobile: true },
      { src: "/images/farmaYaMovil2.png", mobile: true },
      { src: "/images/farmaYaMovil3.png", mobile: true },
      { src: "/images/farmaYaMovil4.png", mobile: true },
    ],
    // Los repositorios FarmaYaFrontEnd / BackEnd / Mobile ya no son públicos.
    // Si vuelven a serlo, agrégalos aquí como { label, url }.
    links: [],
    privateRepo: true,
  },
  {
    title: "Marketplace Multiempresa",
    category: "E-commerce",
    kinds: ["web"],
    color: "#fbbf24",
    domain: "marketplace/tienda",
    description:
      "Marketplace donde distintos negocios publican productos, gestionan su inventario y reciben pedidos en una sola plataforma.",
    highlights: [
      "Catálogo, carrito de compras y pedidos",
      "Panel administrativo por empresa y gestión de usuarios",
      "Frontend y backend independientes, integrados por API REST",
    ],
    stack: ["React", "JavaScript", "Java", "Spring Boot", "Docker"],
    team: "Proyecto en equipo · con DavidGR21 y xxxMichael",
    images: [
      { src: "/images/marketP7.png" },
      { src: "/images/marketP5.png" },
      { src: "/images/marketP6.png" },
      { src: "/images/marketP4.png" },
      { src: "/images/marketP8.png" },
      { src: "/images/marketP9.png" },
      { src: "/images/marketP10.png" },
    ],
    links: [
      { label: "Frontend", url: "https://github.com/DavidGR21/MULTI-COMPANY_SALES_SYSTEM_FRONTEND" },
      { label: "Backend", url: "https://github.com/xxxMichael/MULTI-COMPANY_SALES_SYSTEM" },
    ],
  },
  {
    title: "Pixel Odyssey",
    category: "Videojuego RPG",
    kinds: ["juegos"],
    color: "#f472b6",
    domain: "pixel-odyssey · Unity",
    description:
      "Juego RPG de exploración y aventuras en un mundo de fantasía pixel art, desarrollado en Unity.",
    highlights: [
      "Exploración de mapas con secretos, enemigos y jefes",
      "Inventario, misiones, diálogos y guardado de partida",
      "Lógica de juego orientada a objetos en C#",
    ],
    stack: ["Unity", "C#"],
    team: "Proyecto en equipo · con DavidGR21",
    images: [
      { src: "/images/pixelj3.png" },
      { src: "/images/pixelj1.png" },
      { src: "/images/pixelj2.png" },
      { src: "/images/pixelj4.png" },
      { src: "/images/pixelj5.png" },
      { src: "/images/pixelj6.png" },
    ],
    links: [{ label: "Repositorio", url: "https://github.com/DavidGR21/Pixel-Odyssey" }],
  },
];

// ── Certificados ──
// Cada certificado tiene su PDF y una imagen de vista previa en /public/certificados.
// Ordenados del más reciente al más antiguo.
export type Certificate = {
  title: string;
  issuer: string;
  date: string;
  id: string;
  tags: ReadonlyArray<string>;
  color: string;
  image: string;
  pdf: string;
};

export const CERTIFICATES: ReadonlyArray<Certificate> = [
  {
    title: "JavaScript Essentials 1",
    issuer: "Cisco Networking Academy · JS Institute",
    date: "16 nov 2026",
    id: "c80175c2-98f7-4392-a89b-327a8488b2ac",
    tags: ["JavaScript"],
    color: "#f7df1e",
    image: "/certificados/javascript-essentials-1.jpg",
    pdf: "/certificados/javascript-essentials-1.pdf",
  },
  {
    title: "Data Science Essentials with Python",
    issuer: "Cisco Networking Academy",
    date: "13 sep 2026",
    id: "b5a83458-1de9-4dc8-848a-7cedafcce019",
    tags: ["Python", "Ciencia de datos"],
    color: "#4b8bbe",
    image: "/certificados/data-science-python.jpg",
    pdf: "/certificados/data-science-python.pdf",
  },
  {
    title: "Soporte y Seguridad de Red",
    issuer: "Universidad Técnica de Ambato · Cisco Networking Academy",
    date: "25 dic 2024",
    id: "b27b8906-581d-4e17-8313-df6752af2586",
    tags: ["Redes", "Seguridad"],
    color: "#22d3ee",
    image: "/certificados/soporte-seguridad-red.jpg",
    pdf: "/certificados/soporte-seguridad-red.pdf",
  },
  {
    title: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    date: "14 jun 2024",
    id: "5df8635c-c312-4c60-920d-60edb5e698a0",
    tags: ["Ciberseguridad"],
    color: "#f472b6",
    image: "/certificados/intro-ciberseguridad.jpg",
    pdf: "/certificados/intro-ciberseguridad.pdf",
  },
  {
    title: "Introduction to Packet Tracer",
    issuer: "Cisco Networking Academy",
    date: "7 abr 2023",
    id: "9973c396-c935-4883-93e5-64c2a7af0d40",
    tags: ["Redes", "Packet Tracer"],
    color: "#a78bfa",
    image: "/certificados/intro-packet-tracer.jpg",
    pdf: "/certificados/intro-packet-tracer.pdf",
  },
];

// ── CV ── (resumen que acompaña a la vista previa del CV)
export const CV = {
  pdf: "/cv/cv-paul-velastegui.pdf",
  image: "/cv/cv-paul-velastegui.jpg",
  downloadName: "CV-Paul-Velastegui.pdf",
  // Experiencia, de la más reciente a la más antigua.
  experience: [
    {
      role: "Desarrollador Front-end y Back-end",
      company: "Euroman Ecuador",
      period: "Enero 2026 – actualidad",
      highlights: [
        "Sistema completo de proformas con React y Node.js, frontend y backend",
        "APIs REST para clientes, productos y generación de proformas",
        "Bases de datos relacionales: integración y optimización de consultas",
        "Página web corporativa en Wix y levantamiento de requerimientos con otras áreas",
      ],
    },
    {
      role: "Prácticas preprofesionales · Desarrollador Full Stack",
      company: "Cooperativa Mushuc Runa Ltda.",
      // TODO: ajustar con las fechas reales de las prácticas (p. ej. "Junio – Agosto 2026").
      period: "2026",
      highlights: [
        "Sistema de gestión ganadera Mushuc Granja para el Complejo Intercultural y Deportivo Mushuc Runa",
        "Frontend en Angular y API REST en Node.js, Express y Prisma sobre PostgreSQL",
        "Módulos de ganado, inventario, equipos, contabilidad y reportes en PDF y Excel",
        "Notificaciones en tiempo real con Socket.io y control de acceso por roles",
      ],
    },
  ],
  education: "Ingeniería de Software · Universidad Técnica de Ambato",
} as const;

export const NAV_LINKS = [
  { title: "Sobre mí", link: "#about-me" },
  { title: "Habilidades", link: "#skills" },
  { title: "Terminal", link: "#terminal" },
  { title: "Proyectos", link: "#projects" },
  { title: "Certificados", link: "#certificates" },
  { title: "Contacto", link: "#contact" },
] as const;

export const SOCIALS = [
  { name: "GitHub", icon: RxGithubLogo, link: SITE.github },
  { name: "LinkedIn", icon: RxLinkedinLogo, link: SITE.linkedin },
  { name: "Instagram", icon: RxInstagramLogo, link: SITE.instagram },
] as const;

export const CONTACT_CHANNELS = [
  { name: "WhatsApp", value: SITE.whatsappLabel, icon: FaWhatsapp, link: SITE.whatsapp },
  { name: "LinkedIn", value: "paul-velastegui", icon: RxLinkedinLogo, link: SITE.linkedin },
  { name: "GitHub", value: "PAUL-23VE", icon: RxGithubLogo, link: SITE.github },
  { name: "Instagram", value: "@paul_velastegui25", icon: RxInstagramLogo, link: SITE.instagram },
  { name: "Facebook", value: "Paul Velastegui", icon: FaFacebook, link: SITE.facebook },
] as const;

export const FOOTER_DATA = [
  {
    title: "Código",
    data: [
      { name: "GitHub", icon: RxGithubLogo, link: SITE.github },
      { name: "LinkedIn", icon: RxLinkedinLogo, link: SITE.linkedin },
    ],
  },
  {
    title: "Redes",
    data: [
      { name: "Instagram", icon: RxInstagramLogo, link: SITE.instagram },
      { name: "Facebook", icon: FaFacebook, link: SITE.facebook },
    ],
  },
  {
    title: "Contacto",
    data: [
      { name: "WhatsApp", icon: FaWhatsapp, link: SITE.whatsapp },
      { name: SITE.email, icon: null, link: `mailto:${SITE.email}` },
    ],
  },
] as const;
