import React, { useState } from "react";
import { SAMPLE_STUDENT } from "../../components/StudentLayout";
import {
  Filter,
  RotateCcw,
  ClipboardCheck,
  Award,
  Trophy,
  CalendarDays,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export default function StudentTestResults() {
  const s = SAMPLE_STUDENT;
  const [subject, setSubject] = useState("All Subjects");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const testLogs = [
    { id: 1, date: "2026-09-10", subject: "Mathematics", topic: "Calculus & Quadratic Equations", score: 24, total: 25, grade: "A+", pct: 96 },
    { id: 2, date: "2026-09-08", subject: "Science", topic: "Thermodynamics & Electric Circuits", score: 22, total: 25, grade: "A", pct: 88 },
    { id: 3, date: "2026-09-05", subject: "English", topic: "Creative Essay & Vocabulary", score: 25, total: 25, grade: "A+", pct: 100 },
    { id: 4, date: "2026-09-01", subject: "Social Studies", topic: "Medieval Nepali Architecture", score: 20, total: 25, grade: "B+", pct: 80 },
    { id: 5, date: "2026-08-28", subject: "Computer Science", topic: "Data Structures & HTML5", score: 25, total: 25, grade: "A+", pct: 100 },
    { id: 6, date: "2026-08-22", subject: "Mathematics", topic: "Trigonometry & Heights", score: 23, total: 25, grade: "A", pct: 92 },
  ];

  const filteredLogs = testLogs.filter((t) => {
    if (subject !== "All Subjects" && t.subject !== subject) return false;
    return true;
  });

  const totalTests = filteredLogs.length;
  const avgPct = totalTests > 0 ? (filteredLogs.reduce((acc, t) => acc + t.pct, 0) / totalTests).toFixed(1) : 0;

  return (
    <div className="sp-page-wrapper">
      {/* Page Header */}
      <div className="sp-subpage-header">
        <div className="sp-subpage-title-wrap">
          <div className="sp-subpage-icon-badge">
            <ClipboardCheck size={24} />
          </div>
          <div>
            <h1>Class Test & Quiz Results</h1>
            <p>{s.name} • {s.class} (Roll #{s.registrationNo})</p>
          </div>
        </div>
        <div className="sp-profile-pills">
          <span className="sp-pill sp-pill-success">{totalTests} Tests Recorded</span>
          <span className="sp-pill sp-pill-primary">Avg: {avgPct}%</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sp-test-filter-bar">
        <div className="sp-test-filter-group">
          <label>Filter Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="sp-test-select"
          >
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>Science</option>
            <option>English</option>
            <option>Social Studies</option>
            <option>Computer Science</option>
          </select>
        </div>
        <div className="sp-test-filter-group">
          <label>From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="sp-test-input"
          />
        </div>
        <div className="sp-test-filter-group">
          <label>To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="sp-test-input"
          />
        </div>
        <div className="sp-test-filter-actions">
          <button className="sp-test-btn-apply" onClick={() => {}}>
            <Filter size={15} /> Apply Filter
          </button>
          <button className="sp-test-btn-reset" onClick={() => { setSubject("All Subjects"); setFromDate(""); setToDate(""); }}>
            <RotateCcw size={15} /> Reset
          </button>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="sp-test-stats-grid">
        <div className="sp-test-stat-card" style={{ borderLeft: "4px solid #6366f1" }}>
          <div className="sp-test-stat-icon" style={{ background: "#eef2ff", color: "#6366f1" }}>
            <ClipboardCheck size={22} />
          </div>
          <div className="sp-test-stat-info">
            <div className="sp-test-stat-value">{totalTests}</div>
            <div className="sp-test-stat-label">Total Tests Taken</div>
          </div>
        </div>

        <div className="sp-test-stat-card" style={{ borderLeft: "4px solid #10b981" }}>
          <div className="sp-test-stat-icon" style={{ background: "#ecfdf5", color: "#10b981" }}>
            <Award size={22} />
          </div>
          <div className="sp-test-stat-info">
            <div className="sp-test-stat-value">{avgPct}%</div>
            <div className="sp-test-stat-label">Overall Average</div>
          </div>
        </div>

        <div className="sp-test-stat-card" style={{ borderLeft: "4px solid #f59e0b" }}>
          <div className="sp-test-stat-icon" style={{ background: "#fffbeb", color: "#f59e0b" }}>
            <Trophy size={22} />
          </div>
          <div className="sp-test-stat-info">
            <div className="sp-test-stat-value">Computer & English</div>
            <div className="sp-test-stat-label">Top Performance (100%)</div>
          </div>
        </div>

        <div className="sp-test-stat-card" style={{ borderLeft: "4px solid #8b5cf6" }}>
          <div className="sp-test-stat-icon" style={{ background: "#f5f3ff", color: "#8b5cf6" }}>
            <CalendarDays size={22} />
          </div>
          <div className="sp-test-stat-info">
            <div className="sp-test-stat-value">4 Tests</div>
            <div className="sp-test-stat-label">This Month</div>
          </div>
        </div>
      </div>

      {/* Tests Log Table */}
      <div className="sp-report-card">
        <div className="sp-card-header">
          <div className="sp-card-title-group">
            <span className="sp-badge-num">📋</span>
            <h3>Detailed Test Breakdown</h3>
          </div>
        </div>

        <table className="sp-mini-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Topic / Assessment</th>
              <th>Marks Obtained</th>
              <th>Percentage</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((test) => (
              <tr key={test.id}>
                <td style={{ color: "#64748b", fontSize: "0.82rem" }}>
                  <Calendar size={13} style={{ display: "inline", marginRight: "4px" }} />
                  {test.date}
                </td>
                <td style={{ fontWeight: 700, color: "#0f172a" }}>{test.subject}</td>
                <td style={{ color: "#475569" }}>{test.topic}</td>
                <td style={{ fontWeight: 800 }}>{test.score} / {test.total}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.82rem" }}>{test.pct}%</span>
                    <div className="sp-progress-bar-wrap" style={{ width: "80px", margin: 0 }}>
                      <div
                        className="sp-progress-bar-fill"
                        style={{
                          width: `${test.pct}%`,
                          background: test.pct >= 90 ? "#10b981" : test.pct >= 80 ? "#6366f1" : "#f59e0b",
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`sp-grade-badge ${test.grade === "A+" ? "a-plus" : "a"}`}>
                    {test.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
