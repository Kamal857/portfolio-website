import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
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
    { name: 'Settings', path: '/admin/settings', icon: 'ri-settings-3-line' }
  ];

  const currentPathName = menuItems.find(item => item.path === location.pathname)?.name || 'Admin';

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
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
            <p className="admin-email">admin@malakheti.edu</p>
            <p className="admin-role">Admin</p>
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
            <button className="admin-back-btn" onClick={() => navigate(-1)}>
              <i className="ri-arrow-left-s-line"></i>
            </button>
          </div>
          <div className="admin-header-right">
            <span className="admin-header-email">admin@malakheti.edu</span>
            <div className="admin-avatar">A</div>
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
