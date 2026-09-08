import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/research', label: 'Research' },
    { to: '/projects', label: 'Projects' },
    { to: '/contact', label: 'Contact' },
    { to: '/about', label: 'About' },
  ];

  return (
    <>
      <header className={`navbar-header ${scrolled ? 'navbar-scrolled' : ''}`}>
        <nav className="navbar-inner">
          <div className="navbar-logo">
            <Link to="/" onClick={closeMenu}>
              <img src={logoImg} alt="Logo" />
            </Link>
          </div>

          <ul className="navbar-links">
            {navLinks.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    isActive ? 'nav-link nav-link-active' : 'nav-link'
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="nav-controls">
            <ThemeToggle />
            <button
              className={`hamburger ${isOpen ? 'hamburger-open' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </header>

      {isOpen && <div className="sidebar-overlay" onClick={closeMenu} />}

      <div className={`mobile-sidebar ${isOpen ? 'mobile-sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-brand">KB</span>
          <div className="sidebar-right">
            <ThemeToggle />
            <button className="sidebar-close" onClick={closeMenu} aria-label="Close menu">
              <i className="ri-close-line" />
            </button>
          </div>
        </div>
        <ul className="sidebar-nav">
          {navLinks.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? 'sidebar-link sidebar-link-active' : 'sidebar-link'
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
