import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000';

export default function Projects() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const navigate = useNavigate();

  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatusMessage({ text: 'Logging in...', type: 'info' });

    try {
      // ── 1. Try Admin login (username + password) ──────────────────
      const adminRes = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const adminData = await adminRes.json();

      if (adminRes.ok) {
        localStorage.setItem('adminUsername', username);
        setStatusMessage({ text: 'Welcome, Admin! Redirecting...', type: 'success' });
        setTimeout(() => navigate('/admin/dashboard'), 900);
        return;
      }

      // ── 2. Try Teacher login (email + password) ───────────────────
      const teacherRes = await fetch(`${API}/api/teacher/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      });
      const teacherData = await teacherRes.json();

      if (teacherRes.ok) {
        localStorage.setItem('teacherEmail', teacherData.teacher.email);
        localStorage.setItem('teacherName',  teacherData.teacher.name);
        setStatusMessage({ text: `Welcome, ${teacherData.teacher.name}! Redirecting...`, type: 'success' });
        setTimeout(() => navigate('/teacher/dashboard'), 900);
        return;
      }

      // ── Both failed ───────────────────────────────────────────────
      setStatusMessage({ text: 'Invalid credentials. Check your username/email and password.', type: 'error' });

    } catch (error) {
      console.error('Login error:', error);
      setStatusMessage({ text: 'Network error. Is the backend running?', type: 'error' });
    }
  };

  return (
    <section className="main">
      <div className="hero-welcome">
        <hr className="accent-hr" />
        <h1>PROJECTS</h1>
        <hr className="accent-hr" />
      </div>
      
      <section className="projects-container" style={{ padding: '40px 6%', display: 'flex', justifyContent: 'center' }}>
        
        {/* Aimers Academy Project Card with Login */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '100%',
          borderTop: '5px solid #0ea5e9',
          textAlign: 'left'
        }}>
          <h2 style={{ fontSize: '1.8rem', color: '#1a1a1a', marginBottom: '10px', textAlign: 'center', fontWeight: '800' }}>Aimers Academy</h2>
          <p style={{ color: '#666', textAlign: 'center', marginBottom: statusMessage.text ? '15px' : '30px' }}>Login</p>
          
          {statusMessage.text && (
            <div style={{ 
              padding: '10px', 
              borderRadius: '8px', 
              marginBottom: '20px', 
              textAlign: 'center',
              backgroundColor: statusMessage.type === 'success' ? '#dcfce7' : statusMessage.type === 'error' ? '#fee2e2' : '#e0f2fe',
              color: statusMessage.type === 'success' ? '#166534' : statusMessage.type === 'error' ? '#991b1b' : '#075985',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333', fontSize: '0.95rem' }}>Username or Email</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '10px',
                  border: '1px solid #ddd',
                  outline: 'none',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s'
                }}
                placeholder="Username or Email"
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333', fontSize: '0.95rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 44px 12px 15px',
                    borderRadius: '10px',
                    border: '1px solid #ddd',
                    outline: 'none',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                  placeholder="Password"
                  required
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '1.1rem' }}>
                  <i className={showPw ? 'ri-eye-off-line' : 'ri-eye-line'} />
                </button>
              </div>
            </div>
            
            <button 
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '10px', textAlign: 'center', border: 'none', cursor: 'pointer' }}
            >
              Log In
            </button>
          </form>
          

        </div>

      </section>
    </section>
  );
}
