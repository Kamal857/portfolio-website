import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';

const API = 'http://localhost:5000';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem('adminUsername') || 'admin';
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch profile every time the route changes (so Settings updates are reflected immediately)
  useEffect(() => {
    // Close sidebar on route change on mobile
    setIsSidebarOpen(false);

    fetch(`${API}/api/profile/${username}`)
      .then(r => r.json())
      .then(data => {
        if (data.username) setProfile({ name: data.name || '', email: data.email || '', phone: data.phone || '', address: data.address || '' });
      })
      .catch(() => {});
  }, [username, location.pathname]);

  const displayName = profile.name || username;
  const displayEmail = profile.email || `${username}@admin.local`;
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const handleSignOut = () => {
    localStorage.removeItem('adminUsername');
    navigate('/projects');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'ri-dashboard-line' },
    { name: 'Students', path: '/admin/students', icon: 'ri-team-line' },
    { name: 'Teachers', path: '/admin/teachers', icon: 'ri-user-star-line' },
    { name: 'Classes', path: '/admin/classes', icon: 'ri-book-read-line' },
    { name: 'Results', path: '/admin/results', icon: 'ri-survey-line' },
    { name: 'Attendance', path: '/admin/attendance', icon: 'ri-calendar-check-line' },
    { name: 'Notices', path: '/admin/notices', icon: 'ri-notification-3-line' },
    { name: 'Tests', path: '/admin/tests', icon: 'ri-file-list-3-line' },
    { name: 'Settings', path: '/admin/settings', icon: 'ri-settings-3-line' }
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-brand">
          <div className="admin-logo">
            <i className="ri-graduation-cap-fill"></i>
          </div>
          <div className="admin-brand-text">
            <h2>Aimer's</h2>
            <p>Academy</p>
          </div>
        </div>

        <nav className="admin-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}
                >
                  <i className={item.icon}></i>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <p className="admin-email" title={displayEmail}>{displayEmail}</p>
            <p className="admin-role">{profile.name ? profile.name : 'Admin'}</p>
          </div>
          <button onClick={handleSignOut} className="admin-signout-btn">
            <i className="ri-logout-box-r-line"></i>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header-left">
            <button className="admin-menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <i className="ri-menu-line"></i>
            </button>
            <button className="admin-back-btn" onClick={() => navigate(-1)}>
              <i className="ri-arrow-left-s-line"></i>
            </button>
          </div>
          <div className="admin-header-right">
            <span className="admin-header-email">{displayEmail}</span>
            <div className="admin-avatar" title={displayName}>{avatarLetter}</div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
