import Hero from './components/Hero';
import ScrollStory from './components/ScrollStory';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  return (
    <>
      <header className="site-header">
        <div className="logo">Galaad Neau</div>
        <nav>
          <a href="#work">Work</a>
          <a href="#story">Story</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <Hero />
        <ScrollStory />
        <Projects />
        <Contact />
      </main>
    </>
  );
}

export default App;
