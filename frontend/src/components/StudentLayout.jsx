import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  ClipboardCheck,
  Award,
  Bell,
  Settings,
  GraduationCap,
  LogOut,
  Menu,
  X,
} from "lucide-react";

// Sample student data used across the portal
export const SAMPLE_STUDENT = {
  name: "Pranish Bohara",
  registrationNo: "01",
  dateOfAdmission: "11 April, 2026",
  class: "Class 1",
  family: "Family",
  discountInFee: "50 %",
  dateOfBirth: "23 March, 2021",
  gender: "Male",
  anyIdentificationMark: "",
  bloodGroup: "",
  diseaseIfAny: "",
  studentBirthFormId: "",
  caste: "Hindu",
  previousSchool: "",
  previousIdBoardRollNo: "",
  anyAdditionalNote: "",
  orphanStudent: "No",
  osc: "",
  religion: "Hinduism",
  totalSiblings: "0",
  fatherName: "Birendra Bohara",
  motherName: "Laxmi Bohara",
  address: "",
  phone: "",
  studentId: "STU001",
};

export default function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    // Close mobile drawer on route change
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleToggle = () => {
    if (window.innerWidth <= 768) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  const student = SAMPLE_STUDENT;
  const avatarLetter = student.name.charAt(0).toUpperCase();

  const handleSignOut = () => {
    localStorage.removeItem("studentId");
    navigate("/projects");
  };

  const menuItems = [
    { name: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
    { name: "My Timetable", path: "/student/timetable", icon: CalendarDays },
    { name: "My Report Card", path: "/student/report-card", icon: FileText },
    { name: "Test Results", path: "/student/test-results", icon: ClipboardCheck },
    { name: "Exam Result", path: "/student/exam-result", icon: Award },
    { name: "Notices", path: "/student/notices", icon: Bell },
    { name: "Account Settings", path: "/student/settings", icon: Settings },
  ];

  const activeItem = menuItems.find((item) => item.path === location.pathname);
  const pageTitle = activeItem ? activeItem.name : "Dashboard";

  return (
    <div className="admin-layout">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close navigation overlay"
        ></div>
      )}

      <aside className={`admin-sidebar ${isCollapsed ? "collapsed" : ""} ${isMobileOpen ? "open" : ""}`}>
        <div className="admin-brand">
          <div className="admin-logo">
            <GraduationCap size={22} strokeWidth={2} />
          </div>
          <div className="admin-brand-text">
            <h2>Aimer's Academy</h2>
            <p>Student Portal</p>
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
            {menuItems.map((item) => {
              const IconComp = item.icon;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive ? "admin-nav-link active" : "admin-nav-link"
                    }
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
            <p className="admin-email" title={student.name}>{student.name}</p>
            <p className="admin-role">{student.class}</p>
          </div>
          <button onClick={handleSignOut} className="admin-signout-btn" title="Log Out" aria-label="Log Out">
            <LogOut size={18} strokeWidth={1.8} className="admin-signout-icon" />
            <span className="admin-signout-text">Log Out</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              className="admin-menu-toggle"
              onClick={handleToggle}
              aria-label="Toggle navigation menu"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu size={20} strokeWidth={2} />
            </button>
            <div className="admin-header-title">
              <h2>{pageTitle}</h2>
            </div>
          </div>
          <div className="admin-header-right">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: "6px" }}>
              <span style={{ fontSize: "0.8rem", color: "#71717a", fontWeight: 600, background: "#f4f4f5", padding: "6px 12px", borderRadius: "6px", border: "1px solid #e4e4e7" }}>
                📅 {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </span>
              <NavLink
                to="/student/notices"
                style={{
                  position: "relative",
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "#ffffff",
                  border: "1px solid #e4e4e7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#09090b",
                  textDecoration: "none",
                }}
                title="Notices"
              >
                <Bell size={17} />
                <span
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#ef4444",
                    border: "2px solid #ffffff",
                  }}
                />
              </NavLink>
            </div>
            <div className="admin-header-user">
              <span className="admin-header-email">{student.name}</span>
              <span className="admin-header-badge" style={{ background: "#f4f4f5", color: "#18181b", border: "1px solid #e4e4e7", fontWeight: 700 }}>
                Class 10-A
              </span>
            </div>
            <div className="admin-avatar" style={{ background: "#09090b", color: "#ffffff", border: "1px solid #27272a" }} title={student.name}>
              {avatarLetter}
            </div>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
