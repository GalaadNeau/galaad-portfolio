const projects = [
  {
    title: 'Motion-led Product Landing',
    desc: 'Narrative-first launch page with measurable uplift on engagement and sign-up intent.',
    tag: 'Experience Design'
  },
  {
    title: 'Design System Evolution',
    desc: 'Scalable UI foundations combining editorial aesthetics with production-ready components.',
    tag: 'UI Engineering'
  },
  {
    title: 'Interactive Case Storytelling',
    desc: 'Scroll chapters that transform static portfolios into immersive conversion funnels.',
    tag: 'Brand x Product'
  }
];

function Projects() {
  return (
    <section className="content" id="projects">
      <div className="section-head">
        <p className="eyebrow">Selected Work</p>
        <h2>Proof of craft, built for impact.</h2>
      </div>

      <div className="project-grid">
        {projects.map((project) => (
          <article key={project.title} className="project-card soft-reveal">
            <span>{project.tag}</span>
            <h3>{project.title}</h3>
            <p>{project.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Projects;
