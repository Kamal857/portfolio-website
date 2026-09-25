import React from "react";
import { Link } from "react-router-dom";
import { SAMPLE_STUDENT } from "../../components/StudentLayout";
import {
  GraduationCap,
  CalendarDays,
  Users,
  MapPin,
  Phone,
  Droplets,
  BookOpen,
  Award,
  ClipboardCheck,
  CheckCircle2,
  ArrowRight,
  Download,
  Calendar,
} from "lucide-react";

/* ── Minimalist Circular Progress Ring ── */
function MinimalProgressRing({ percentage, label, isSuccess = true, size = 84 }) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const strokeColor = isSuccess ? "#16a34a" : "#09090b";

  return (
    <div className="sp-dial-container">
      <div className="sp-dial-svg-wrap">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e4e4e7"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="sp-dial-center-text">
          <div className="sp-dial-val">
            {percentage}<small>%</small>
          </div>
        </div>
      </div>
      <span className="sp-dial-label">
        <span className="sp-dial-dot" style={{ background: strokeColor }}></span>
        {label}
      </span>
    </div>
  );
}

/* ── Info Item ── */
function InfoItem({ label, value, icon }) {
  return (
    <div className="sp-info-item">
      <div className="sp-info-label-wrap">
        {icon && <div className="sp-info-icon-chip">{icon}</div>}
        <span className="sp-info-label">{label}</span>
      </div>
      <span className="sp-info-val-text">{value || "—"}</span>
    </div>
  );
}

