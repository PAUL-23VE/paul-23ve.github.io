import ProjectCard from '../components/ProjectCard';

function Projects() {
  const proyectos = [
    {
      title: 'Calculadora de Integrales',
      description: 'Calculadora web con método de Simpson hecha en PHP y JavaScript.',
      link: 'https://github.com/tuusuario/calculadora-integrales',
    },
    {
      title: 'Pixel Odyssey',
      description: 'Juego tipo RPG estilo pixel art, desarrollado con HTML, CSS y JavaScript.',
      link: 'https://github.com/tuusuario/pixel-odyssey',
    },
    {
      title: 'Sistema de Seguros',
      description: 'Formulario PHP para contratación de seguros con base de datos.',
      link: 'https://github.com/tuusuario/sistema-seguros',
    }
  ];

  return (
    <section>
      <h2>Proyectos</h2>
      {proyectos.map((proyecto, index) => (
        <ProjectCard
          key={index}
          title={proyecto.title}
          description={proyecto.description}
          link={proyecto.link}
        />
      ))}
    </section>
  );
}

export default Projects;
