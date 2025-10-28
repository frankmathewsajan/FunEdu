import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {
  Navbar,
  Hero,
  ContentCards,
  ScrollAnimation,
  Teachers,
  Stats,
  Testimonials,
  FunSection,
  Footer,
  Dashboard
} from './components';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import LoginSuccess from './components/auth/LoginSuccess';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll, .fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('active');
        }
      });

      // Parallax effects
      const parallaxElements = document.querySelectorAll('.parallax-element');
      parallaxElements.forEach((element) => {
        const speed = parseFloat(element.getAttribute('data-speed') || '0.5');
        const yPos = -(window.pageYOffset * speed);
        (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });

      // Interactive people movement
      const people = document.querySelectorAll('.animated-person');
      people.forEach((person, index) => {
        const yPos = Math.sin(window.pageYOffset * 0.001 + index) * 10;
        const xPos = Math.cos(window.pageYOffset * 0.001 + index) * 5;
        (person as HTMLElement).style.transform = `translate(${xPos}px, ${yPos}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const HomePage = () => (
    <>
      <Hero />
      <ContentCards />
      <ScrollAnimation />
      <Teachers />
      <Stats />
      <Testimonials />
      <FunSection />
      <Footer />
    </>
  );

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login-success" element={<LoginSuccess />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;