import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  FaReact, 
  FaNodeJs, 
  FaGitAlt, 
  FaAws,
  FaDocker,
  FaPhp,
  FaJs,
  FaCss3Alt
} from "react-icons/fa";
import { 
  SiNextdotjs, 
  SiTailwindcss, 
  SiExpress, 
  SiPostgresql, 
  SiMongodb,
  SiTypescript,
  SiGraphql,
  SiJest,
  SiTestinglibrary,
  SiMysql,
  SiUnity,
  SiRuby,
  SiLaravel
} from "react-icons/si";

function About() {
  const [particles, setParticles] = useState([]);
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    // Partículas pequeñas
    setParticles(
      [...Array(40)].map(() => ({
        id: Math.random(),
        left: `${Math.random() * 100}%`,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 3,
      }))
    );

    // Burbujas grandes
    setBubbles(
      [...Array(8)].map(() => ({
        id: Math.random(),
        left: `${Math.random() * 100}%`,
        size: 20 + Math.random() * 40,
        delay: Math.random() * 10,
        duration: 10 + Math.random() * 15,
      }))
    );
  }, []);

  const technologies = [
    { name: "React", icon: <FaReact size={24} /> },
    { name: "Next.js", icon: <SiNextdotjs size={24} /> },
    { name: "JavaScript", icon: <FaJs size={24} /> },
    { name: "TypeScript", icon: <SiTypescript size={24} /> },
    { name: "Node.js", icon: <FaNodeJs size={24} /> },
    { name: "Express", icon: <SiExpress size={24} /> },
    { name: "PHP", icon: <FaPhp size={24} /> },
    { name: "Laravel", icon: <SiLaravel size={24} /> },
    { name: "Ruby", icon: <SiRuby size={24} /> },
    { name: "PostgreSQL", icon: <SiPostgresql size={24} /> },
    { name: "MySQL", icon: <SiMysql size={24} /> },
    { name: "MongoDB", icon: <SiMongodb size={24} /> },
    { name: "CSS", icon: <FaCss3Alt size={24} /> },
    { name: "Tailwind CSS", icon: <SiTailwindcss size={24} /> },
    { name: "GraphQL", icon: <SiGraphql size={24} /> },
    { name: "Unity", icon: <SiUnity size={24} /> },
    { name: "AWS", icon: <FaAws size={24} /> },
    { name: "Docker", icon: <FaDocker size={24} /> },
    { name: "Git", icon: <FaGitAlt size={24} /> },
    { name: "Jest", icon: <SiJest size={24} /> },
    { name: "Testing Library", icon: <SiTestinglibrary size={24} /> }
  ];

  return (
    <div style={styles.container}>
      {/* Burbujas de fondo */}
      {bubbles.map(({ id, left, size, delay, duration }) => (
        <div
          key={id}
          style={{
            ...styles.bubble,
            left,
            width: size,
            height: size,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        />
      ))}

      {/* Partículas pequeñas */}
      <div style={styles.particles}>
        {particles.map(({ id, left, size, delay, duration }) => (
          <div
            key={id}
            style={{
              ...styles.particle,
              left,
              width: size,
              height: size,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <section style={styles.section}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={styles.card}
        >
          <div style={styles.profileContainer}>
            <div style={styles.imageCircle}>
              <img 
                src="../src/images/PERFIL1.png" 
                alt="Paul Velastegui" 
                style={styles.profileImage}
              />
            </div>
            <div style={styles.status}>
              <div style={styles.dot}></div>
              <span>Disponible para colaborar</span>
            </div>
          </div>

          <h1 style={styles.title}>Paul Velastegui</h1>
          <h2 style={styles.subtitle}>Desarrollador Fullstack</h2>

          <p style={styles.description}>
            Soy estudiante de sexto semestre de Ingeniería de Software con una orientación marcada
            hacia el desarrollo web. Me encanta construir interfaces modernas y funcionales con React y
            Tailwind, apoyándome de tecnologías como Node.js y PostgreSQL. En mis tiempos libres, disfruto jugar
            fútbol, lo que me ayuda a mantener un espíritu colaborativo y perseverante. Me motiva
            aprender constantemente y dar lo mejor de mí en cada proyecto.
          </p>

          <h3 style={styles.techTitle}>Tecnologías que manejo:</h3>
          <div style={styles.techGrid}>
            {technologies.map((tech, i) => (
              <motion.div
                key={tech.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={styles.techBadgeContainer}
              >
                <div style={styles.techBadge}>
                  <div style={styles.techIcon}>{tech.icon}</div>
                  <span style={styles.techName}>{tech.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes bubbleMove {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
const styles = {
  container: {
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
    background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
    color: "#fff",
    fontFamily: "'Inter', sans-serif",
    padding: "2rem",
  },
  section: {
    zIndex: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(12px)",
    borderRadius: "1.5rem",
    padding: "3rem",
    maxWidth: "800px",
    width: "100%",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  },
  profileContainer: {
    marginBottom: "1.5rem",
  },
  imageCircle: {
    width: 130,
    height: 130,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea, #00ffe7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    boxShadow: "0 10px 30px rgba(0,255,231,0.4)",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  status: {
    marginTop: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    color: "#00ffe7",
    fontSize: "0.9rem",
    fontWeight: 500,
  },
  dot: {
    width: 10,
    height: 10,
    background: "#00ffe7",
    borderRadius: "50%",
    animation: "pulse 2s infinite",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#aad3ff",
    marginBottom: "1.5rem",
  },
  description: {
    fontSize: "1.1rem",
    lineHeight: 1.7,
    color: "#e0e0e0",
    marginBottom: "2rem",
  },
  techTitle: {
    fontSize: "1.2rem",
    color: "#fff",
    marginBottom: "1.5rem",
    fontWeight: 600,
  },
  techGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: "1.2rem",
    justifyContent: "center",
    alignItems: "center",
  },
  techBadge: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem 0.5rem",
    background: "rgba(0,255,231,0.1)",
    border: "1px solid rgba(0,255,231,0.3)",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    minHeight: "90px",
  },
  techIcon: {
    marginBottom: "8px",
    color: "#00ffe7",
  },
  techName: {
    fontSize: "0.8rem",
    textAlign: "center",
    color: "#fff",
    fontWeight: 500,
  },
  particles: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 0,
  },
  particle: {
    position: "absolute",
    background: "rgba(0, 255, 231, 0.3)",
    borderRadius: "50%",
    animation: "float infinite ease-in-out",
  },
  bubble: {
    position: "fixed",
    bottom: "-50px",
    borderRadius: "50%",
    background: "rgba(0, 255, 231, 0.12)",
    filter: "blur(8px)",
    animationName: "bubbleMove",
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
  },
};

export default About;