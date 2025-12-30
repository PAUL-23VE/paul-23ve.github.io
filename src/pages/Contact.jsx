import { FaFacebook, FaInstagram, FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

function Contact() {
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
      background: "none"
    }}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: "spring" }}
        style={{
          background: "rgb(29, 47, 76)", // Fondo igual al de ProjectCard
          backdropFilter: "blur(16px)",
          borderRadius: "2.2rem",
          padding: "3.5rem 2.5rem 2.5rem 2.5rem",
          maxWidth: 650,
          width: "100%",
          textAlign: "center",
          border: "1.5px solid #00ffe733",
          boxShadow: "0 24px 60px 0 #00ffe71a, 0 2px 8px #667eea33",
          margin: "0 auto"
        }}
      >
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: 18, color: '#00ffe7', letterSpacing: 1, textShadow: '0 2px 16px #00ffe733' }}
        >
          ¡Contáctame!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ color: '#e0e0e0', fontSize: '1.18rem', marginBottom: 36, fontWeight: 400 }}
        >
          ¿Quieres colaborar, tienes una propuesta o solo quieres saludar? <br />
          ¡Estoy disponible para nuevos proyectos, networking y oportunidades!
        </motion.p>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } }
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center', marginBottom: 38, width: '100%' }}
        >
          <ContactButton
            href="mailto:paulvelastegui2016@gmail.com"
            icon={<FaEnvelope size={22} />}
            text="paulvelastegui2016@gmail.com"
            color="#00ffe7"
            delay={0.1}
          />
          <ContactButton
            href="https://github.com/PAUL-23VE"
            icon={<FaGithub size={22} />}
            text="github.com/PAUL-23VE"
            color="#fff"
            delay={0.2}
          />
          <ContactButton
            href="https://www.linkedin.com/in/paul-velastegui-703942226/"
            icon={<FaLinkedin size={22} />}
            text="linkedin.com/in/paul-velastegui-703942226"
            color="#0a66c2"
            delay={0.3}
          />
          <ContactButton
            href="https://www.instagram.com/paul_velastegui25?igsh=ODlnZnk5NGhhZWF2&utm_source=qr"
            icon={<FaInstagram size={22} />}
            text="@paul_velastegui25"
            color="#e1306c"
            delay={0.4}
          />
          <ContactButton
            href="https://www.facebook.com/share/1CVtFZ5Ujm/?mibextid=wwXIfr"
            icon={<FaFacebook size={22} />}
            text="/paulvelastegui"
            color="#1877f3"
            delay={0.5}
          />
          <ContactButton
            href="https://wa.me/593978954385"
            icon={<svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="16" fill="#25D366"/><path d="M16 6.667c-5.15 0-9.333 4.183-9.333 9.333 0 1.65.45 3.25 1.3 4.65L6.667 25.333l4.8-1.55c1.3.7 2.767 1.067 4.2 1.067 5.15 0 9.333-4.183 9.333-9.333S21.15 6.667 16 6.667zm0 16c-1.283 0-2.55-.333-3.633-.967l-.258-.15-2.85.917.933-2.767-.167-.267c-.767-1.217-1.175-2.617-1.175-4.1 0-4.033 3.267-7.3 7.3-7.3s7.3 3.267 7.3 7.3-3.267 7.3-7.3 7.3zm4.05-5.083c-.217-.117-1.283-.633-1.483-.7-.2-.067-.35-.1-.5.117-.15.217-.567.7-.7.85-.133.15-.25.167-.467.05-.217-.117-.917-.338-1.75-1.083-.65-.583-1.083-1.3-1.217-1.517-.133-.217-.014-.333.1-.45.1-.1.217-.25.333-.383.117-.133.15-.233.233-.383.083-.15.042-.283-.021-.4-.067-.117-.5-1.2-.683-1.65-.183-.45-.367-.383-.5-.383-.133 0-.283-.017-.433-.017-.15 0-.4.058-.617.283-.217.225-.85.833-.85 2.033 0 1.2.867 2.367.983 2.533.117.167 1.7 2.6 4.117 3.533.575.2 1.025.317 1.375.408.575.15 1.1.129 1.517.079.463-.054 1.283-.525 1.467-1.033.183-.508.183-.942.129-1.033-.054-.092-.2-.15-.417-.267z" fill="#fff"/></svg>}
            text="WhatsApp: 0978954385"
            color="#25D366"
            delay={0.6}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          style={{ margin: '32px 0 0 0', color: '#aad3ff', fontSize: 20, fontWeight: 500 }}
        >
          <span role="img" aria-label="handshake">🤝</span> ¡Hablemos y creemos algo increíble juntos!
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{ marginTop: 44, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 16px #00ffe733' }}
        >
          <iframe
            title="Ubicación Ambato"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-78.634, -1.254, -78.593, -1.210&layer=mapnik"
            style={{ width: '100%', height: 180, border: '2px solid #00ffe7', borderRadius: 12 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
          <div style={{ color: '#00ffe7', fontSize: 15, marginTop: 8 }}>Ambato, Ecuador</div>
        </motion.div>
      </motion.div>
      <style>{`
        @media (max-width: 800px) {
          .contact-btn { font-size: 1rem !important; padding: 0.8em 1.1em !important; min-width: 180px !important; }
        }
        @media (max-width: 500px) {
          .contact-btn { font-size: 0.95rem !important; padding: 0.7em 0.7em !important; min-width: 120px !important; }
        }
      `}</style>
    </section>
  );
}

const ContactButton = ({ href, icon, text, color, delay }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="contact-btn"
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5, type: "spring" }}
    whileHover={{ scale: 1.07, boxShadow: `0 6px 32px ${color}55` }}
    whileTap={{ scale: 0.97 }}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      background: 'linear-gradient(90deg, #232b3a 0%, #2d3a4e 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: 14,
      fontWeight: 700,
      fontSize: 18,
      padding: '1.2em 2.7em',
      margin: '0 0 0 0',
      boxShadow: `0 2px 16px ${color}33`,
      textDecoration: 'none',
      transition: 'all 0.22s cubic-bezier(.4,0,.2,1)',
      cursor: 'pointer',
      letterSpacing: 0.2,
      minWidth: 320,
      justifyContent: 'center',
      backgroundClip: 'padding-box',
      borderBottom: `3.5px solid ${color}`,
      outline: `1.5px solid #222c3a`,
      outlineOffset: '-2px',
      boxSizing: 'border-box',
      userSelect: 'none',
    }}
  >
    {icon} <span style={{fontWeight: 600, fontSize: 17, letterSpacing: 0.1}}>{text}</span>
  </motion.a>
);

export default Contact;
