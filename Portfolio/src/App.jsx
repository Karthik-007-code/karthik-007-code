import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import Footer from './components/Footer';
import backgroundImage from './images/background.jpg';
import './styles/global.css';

export default function App() {
  return (
    <div
      className="app-viewport"
      style={{ '--bg-image-url': `url(${backgroundImage})` }}
    >
      {/* Background Atmosphere Layers */}
      <div className="ambient-background-layer" aria-hidden="true" />
      <div className="ambient-background-overlay" aria-hidden="true" />

      {/* Sticky Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="content-container">
        <Hero />
        <Projects />
        <About />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
