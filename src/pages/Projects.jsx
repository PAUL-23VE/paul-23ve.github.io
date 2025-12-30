import { motion } from "framer-motion";
import ProjectCard from "../components/ProjectCard";

function Projects() {
  const proyectos = [
    {
      title: "Control de Combustible (FuelWise)",
      description:
        "Sistema completo para el registro, gestión y análisis del consumo de combustible en flotas vehiculares. Incluye panel de control, gestión de vehículos, reportes y registro de usuarios. Proyecto desarrollado en equipo con frontend en React y backend en .NET (C#).\n\nFrontend y backend independientes, integrados vía API REST.\n\nColaboradores: Equipo FuelWise.",
      images: [
        "/images/combustible1.png",
        "/images/combustible2.png",
        "/images/combustible3.png",
        "/images/combustible4.png"
      ],
      frontend: "https://github.com/GrupoDistribuidas/Frontend_ControlCombustible",
      backend: "https://github.com/GrupoDistribuidas/Backend_ControlCombustible"
    },
    {
      title: "Pixel Odyssey",
      description:
        "Pixel Odyssey es un juego RPG de exploración y aventuras en un mundo de fantasía pixel art.\n\nCaracterísticas principales:\n- Explora mapas y descubre secretos\n- Combate enemigos y jefes\n- Sistema de inventario y objetos\n- Misiones y diálogos\n- Progresión de niveles\n- Guardado de partida\n\nDesarrollado en Unity con C#, este proyecto es ideal para aprender lógica de videojuegos, diseño de interfaces retro y programación orientada a objetos.\n\nColaboradores: DavidGR21, Paul Velastegui y equipo.\n\nRepositorio principal y demo en GitHub.",
      images: [
        "/images/pixelj1.png",
        "/images/pixelj2.png",
        "/images/pixelj3.png",
        "/images/pixelj4.png",
        "/images/pixelj5.png",
        "/images/pixelj6.png"
      ],
      link: "https://github.com/DavidGR21/Pixel-Odyssey.git",
    },
    {
      title: "Farma Ya (Web, Móvil y Backend)",
      description:
        "Plataforma integral para farmacias: gestión de inventario, ventas y pedidos, con aplicaciones web y móvil conectadas al mismo backend. Incluye panel administrativo, tienda online y app móvil para clientes. Proyecto colaborativo con frontend en React y backend en NestJS (Node.js).\n\nFrontend, backend y móvil integrados vía API REST.\n\nColaboradores: HamiltonStJJ, Paul Velastegui y equipo.",
      images: [
        "/images/farmaYaWeb1.png",
        "/images/farmaYaWeb2.png",
        "/images/farmaYaWeb3.png",
        "/images/farmaYaWeb4.png",
        "/images/farmaYaMovil1.png",
        "/images/farmaYaMovil2.png",
        "/images/farmaYaMovil3.png",
        "/images/farmaYaMovil4.png"
      ],
      frontend: "https://github.com/HamiltonStJJ/FarmaYaFrontEnd.git",
      backend: "https://github.com/HamiltonStJJ/FarmaYaBackEnd.git",
      movil: "https://github.com/HamiltonStJJ/FarmaYaMobile.git"
    },
    {
      title: "Marketplace Multiempresa",
      description:
        "Sistema de marketplace para ventas multiempresa, donde diferentes negocios pueden publicar productos, gestionar inventario y recibir pedidos en una sola plataforma. Incluye panel administrativo, gestión de usuarios, catálogo, carrito de compras y reportes. Proyecto colaborativo con frontend en React y backend en Spring Boot (Java).\n\nFrontend y backend independientes, integrados vía API REST.\n\nColaboradores: DavidGR21, xxxMichael y equipo.",
      images: [
        "/images/marketP1.png",
        "/images/marketP2.png",
        "/images/marketP3.png",
        "/images/marketP4.png",
        "/images/marketP5.png",
        "/images/marketP6.png",
        "/images/marketP7.png",
        "/images/marketP8.png",
        "/images/marketP9.png",
        "/images/marketP10.png"
      ],
      frontend: "https://github.com/DavidGR21/MULTI-COMPANY_SALES_SYSTEM_FRONTEND.git",
      backend: "https://github.com/xxxMichael/MULTI-COMPANY_SALES_SYSTEM.git"
    },
  ];

  return (
    <section style={{
      zIndex: 2,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "calc(100vh - 70px - 60px)",
      width: "100vw",
      boxSizing: "border-box",
      marginTop: "48px",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(12px)",
        borderRadius: "1.5rem",
        padding: "3rem",
        maxWidth: 1100,
        width: "100%",
        textAlign: "center",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        margin: "0 auto"
      }}>
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Proyectos y Colaboraciones
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {proyectos.map((proyecto, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <ProjectCard
                title={proyecto.title}
                description={proyecto.description}
                link={proyecto.link}
                images={proyecto.images}
                frontend={proyecto.frontend}
                backend={proyecto.backend}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
