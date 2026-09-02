import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";

const API = "http://localhost:5000";

export default function TeacherLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const email     = localStorage.getItem("teacherEmail") || "";
  const [profile, setProfile] = useState({ name: "", subject: "", assignedClass: "" });

  useEffect(() => {
    if (!email) { navigate("/teacher/login"); return; }
    fetch(`${API}/api/teacher/profile/${encodeURIComponent(email)}`)
      .then(r => r.json())
      .then(d => { if (d.name) setProfile({ name: d.name, subject: d.subject || "", assignedClass: d.assignedClass || "" }); })
      .catch(() => {});
  }, [email, location.pathname]);

  const displayName  = profile.name  || email;
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const handleSignOut = () => {
    localStorage.removeItem("teacherEmail");
    localStorage.removeItem("teacherName");
    navigate("/teacher/login");
  };

  const menuItems = [
    { name: "Dashboard",  path: "/teacher/dashboard",  icon: "ri-dashboard-line" },
    { name: "My Students",path: "/teacher/students",   icon: "ri-team-line" },
    { name: "Tests",      path: "/teacher/tests",      icon: "ri-file-list-3-line" },
    { name: "Attendance", path: "/teacher/attendance", icon: "ri-calendar-check-line" },
    { name: "Results",    path: "/teacher/results",    icon: "ri-survey-line" },
    { name: "Notices",    path: "/teacher/notices",    icon: "ri-notification-3-line" },
    { name: "Settings",   path: "/teacher/settings",   icon: "ri-settings-3-line" },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar" style={{ background: "linear-gradient(180deg, #1e3a5f 0%, #0f172a 100%)" }}>
        <div className="admin-brand">
          <div className="admin-logo" style={{ background: "linear-gradient(135deg,#0ea5e9,#6366f1)" }}>
            <i className="ri-user-star-line" />
          </div>
          <div className="admin-brand-text">
            <h2>Teacher</h2>
            <p>Portal</p>
          </div>
        </div>

        <nav className="admin-nav">
          <ul>
            {menuItems.map(item => (
              <li key={item.name}>
                <NavLink to={item.path} className={({ isActive }) => isActive ? "admin-nav-link active" : "admin-nav-link"}>
                  <i className={item.icon} /> {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <p className="admin-email" title={email}>{email}</p>
            <p className="admin-role">{profile.subject || "Teacher"}</p>
          </div>
          <button onClick={handleSignOut} className="admin-signout-btn">
            <i className="ri-logout-box-r-line" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button className="admin-back-btn" onClick={() => navigate(-1)}>
              <i className="ri-arrow-left-s-line" />
            </button>
          </div>
          <div className="admin-header-right">
            <span className="admin-header-email">{email}</span>
            <div className="admin-avatar" style={{ background: "linear-gradient(135deg,#0ea5e9,#6366f1)" }} title={displayName}>{avatarLetter}</div>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
