import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UsersRound,
  FileCheck2,
  ClipboardCheck,
  ChartNoAxesColumnIncreasing,
  Bell,
  Settings,
  GraduationCap,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { API } from "../config";

export default function TeacherLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = localStorage.getItem("teacherEmail") || "";
  const [profile, setProfile] = useState({ name: "", subject: "", assignedClass: "" });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    // Close sidebar on route change on mobile
    setIsMobileOpen(false);
    if (!email) { navigate("/projects"); return; }
    fetch(`${API}/api/teacher/profile/${encodeURIComponent(email)}`)
      .then(r => r.json())
      .then(d => { if (d.name) setProfile({ name: d.name, subject: d.subject || "", assignedClass: d.assignedClass || "" }); })
      .catch(() => { });
  }, [email, location.pathname]);

  const handleToggle = () => {
    if (window.innerWidth <= 768) {
      setIsMobileOpen(prev => !prev);
    } else {
      setIsCollapsed(prev => !prev);
    }
  };

  const displayName = profile.name || email;
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const handleSignOut = () => {
    localStorage.removeItem("teacherEmail");
    localStorage.removeItem("teacherName");
    navigate("/projects");
  };

  const menuItems = [
    { name: "Dashboard", path: "/teacher/dashboard", icon: LayoutDashboard },
    { name: "My Students", path: "/teacher/students", icon: UsersRound },
    { name: "Tests", path: "/teacher/tests", icon: FileCheck2 },
    { name: "Attendance", path: "/teacher/attendance", icon: ClipboardCheck },
    { name: "Results", path: "/teacher/results", icon: ChartNoAxesColumnIncreasing },
    { name: "Notices", path: "/teacher/notices", icon: Bell },
    { name: "Settings", path: "/teacher/settings", icon: Settings },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setIsMobileOpen(false)} aria-label="Close navigation overlay"></div>
      )}

      <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'open' : ''}`}>
        <div className="admin-brand">
          <div className="admin-logo">
            <GraduationCap size={22} strokeWidth={2} />
          </div>
          <div className="admin-brand-text">
            <h2>Teacher</h2>
            <p>Portal</p>
          </div>
          <button
            type="button"
            className="admin-sidebar-close-btn"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close navigation sidebar"
            title="Close menu"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <nav className="admin-nav">
          <ul>
            {menuItems.map(item => {
              const IconComp = item.icon;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}
                    title={item.name}
                    onClick={() => setIsMobileOpen(false)}
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
            <p className="admin-email" title={email}>{email}</p>
            <p className="admin-role">{profile.subject || "Teacher"}</p>
          </div>
          <button onClick={handleSignOut} className="admin-signout-btn" title="Sign Out" aria-label="Sign Out">
            <LogOut size={18} strokeWidth={1.8} className="admin-signout-icon" />
            <span className="admin-signout-text">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button className="admin-menu-toggle" onClick={handleToggle} aria-label="Toggle navigation menu" title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
              <Menu size={20} strokeWidth={2} />
            </button>
            <div className="admin-header-title">
              <h2>Teacher Portal</h2>
            </div>
          </div>
          <div className="admin-header-right">
            <div className="admin-header-user">
              <span className="admin-header-email">{email}</span>
              <span className="admin-header-badge">{profile.subject || "Teacher"}</span>
            </div>
            <div className="admin-avatar" style={{ background: "#09090b", color: "#ffffff", border: "1px solid #27272a" }} title={displayName}>{avatarLetter}</div>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
