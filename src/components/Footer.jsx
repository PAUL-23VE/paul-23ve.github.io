function Footer() {
  return (
    <footer style={{ textAlign: 'center', padding: '20px 0', marginTop: '40px', background: '#222', color: '#fff' }}>
      © {new Date().getFullYear()} Paul Velastegui. Todos los derechos reservados.
    </footer>
  );
}

export default Footer;
