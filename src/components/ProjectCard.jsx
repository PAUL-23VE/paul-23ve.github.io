import './ProjectCard.css';

function ProjectCard({ title, description, link }) {
  return (
    <div className="project-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={link} target="_blank" rel="noopener noreferrer">Ver en GitHub</a>
    </div>
  );
}

export default ProjectCard;