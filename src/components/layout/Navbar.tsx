import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap';
import { BookOpen, Home, Info, ShoppingBag, Briefcase, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <BSNavbar 
      expand="lg" 
      fixed="top"
      className={`custom-navbar ${scrolled ? 'scrolled' : ''}`}
      style={{
        backgroundColor: scrolled ? 'rgba(255, 252, 248, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease',
        borderRadius: '0 0 20px 20px',
        boxShadow: scrolled ? '0 5px 20px rgba(255, 207, 158, 0.2)' : 'none'
      }}
    >
      <Container>
        <BSNavbar.Brand href="#home" className="d-flex align-items-center">
          <BookOpen className="me-2 text-primary interactive-logo" style={{ color: 'var(--accent-coral)' }} />
          <span className="gradient-text fw-bold fs-4">EduFun</span>
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#home" className="nav-item-custom">
              <Home size={18} className="me-1" />
              Home
            </Nav.Link>
            <Nav.Link href="#about" className="nav-item-custom">
              <Info size={18} className="me-1" />
              About
            </Nav.Link>
            <Nav.Link href="#store" className="nav-item-custom">
              <ShoppingBag size={18} className="me-1" />
              Store
            </Nav.Link>
            <Nav.Link href="#career" className="nav-item-custom">
              <Briefcase size={18} className="me-1" />
              Career
            </Nav.Link>
            {isAuthenticated ? (
              <Nav.Link 
                href="#logout" 
                className="nav-item-custom"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                  navigate('/');
                }}
              >
                <LogOut size={18} className="me-1" />
                Logout
              </Nav.Link>
            ) : (
              <Nav.Link 
                href="#login" 
                className="nav-item-custom"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}
              >
                <LogIn size={18} className="me-1" />
                Login
              </Nav.Link>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>

      <style>{`
        .nav-item-custom {
          position: relative;
          color: var(--text-dark) !important;
          font-weight: 500;
          padding: 8px 16px !important;
          margin: 0 5px;
          border-radius: 20px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }

        .nav-item-custom:hover {
          background: linear-gradient(135deg, var(--primary-peach), var(--secondary-peach));
          color: white !important;
          transform: translateY(-2px);
        }

        .nav-item-custom::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          width: 0;
          height: 2px;
          background: var(--accent-coral);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .nav-item-custom:hover::after {
          width: 80%;
        }
      `}</style>
    </BSNavbar>
  );
};

export default Navbar;