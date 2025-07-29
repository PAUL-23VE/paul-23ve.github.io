import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">Paul Velastegui</h1>
      <ul className="nav-links">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active-link' : 'nav-item'}>Inicio</NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-item active-link' : 'nav-item'}>Sobre mí</NavLink>
        </li>
        <li>
          <NavLink to="/projects" className={({ isActive }) => isActive ? 'nav-item active-link' : 'nav-item'}>Proyectos</NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-item active-link' : 'nav-item'}>Contacto</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