export default function StudentDashboard() {
  const s = SAMPLE_STUDENT;

  const attendance = {
    overallPct: 94,
    monthPct: 96,
    monthLabel: "Sep 2026",
    todayStatus: "PRESENT",
    yesterdayStatus: "PRESENT",
    presents: 22,
    leaves: 1,
    absents: 0,
    presentsTotal: 178,
    leavesTotal: 4,
    absentsTotal: 2,
  };

  const recentTests = [
    { subject: "Mathematics", topic: "Calculus & Geometry", score: "24/25", pct: 96, grade: "A+", badgeClass: "a-plus" },
    { subject: "Science", topic: "Optics & Thermodynamics", score: "22/25", pct: 88, grade: "A", badgeClass: "a" },
    { subject: "English", topic: "Grammar & Creative Essay", score: "25/25", pct: 100, grade: "A+", badgeClass: "a-plus" },
    { subject: "Social Studies", topic: "Modern World History", score: "20/25", pct: 80, grade: "B+", badgeClass: "b-plus" },
  ];

  return (
    <div className="sp-dashboard">
      {/* ── Welcome Banner (Clean Obsidian / Professional Black) ── */}
      <div className="sp-welcome-banner">
        <div className="sp-welcome-main">
          <div className="sp-welcome-icon">
            <GraduationCap size={26} strokeWidth={2} />
          </div>
          <div className="sp-welcome-text">
            <div className="sp-welcome-badge">
              <span className="live-dot"></span>
              Academic Session 2025/26 • Term II
            </div>
            <h2>{s.name}</h2>
            <p className="sp-welcome-tagline">
              Aimer's Academy • Roll No: {s.registrationNo} • {s.class}
            </p>
          </div>
        </div>
        <div className="sp-welcome-actions">
          <Link to="/student/report-card" className="sp-banner-btn primary-light">
            <Award size={15} /> Grade Sheet
          </Link>
          <Link to="/student/timetable" className="sp-banner-btn">
            <CalendarDays size={15} /> Schedule
          </Link>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="sp-grid">
        {/* LEFT COLUMN: Student Profile Card */}
        <div className="sp-profile-card">
          <div className="sp-avatar-frame">
            <div className="sp-avatar-circle">
              <span>{s.name.split(" ").map((w) => w[0]).join("").toUpperCase()}</span>
            </div>
            <span className="sp-avatar-status-dot" title="Active Student" />
          </div>

          <div className="sp-profile-header-info">
            <h2 className="sp-profile-name">{s.name}</h2>
            <div className="sp-profile-pills">
              <span className="sp-pill sp-pill-primary">Roll #{s.registrationNo}</span>
              <span className="sp-pill">{s.class}</span>
              <span className="sp-pill sp-pill-success">Active</span>
            </div>
          </div>

          {/* Academic Info */}
          <div className="sp-section-heading">Academic Record</div>
          <div className="sp-profile-details">
            <InfoItem
              label="Date of Admission"
              value={s.dateOfAdmission}
              icon={<Calendar size={13} />}
            />
            <InfoItem
              label="Date of Birth"
              value={s.dateOfBirth}
              icon={<CalendarDays size={13} />}
            />
            <InfoItem
              label="Gender"
              value={s.gender}
              icon={<Users size={13} />}
            />
            <InfoItem
              label="Blood Group"
              value={s.bloodGroup || "O+ Positive"}
              icon={<Droplets size={13} />}
            />
            <InfoItem
              label="Religion & Caste"
              value={`${s.religion} (${s.caste})`}
              icon={<BookOpen size={13} />}
            />
          </div>

          {/* Guardian Info */}
          <div className="sp-section-heading">Guardian Details</div>
          <div className="sp-profile-details">
            <InfoItem
              label="Father Name"
              value={s.fatherName}
              icon={<Users size={13} />}
            />
            <InfoItem
              label="Mother Name"
              value={s.motherName}
              icon={<Users size={13} />}
            />
            <InfoItem
              label="Contact Phone"
              value={s.phone || "+977 9800000000"}
              icon={<Phone size={13} />}
            />
            <InfoItem
              label="Address"
              value={s.address || "Kathmandu, Nepal"}
              icon={<MapPin size={13} />}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Reports & Widgets */}
        <div className="sp-reports">
          {/* ── 1. Attendance Widget ── */}
          <div className="sp-report-card">
            <div className="sp-card-header">
              <div className="sp-card-title-group">
                <span className="sp-badge-num">1</span>
                <h3>Attendance Overview</h3>
              </div>
              <span className="sp-pill sp-pill-success">96% Regular</span>
            </div>

            <div className="sp-attendance-grid">
              <div className="sp-dials-row">
                <MinimalProgressRing
                  percentage={attendance.overallPct}
                  label="Overall"
                  isSuccess={true}
                />
                <MinimalProgressRing
                  percentage={attendance.monthPct}
                  label={attendance.monthLabel}
                  isSuccess={false}
                />
              </div>

              <div className="sp-day-status-row">
                <div className="sp-day-status-card">
                  <span className="sp-day-name">Today</span>
                  <span className="sp-status-tag present">Present</span>
                </div>
                <div className="sp-day-status-card">
                  <span className="sp-day-name">Yesterday</span>
                  <span className="sp-status-tag present">Present</span>
                </div>
              </div>

              <div className="sp-att-stat-cards">
                <div className="sp-stat-pill-box present">
                  <div className="sp-stat-box-top">
                    <span className="sp-stat-box-label">PRESENTS</span>
                    <span className="sp-stat-box-num">{attendance.presents}</span>
                  </div>
                  <div className="sp-stat-box-bottom">
                    <span>Session:</span>
                    <span>{attendance.presentsTotal}</span>
                  </div>
                </div>

                <div className="sp-stat-pill-box leave">
                  <div className="sp-stat-box-top">
                    <span className="sp-stat-box-label">LEAVES</span>
                    <span className="sp-stat-box-num">{attendance.leaves}</span>
                  </div>
                  <div className="sp-stat-box-bottom">
                    <span>Session:</span>
                    <span>{attendance.leavesTotal}</span>
                  </div>
                </div>

                <div className="sp-stat-pill-box absent">
                  <div className="sp-stat-box-top">
                    <span className="sp-stat-box-label">ABSENTS</span>
                    <span className="sp-stat-box-num">{attendance.absents}</span>
                  </div>
                  <div className="sp-stat-box-bottom">
                    <span>Session:</span>
                    <span>{attendance.absentsTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. Class Tests Report ── */}
          <div className="sp-report-card">
            <div className="sp-card-header">
              <div className="sp-card-title-group">
                <span className="sp-badge-num">2</span>
                <h3>Recent Class Tests</h3>
              </div>
              <Link to="/student/test-results" className="sp-card-action-link">
                View All <ArrowRight size={13} />
              </Link>
            </div>

            <table className="sp-mini-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Score</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {recentTests.map((t, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{t.subject}</div>
                      <div style={{ fontSize: "0.7rem", color: "#71717a" }}>{t.topic}</div>
                      <div className="sp-progress-bar-wrap">
                        <div
                          className="sp-progress-bar-fill"
                          style={{
                            width: `${t.pct}%`,
                            background: t.pct >= 90 ? "#16a34a" : "#09090b",
                          }}
                        />
                      </div>
                    </td>
                    <td style={{ fontWeight: 800 }}>{t.score}</td>
                    <td>
                      <span className={`sp-grade-badge ${t.badgeClass}`}>{t.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── 3. Examination Report ── */}
          <div className="sp-report-card">
            <div className="sp-card-header">
              <div className="sp-card-title-group">
                <span className="sp-badge-num">3</span>
                <h3>Terminal Examination</h3>
              </div>
              <Link to="/student/exam-result" className="sp-card-action-link">
                Full Details <ArrowRight size={13} />
              </Link>
            </div>

            <div className="sp-exam-highlight-box">
              <div className="sp-exam-highlight-left">
                <div className="sp-trophy-icon">
                  <Award size={20} />
                </div>
                <div className="sp-exam-highlight-text">
                  <h4>First Terminal Exam 2026</h4>
                  <p>Standing: Ranked #2 in Class</p>
                </div>
              </div>
              <div className="sp-exam-gpa-badge">
                <div className="sp-exam-gpa-val">3.88</div>
                <div className="sp-exam-gpa-label">GPA (A+)</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "6px" }}>
              <span style={{ fontSize: "0.8rem", color: "#71717a" }}>
                Total Marks: <strong style={{ color: "#09090b" }}>468 / 500</strong> (93.6%)
              </span>
              <Link to="/student/report-card" style={{ fontSize: "0.8rem", fontWeight: 700, color: "#09090b", textDecoration: "underline" }}>
                Print Result Slip
              </Link>
            </div>
          </div>

          {/* ── 4. Fee & Billing Status ── */}
          <div className="sp-report-card">
            <div className="sp-card-header">
              <div className="sp-card-title-group">
                <span className="sp-badge-num">4</span>
                <h3>Fee & Billing Status</h3>
              </div>
              <span className="sp-pill sp-pill-success">Paid in Full</span>
            </div>

            <div className="sp-fee-widget">
              <div className="sp-fee-overview-row">
                <div className="sp-fee-stat-item">
                  <div className="sp-fee-stat-label">Term Tuition Fee</div>
                  <div className="sp-fee-stat-val">Rs. 18,500</div>
                </div>
                <div className="sp-fee-stat-item">
                  <div className="sp-fee-stat-label">Scholarship Grant</div>
                  <div className="sp-fee-stat-val" style={{ color: "#16a34a" }}>-50% Applied</div>
                </div>
              </div>

              <div className="sp-fee-status-banner">
                <CheckCircle2 size={16} color="#16a34a" />
                <span>All tuition and library dues are settled for Term II.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
