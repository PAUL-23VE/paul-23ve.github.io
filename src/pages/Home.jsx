import imagenPerfil from '../images/Inicio-portafolio.png';

function Home() {
  return (
    <section style={styles.section}>
      <div style={styles.content} className="fade-in-box">
        <img 
          src={imagenPerfil} 
          alt="Paul Velastegui" 
          style={styles.profileImage}
          className="zoom-in"
        />

        <div style={styles.greeting}>
          <h1 style={styles.title}>
            ¡Bienvenido a mi portafolio profesional! <span style={styles.wave}>👋</span>
          </h1>
          <h2 style={styles.subtitle}>
            Hola, soy <span style={styles.highlight}>Paul Velastegui</span>
          </h2>

          <p style={styles.intro}>
            Soy un desarrollador full stack comprometido con convertir ideas en productos funcionales, estéticos y de alto rendimiento.
            Me especializo en tecnologías modernas del frontend y backend, con experiencia en proyectos reales para empresas y clientes.
          </p>

          <div style={styles.skillsContainer}>
            <h3 style={styles.skillsTitle}>¿Qué puedo ofrecerte?</h3>
            <ul style={styles.skillsList}>
              <li><span>✅</span> Desarrollo de sitios web rápidos, modernos y responsivos</li>
              <li><span>✅</span> Aplicaciones web con React, Node.js y bases de datos SQL/NoSQL</li>
              <li><span>✅</span> APIs RESTful seguras y bien documentadas</li>
              <li><span>✅</span> Optimización SEO y buenas prácticas de accesibilidad</li>
              <li><span>✅</span> Comunicación clara, trabajo en equipo y enfoque en resultados</li>
            </ul>
          </div>

          <p style={styles.cta}>
            <strong>¿Tienes una idea o un proyecto?</strong> <br />
            Estoy listo para ayudarte a hacerlo realidad.
          </p>

          <button style={styles.button}>Contáctame</button>
        </div>
      </div>

      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          background-size: cover;
          color: #fff;
        }

        .fade-in-box {
          animation: slideUpFade 1.2s ease-out forwards;
          opacity: 0;
          transform: translateY(80px);
        }

        .zoom-in {
          animation: zoomPop 1s ease-out forwards;
          opacity: 0;
        }

        @keyframes slideUpFade {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes zoomPop {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        ul {
          list-style: none;
          padding: 0;
        }

        li span {
          margin-right: 8px;
          color: #00ffe7;
        }
      `}</style>
    </section>
  );
}

const styles = {
  section: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3rem 1rem',
    backgroundColor: 'transparent',
  },
  content: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    padding: '3rem',
    maxWidth: '900px',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
  profileImage: {
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    border: '3px solid #fff',
    marginBottom: '20px',
    objectFit: 'cover',
  },
  greeting: {
    color: '#fff',
  },
  title: {
    fontSize: '2.8rem',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '2rem',
    color: '#aad3ff',
    marginBottom: '1rem',
  },
  highlight: {
    color: '#66ccff',
  },
  intro: {
    fontSize: '1.2rem',
    maxWidth: '700px',
    margin: '0 auto 2rem auto',
    lineHeight: '1.6',
    color: '#ddd',
  },
  skillsContainer: {
    marginTop: '1.5rem',
    textAlign: 'left',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  skillsTitle: {
    color: '#00ffe7',
    fontSize: '1.4rem',
    marginBottom: '1rem',
  },
  skillsList: {
    color: '#ccc',
    fontSize: '1rem',
    lineHeight: '1.7',
  },
  cta: {
    marginTop: '2rem',
    fontSize: '1.2rem',
    color: '#fff',
  },
  button: {
    marginTop: '1rem',
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    backgroundColor: '#00ffe7',
    color: '#00303f',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
};

export default Home;
  