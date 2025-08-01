import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Imagen perfil con animación suave al hacer hover
const ProfileImage = () => (
  <div
    style={{
      width: 180,
      height: 180,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "4rem",
      color: "white",
      border: "4px solid rgba(255,255,255,0.3)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
      transition: "transform 0.3s ease",
      cursor: "pointer",
      overflow: "hidden",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    aria-label="Imagen de perfil Paul Velastegui"
    role="img"
  >
   {/* Reemplaza la siguiente línea con tu imagen */}
    <img 
      src="/src/images/Inicio-portafolio.png" 
      alt="Bienvenido a mi perfil" 
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  </div>
);

function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(0);
  const navigate = useNavigate();

  const skills = [
    { icon: "💻", text: "Desarrollo Full Stack" },
    { icon: "🎨", text: "UI/UX Design" },
    { icon: "🗄️", text: "Bases de Datos" },
    { icon: "🌐", text: "APIs RESTful" },
    { icon: "📱", text: "Apps Móviles" },
    { icon: "⚡", text: "Optimización" },
  ];

  const technologies = [
    "React",
    "Node.js",
    "MongoDB",
    "PostgreSQL",
    "TypeScript",
    "Express",
  ];

  // Para animar partículas y burbujas
  const [particles, setParticles] = useState([]);
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setCurrentSkill((prev) => (prev + 1) % skills.length);
    }, 3000);

    // Generar partículas
    setParticles(
      [...Array(40)].map(() => ({
        id: Math.random(),
        left: `${Math.random() * 100}%`,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 3,
      }))
    );

    // Generar burbujas (círculos más grandes con movimiento lento)
    setBubbles(
      [...Array(8)].map(() => ({
        id: Math.random(),
        left: `${Math.random() * 100}%`,
        size: 20 + Math.random() * 40,
        delay: Math.random() * 10,
        duration: 10 + Math.random() * 15,
      }))
    );

    return () => clearInterval(interval);
  }, []);

  const handleViewWork = () => {
    navigate("/projects");
  };

  const handleContact = () => {
    navigate("/contact");
  };

  // Scroll suave hacia sección proyectos o contacto
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={styles.container}>
      {/* Background de burbujas animadas */}
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

      {/* Partículas flotantes */}
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

      <section style={styles.section}>
        <div
          style={{
            ...styles.content,
            transform: isVisible ? "translateY(0) scale(1)" : "translateY(50px) scale(0.95)",
            opacity: isVisible ? 1 : 0,
          }}
          className="fade-in-up"
        >
          <div style={styles.profileContainer}>
            <ProfileImage />
            <div style={styles.statusIndicator}>
              <div style={styles.statusDot}></div>
              <span style={styles.statusText}>Disponible para proyectos</span>
            </div>
          </div>

          <div style={styles.greeting}>
            <div style={styles.titleContainer}>
              <h1 style={styles.title}>
                ¡Hola! Soy <span style={styles.highlight}>Paul Velastegui</span>{" "}
                <span style={styles.wave}>👋</span>
              </h1>

              <div style={styles.skillRotator}>
                <span style={styles.staticText}>Especialista en</span>{" "}
                <span style={styles.rotatingSkill}>
                  <span style={{ fontSize: "1.6rem" }}>{skills[currentSkill].icon}</span>
                  <span style={styles.skillText}>{skills[currentSkill].text}</span>
                </span>
              </div>
            </div>

            <p style={styles.intro}>
              Soy estudiante de sexto semestre en Ingeniería de Software en la Universidad Técnica
              de Ambato, con una gran pasión por la tecnología y el desarrollo web. Aunque aún
              estoy en formación, me dedico a transformar ideas en soluciones digitales modernas,
              funcionales y atractivas, enfocadas en la experiencia del usuario. Mi objetivo es
              aprender constantemente, enfrentar nuevos retos y contribuir con creatividad y
              compromiso en proyectos que impulsen el crecimiento y la innovación. ¡Estoy listo
              para crecer junto a tu proyecto y ofrecer lo mejor de mí!
            </p>

            <div style={styles.techStack}>
              <h3 style={styles.techTitle}>Tecnologías que domino:</h3>
              <div style={styles.techGrid}>
                {technologies.map((tech, index) => (
                  <span
                    key={tech}
                    style={{
                      ...styles.techBadge,
                      animationDelay: `${index * 0.1}s`,
                    }}
                    className="tech-badge"
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div style={styles.servicesContainer}>
              <h3 style={styles.servicesTitle}>¿En qué puedo ayudarte?</h3>
              <div style={styles.servicesGrid}>
                {[
                  { icon: "🌐", title: "Desarrollo Web", desc: "Sitios web responsivos y aplicaciones modernas" },
                  { icon: "🗄️", title: "Backend & APIs", desc: "Arquitecturas escalables y APIs robustas" },
                  { icon: "⚡", title: "Optimización", desc: "Performance y SEO de alto nivel" },
                ].map(({ icon, title, desc }) => (
                  <div
                    key={title}
                    style={styles.serviceItem}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(0,255,231,0.1)";
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,255,231,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={styles.serviceIcon}>{icon}</div>
                    <h4>{title}</h4>
                    <p>{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.ctaSection}>
              <p style={styles.ctaText}>¿Listo para llevar tu proyecto al siguiente nivel?</p>
              <div style={styles.buttonGroup}>
                <button style={styles.primaryButton} onClick={handleViewWork} aria-label="Ver mi trabajo">
                  Ver mi trabajo
                </button>
                <button style={styles.secondaryButton} onClick={handleContact} aria-label="Contactar ahora">
                  Contactar ahora
                </button>
              </div>
            </div>
          </div>
        </div>        
      </section>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 100%);
          min-height: 100vh;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg);}
          50% { transform: translateY(-20px) rotate(180deg);}
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4;}
          50% { opacity: 1;}
        }
        @keyframes slideInTech {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes bubbleMove {
          0% { transform: translateY(0) translateX(0) rotate(0);}
          50% { transform: translateY(-20px) translateX(10px) rotate(180deg);}
          100% { transform: translateY(0) translateX(0) rotate(360deg);}
        }
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .tech-badge {
          animation: slideInTech 0.6s ease-out forwards;
          transition: transform 0.3s ease;
          display: inline-block;
          cursor: pointer;
        }
        @media (max-width: 768px) {
          .content {
            padding: 2rem 1.5rem !important;
            margin: 1rem !important;
          }
          .title {
            font-size: 2rem !important;
          }
          .intro {
            font-size: 1.1rem !important;
          }
          .servicesGrid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          .buttonGroup {
            flex-direction: column !important;
            align-items: center !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    minHeight: "100vh",
    background: "transparent",
    overflow: "hidden",
  },
  particles: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 1,
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
  section: {
    position: "relative",
    zIndex: 2,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem 1rem 4rem 1rem",
  },
  content: {
    background: "rgba(255, 255, 255, 0.02)",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 24,
    padding: "3rem",
    maxWidth: 1000,
    width: "100%",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
    margin: "2rem 0",
  },
  profileContainer: {
    position: "relative",
    marginBottom: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statusIndicator: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    background: "rgba(0, 255, 231, 0.1)",
    borderRadius: 20,
    border: "1px solid rgba(0, 255, 231, 0.3)",
  },
  statusDot: {
    width: 8,
    height: 8,
    background: "#00ffe7",
    borderRadius: "50%",
    animation: "pulse 2s infinite",
  },
  statusText: {
    color: "#00ffe7",
    fontSize: "0.9rem",
    fontWeight: 500,
  },
  greeting: {
    color: "#fff",
  },
  titleContainer: {
    marginBottom: "2rem",
  },
  title: {
    fontSize: "clamp(2.5rem, 5vw, 4rem)",
    fontWeight: 700,
    marginBottom: "1rem",
    lineHeight: 1.1,
    background: "linear-gradient(135deg, #fff 0%, #00ffe7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  highlight: {
    background: "linear-gradient(135deg, #00ffe7 0%, #667eea 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  wave: {
    display: "inline-block",
    fontSize: "0.8em",
    animation: "float 2s ease-in-out infinite",
  },
  skillRotator: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontSize: "1.5rem",
    color: "#aad3ff",
    minHeight: 32,
  },
  staticText: {
    fontWeight: 300,
  },
  rotatingSkill: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#00ffe7",
    fontWeight: 600,
    transition: "all 0.5s ease",
  },
  skillText: {
    minWidth: 200,
    textAlign: "left",
  },
  intro: {
    fontSize: "1.3rem",
    maxWidth: 800,
    margin: "0 auto 2.5rem auto",
    lineHeight: 1.7,
    color: "#e0e0e0",
    fontWeight: 300,
  },
  techStack: {
    marginBottom: "3rem",
  },
  techTitle: {
    color: "#fff",
    fontSize: "1.2rem",
    marginBottom: "1rem",
    fontWeight: 500,
  },
  techGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.8rem",
    justifyContent: "center",
  },
  techBadge: {
    padding: "0.6rem 1.2rem",
    background: "rgba(0, 255, 231, 0.1)",
    color: "#00ffe7",
    borderRadius: 20,
    border: "1px solid rgba(0, 255, 231, 0.3)",
    fontSize: "0.9rem",
    fontWeight: 500,
    transition: "all 0.3s ease",
    cursor: "pointer",
    opacity: 0,
    animation: "slideInTech 0.6s ease-out forwards",
  },
  servicesContainer: {
    marginBottom: "2rem",
  },
  servicesTitle: {
    color: "#fff",
    fontSize: "1.8rem",
    marginBottom: "2rem",
    fontWeight: 600,
  },
  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginTop: "1.5rem",
  },
  serviceItem: {
    padding: "2rem 1.5rem",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.1)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    textAlign: "center",
  },
  serviceIcon: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    filter: "hue-rotate(180deg) brightness(1.2)",
  },
  ctaSection: {
    marginTop: "2rem",
  },
  ctaText: {
    fontSize: "1.3rem",
    color: "#fff",
    marginBottom: "2rem",
    fontWeight: 400,
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  primaryButton: {
    padding: "1rem 2rem",
    fontSize: "1.1rem",
    background: "linear-gradient(135deg, #00ffe7 0%, #667eea 100%)",
    color: "#000",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.3s ease",
    boxShadow: "0 8px 25px rgba(0, 255, 231, 0.3)",
  },
  secondaryButton: {
    padding: "1rem 2rem",
    fontSize: "1.1rem",
    background: "transparent",
    color: "#00ffe7",
    border: "2px solid #00ffe7",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.3s ease",
  },
  scrollIndicator: {
    position: "absolute",
    bottom: 32,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    color: "#00ffe7",
    fontSize: 14,
    animation: "float 2s ease-in-out infinite",
    cursor: "pointer",
    userSelect: "none",
  },
};

export default Home;
