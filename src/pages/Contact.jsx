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
    }}>
      <h2>Contacto</h2>
      <p>Puedes escribirme a: <a href="mailto:paul.velastegui@email.com">paul.velastegui@email.com</a></p>
      <p>O visitar mi GitHub: <a href="https://github.com/tuusuario" target="_blank" rel="noopener noreferrer">github.com/tuusuario</a></p>
    </section>
  );
}

export default Contact;
