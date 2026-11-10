import ProjectCard from './ProjectCard';
import projectsData from '../data/projects.json';
import '../styles/projects.css';

export default function Projects() {
  const getVariant = (index, total) => {
    if (total === 1) return 'featured';
    if (total === 2) return index === 0 ? 'featured' : 'standard';
    // When 3 or more projects:
    // 0 -> featured (wide showcase)
    // 1 -> standard
    // 2 -> accent / complementary
    const pattern = ['featured', 'standard', 'accent'];
    return pattern[index % pattern.length];
  };

  return (
    <section id="projects" className="projects-section" aria-label="Selected Projects">
      <div className="section-header">
        <div className="section-eyebrow">
          <span className="eyebrow-index">01</span>
          <span className="eyebrow-divider">//</span>
          <span className="eyebrow-label">SELECTED WORK</span>
        </div>
        <h2 className="section-heading">Featured Projects</h2>
        <p className="section-subheading">
          Production-grade applications and systems engineered with modern AI architectures.
        </p>
      </div>

      <div className="projects-editorial-layout">
        {projectsData.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            variant={getVariant(index, projectsData.length)}
          />
        ))}
      </div>
    </section>
  );
}

