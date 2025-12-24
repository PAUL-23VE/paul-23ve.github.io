import { motion } from "framer-motion";
import ProjectCard from "../components/ProjectCard";

function Projects() {
  const proyectos = [
    {
      title: "Control de Combustible (FuelWise)",
      description:
        "Sistema completo para el registro, gestión y análisis del consumo de combustible en flotas vehiculares. Incluye panel de control, gestión de vehículos, reportes y registro de usuarios. Proyecto desarrollado en equipo con frontend y backend separados.",
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
      title: "Calculadora de Integrales",
      description:
        "Calculadora web con método de Simpson hecha en PHP y JavaScript.",
      link: "https://github.com/tuusuario/calculadora-integrales",
    },
    {
      title: "Pixel Odyssey",
      description:
        "Juego tipo RPG estilo pixel art, desarrollado con HTML, CSS y JavaScript.",
      link: "https://github.com/tuusuario/pixel-odyssey",
    },
    {
      title: "Sistema de Seguros",
      description:
        "Formulario PHP para contratación de seguros con base de datos.",
      link: "https://github.com/tuusuario/sistema-seguros",
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
