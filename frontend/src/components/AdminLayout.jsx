import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  UsersRound,
  GraduationCap,
  School,
  ChartNoAxesColumnIncreasing,
  ClipboardCheck,
  Bell,
  FileCheck2,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react';

import { API } from '../config';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem('adminUsername') || 'admin';
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch profile every time route changes
  useEffect(() => {
    setIsSidebarOpen(false);

    fetch(`${API}/api/profile/${username}`)
      .then(r => r.json())
      .then(data => {
        if (data.username) setProfile({ name: data.name || '', email: data.email || '', phone: data.phone || '', address: data.address || '' });
      })
      .catch(() => { });
  }, [username, location.pathname]);

  const displayName = profile.name || username;
  const displayEmail = profile.email || `${username}@admin.local`;
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const handleSignOut = () => {
    localStorage.removeItem('adminUsername');
    navigate('/projects');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/admin/students', icon: UsersRound },
    { name: 'Teachers', path: '/admin/teachers', icon: GraduationCap },
    { name: 'Classes', path: '/admin/classes', icon: School },
    { name: 'Results', path: '/admin/results', icon: ChartNoAxesColumnIncreasing },
    { name: 'Attendance', path: '/admin/attendance', icon: ClipboardCheck },
    { name: 'Notices', path: '/admin/notices', icon: Bell },
    { name: 'Tests', path: '/admin/tests', icon: FileCheck2 },
    { name: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  const activeItem = menuItems.find(item => item.path === location.pathname);
  const pageTitle = activeItem ? activeItem.name : 'Dashboard';

  return (
    <div className="admin-layout">
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close navigation overlay"
        ></div>
      )}

      {/* Responsive Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-brand">
          <div className="admin-logo">
            <GraduationCap size={22} strokeWidth={2} />
          </div>
          <div className="admin-brand-text">
            <h2>Aimer's Academy</h2>
            <p>Admin Portal</p>
          </div>
          <button
            type="button"
            className="admin-sidebar-close-btn"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close navigation sidebar"
            title="Close menu"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <nav className="admin-nav">
          <ul>
            {menuItems.map((item) => {
              const IconComp = item.icon;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}
                    title={item.name}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <IconComp size={20} strokeWidth={1.8} className="admin-nav-icon" />
                    <span className="admin-nav-text">{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <p className="admin-email" title={displayEmail}>{displayEmail}</p>
            <p className="admin-role">{profile.name ? profile.name : 'Administrator'}</p>
          </div>
          <button onClick={handleSignOut} className="admin-signout-btn" title="Sign Out" aria-label="Sign Out">
            <LogOut size={18} strokeWidth={1.8} className="admin-signout-icon" />
            <span className="admin-signout-text">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Sticky Mobile/Desktop Header */}
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              className="admin-menu-toggle"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle navigation menu"
              title="Open menu"
            >
              <Menu size={20} strokeWidth={2} />
            </button>
            <div className="admin-header-title">
              <h2>{pageTitle}</h2>
            </div>
          </div>
          <div className="admin-header-right">
            <div className="admin-header-user">
              <span className="admin-header-email">{displayEmail}</span>
              <span className="admin-header-badge">Admin</span>
            </div>
            <div className="admin-avatar" title={displayName}>{avatarLetter}</div>
          </div>
        </header>

        {/* Dynamic Page View */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
