import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import pgImg from '../assets/pg.jpg';
import About from './About';
import Contact from './Contact';

// Typewriter hook — cycles through an array of strings
function useTypewriter(words, typingSpeed = 90, deletingSpeed = 55, pauseMs = 1800) {
  const [display, setDisplay] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState('typing'); // 'typing' | 'pausing' | 'deleting'

  useEffect(() => {
    const current = words[wordIndex % words.length];

    if (phase === 'typing') {
      if (display.length < current.length) {
        const t = setTimeout(() => setDisplay(current.slice(0, display.length + 1)), typingSpeed);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase('deleting'), pauseMs);
        return () => clearTimeout(t);
      }
    }

    if (phase === 'deleting') {
      if (display.length > 0) {
        const t = setTimeout(() => setDisplay(display.slice(0, -1)), deletingSpeed);
        return () => clearTimeout(t);
      } else {
        setWordIndex(i => i + 1);
        setPhase('typing');
      }
    }
  }, [display, phase, wordIndex, words, typingSpeed, deletingSpeed, pauseMs]);

  return display;
}

export default function Home() {
  const typedText = useTypewriter(['TECH-ENTHUSIAST', 'WEB-DEVELOPER', 'PROBLEM-SOLVER']);

  return (
    <>
      {/* Hero Welcome Header */}
      <div className="hero-welcome">
        <h1>WELCOME TO MY SPACE</h1>
        <hr className="accent-hr" />
      </div>

      {/* Hero Section */}
      <section className="default1">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-greeting">Hi, I'm</span>
            <h2 className="hero-name">KAMAL BOHARA</h2>

            {/* Typewriter tagline */}
            <div className="hero-typewriter">
              <span className="typewriter-text">{typedText}</span>
              <span className="typewriter-cursor">|</span>
            </div>

            <p className="hero-description">
              Building digital experiences that blend engineering excellence with creative design.
            </p>
            <div className="hero-btns">
              <Link to="/about" className="btn btn-primary">About Me</Link>
              <a
                href="https://drive.google.com/file/d/1M1e7nNCJDvMgp8N6n_iEUuwJbKwRuNz9/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                Download CV
              </a>
            </div>
          </div>
          <div className="hero-image-container">
            <div className="image-wrapper">
              <img src={pgImg} alt="Kamal Bohara - Portrait" className="hero-img" />
              <div className="image-accent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Education & Skills Card Section */}
      <section className="default2">
        <div className="home-default2left">
          <h4 className="section-card-title">Education</h4>
          <ul className="edu-list">
            <li>
              <div className="edu-icon"><i className="ri-school-line"></i></div>
              <div className="edu-info">
                <span className="edu-year">SEE</span>
                <p>MALAKHETI VISION ACADEMY</p>
              </div>
            </li>
            <li>
              <div className="edu-icon"><i className="ri-school-line"></i></div>
              <div className="edu-info">
                <span className="edu-year">+2</span>
                <a href="https://nastss.edu.np/" target="_blank" rel="noopener noreferrer">NAST SECONDARY SCHOOL</a>
              </div>
            </li>
            <li>
              <div className="edu-icon"><i className="ri-school-line"></i></div>
              <div className="edu-info">
                <span className="edu-year">Bachelor in Computer Engineering</span>
                <a href="https://nast.edu.np/" target="_blank" rel="noopener noreferrer">NAST College</a>
                <p style={{ fontSize: '0.9em', color: '#999', marginTop: '4px' }}>2025 - Present</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="home-default2right">
          <h4 className="section-card-title">Skills</h4>
          
          {/* Web Development Row */}
          <div className="skill-category">
            <div className="skill-category-header">
              <i className="fab fa-firefox-browser"></i>
              <h5 className="skill-category-title">Web Development</h5>
            </div>
            <div className="skills-grid">
              <div className="skill-item">
                <i className="fab fa-html5" style={{ color: '#e34c26' }}></i>
                <span>HTML</span>
              </div>
              <div className="skill-item">
                <i className="fab fa-css3-alt" style={{ color: '#264de4' }}></i>
                <span>CSS</span>
              </div>
              <div className="skill-item">
                <i className="fab fa-square-js" style={{ color: '#f7df1e' }}></i>
                <span>JavaScript</span>
              </div>
            </div>
          </div>

          {/* Languages Row */}
          <div className="skill-category">
            <div className="skill-category-header">
              <i className="fas fa-code"></i>
              <h5 className="skill-category-title">Languages</h5>
            </div>
            <div className="skills-grid">
              <div className="skill-item">
                <i className="fab fa-c" style={{ color: '#004482' }}></i>
                <span>C</span>
              </div>
              <div className="skill-item">
                <i className="fab fa-cuttlefish" style={{ color: '#00599c' }}></i>
                <span>C++</span>
              </div>
              <div className="skill-item">
                <i className="fab fa-python" style={{ color: '#3776ab' }}></i>
                <span>Python</span>
              </div>
            </div>
          </div>

          {/* Backend Row */}
          <div className="skill-category">
            <div className="skill-category-header">
              <i className="fas fa-server"></i>
              <h5 className="skill-category-title">Backend</h5>
            </div>
            <div className="skills-grid">
              <div className="skill-item">
                <i className="fab fa-node-js" style={{ color: '#68a063' }}></i>
                <span>Node.js</span>
              </div>
            </div>
          </div>

          {/* Database Row */}
          <div className="skill-category">
            <div className="skill-category-header">
              <i className="fas fa-database"></i>
              <h5 className="skill-category-title">Database</h5>
            </div>
            <div className="skills-grid">
              <div className="skill-item">
                <i className="fas fa-leaf" style={{ color: '#13aa52' }}></i>
                <span>MongoDB</span>
              </div>
              <div className="skill-item">
                <i className="fas fa-database" style={{ color: '#00758f' }}></i>
                <span>MySQL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section Consolidated */}
      <About />

      {/* Contact Section Consolidated */}
      <Contact />
    </>
  );
}
