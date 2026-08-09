import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="social-links">
        <a 
          href="https://www.facebook.com/kamal.bohara.573128" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="facebook"
        >
          <i className="fab fa-facebook fa-lg"></i>
        </a>
        <a 
          href="https://github.com/Kamal857" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="github"
        >
          <i className="fab fa-github fa-lg"></i>
        </a>
        <a 
          href="https://linkedin.com/in/kamal-bohara-a00629331" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="linkedin"
        >
          <i className="fab fa-linkedin fa-lg"></i>
        </a>
      </div>
      <p>© 2025 Kamal Bohara. All rights reserved.</p>
    </footer>
  );
}
