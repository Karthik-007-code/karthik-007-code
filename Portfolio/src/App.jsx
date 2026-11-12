import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import Footer from './components/Footer';
import ChatPage from './components/chat/ChatPage';
import FloatingChatButton from './components/chat/FloatingChatButton';
import backgroundImage from './images/background.jpg';
import './styles/global.css';

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.toLowerCase();
    return hash === '#ask-karthik' || hash === '#chat' ? 'chat' : 'portfolio';
  });

  // Keep view synchronized with browser back/forward buttons & URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#ask-karthik' || hash === '#chat') {
        setCurrentView('chat');
      } else {
        setCurrentView('portfolio');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (view) => {
    setCurrentView(view);
    if (view === 'chat') {
      window.history.pushState(null, '', '#ask-karthik');
    }
  };

  return (
    <div
      className="app-viewport"
      style={{ '--bg-image-url': `url(${backgroundImage})` }}
    >
      {/* Background Atmosphere Layers */}
      <div className="ambient-background-layer" aria-hidden="true" />
      <div className="ambient-background-overlay" aria-hidden="true" />

      {/* Sticky Navigation */}
      <Navbar activeView={currentView} onNavigate={handleNavigate} />

      {/* View Switcher: Ask Karthik Chat vs. Main Portfolio */}
      {currentView === 'chat' ? (
        <ChatPage onBackToPortfolio={() => handleNavigate('portfolio')} />
      ) : (
        <>
          <main className="content-container">
            <Hero />
            <Projects />
            <About />
          </main>

          {/* Floating launcher trigger for immediate chatbot access */}
          <FloatingChatButton onClick={() => handleNavigate('chat')} />
        </>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
