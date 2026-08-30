import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logoImg from '../assets/logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
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
          {/* Logo */}
          <div className="navbar-logo">
            <Link to="/" onClick={closeMenu}>
              <img src={logoImg} alt="Kamal Portfolio Logo" />
            </Link>
          </div>

          {/* Desktop Links */}
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

          {/* Mobile Hamburger */}
          <button
            className={`hamburger ${isOpen ? 'hamburger-open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={closeMenu} />}

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${isOpen ? 'mobile-sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-brand">KB</span>
          <button className="sidebar-close" onClick={closeMenu} aria-label="Close menu">
            <i className="ri-close-line"></i>
          </button>
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
