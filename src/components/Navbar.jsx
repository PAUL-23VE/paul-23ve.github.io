import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => setMenuOpen((open) => !open);
  const handleCloseMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar navbar-blur${menuOpen ? ' open' : ''}`}>
      <div className="navbar-content">
        <h1 className="logo" tabIndex={0}>Paul Velastegui</h1>
        <button
          className={`hamburger${menuOpen ? ' is-active' : ''}`}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={handleMenuToggle}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <ul className={`nav-links${menuOpen ? ' show' : ''}`}>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active-link' : 'nav-item'} onClick={handleCloseMenu}>Inicio</NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-item active-link' : 'nav-item'} onClick={handleCloseMenu}>Sobre mí</NavLink>
          </li>
          <li>
            <NavLink to="/projects" className={({ isActive }) => isActive ? 'nav-item active-link' : 'nav-item'} onClick={handleCloseMenu}>Proyectos</NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-item active-link' : 'nav-item'} onClick={handleCloseMenu}>Contacto</NavLink>
          </li>
        </ul>
        {menuOpen && <div className="nav-overlay" onClick={handleCloseMenu} />}
      </div>
    </nav>
  );
}

export default Navbar;
