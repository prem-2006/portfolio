import useLenis from './hooks/useLenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  // Initialize Lenis smooth scroll + GSAP sync
  useLenis();

  return (
    <div className="bg-bg min-h-screen text-white font-body">
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Achievements />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
