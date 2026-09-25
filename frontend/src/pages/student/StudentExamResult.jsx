import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SAMPLE_STUDENT } from "../../components/StudentLayout";
import { Award, Trophy, BookOpen, Download, Star, CheckCircle, ChevronRight } from "lucide-react";

export default function StudentExamResult() {
  const s = SAMPLE_STUDENT;
  const [term, setTerm] = useState("Term 1");

  const termData = {
    "Term 1": {
      gpa: 3.88,
      percentage: "93.6%",
      rank: "2nd in Class",
      totalMarks: "468 / 500",
      status: "Passed with Distinction",
      breakdown: [
        { subject: "Mathematics", marks: 96, grade: "A+", gp: 4.0, remarks: "Outstanding performance" },
        { subject: "Science", marks: 90, grade: "A+", gp: 4.0, remarks: "Excellent grasp of concepts" },
        { subject: "English", marks: 93, grade: "A+", gp: 4.0, remarks: "Flawless written expression" },
        { subject: "Nepali", marks: 88, grade: "A", gp: 3.6, remarks: "Very good understanding" },
        { subject: "Social Studies", marks: 86, grade: "A", gp: 3.6, remarks: "Strong analytical answers" },
        { subject: "Computer Science", marks: 95, grade: "A+", gp: 4.0, remarks: "Exceptional coding & theory" },
      ],
    },
    "Mid Term": {
      gpa: 3.82,
      percentage: "91.8%",
      rank: "3rd in Class",
      totalMarks: "459 / 500",
      status: "Passed with Distinction",
      breakdown: [
        { subject: "Mathematics", marks: 94, grade: "A+", gp: 4.0, remarks: "Consistent excellence" },
        { subject: "Science", marks: 89, grade: "A", gp: 3.6, remarks: "Well articulated answers" },
        { subject: "English", marks: 91, grade: "A+", gp: 4.0, remarks: "Great vocabulary" },
        { subject: "Nepali", marks: 85, grade: "A", gp: 3.6, remarks: "Good grammar control" },
        { subject: "Social Studies", marks: 88, grade: "A", gp: 3.6, remarks: "Solid essay responses" },
        { subject: "Computer Science", marks: 92, grade: "A+", gp: 4.0, remarks: "Strong practical score" },
      ],
    },
  };

  const currentTerm = termData[term] || termData["Term 1"];

  return (
    <div className="sp-page-wrapper">
      {/* Header */}
      <div className="sp-subpage-header">
        <div className="sp-subpage-title-wrap">
          <div className="sp-subpage-icon-badge">
            <Award size={24} />
          </div>
          <div>
            <h1>Terminal Exam Results</h1>
            <p>{s.name} • Class: {s.class} (Roll #{s.registrationNo})</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["Term 1", "Mid Term"].map((t) => (
            <button
              key={t}
              onClick={() => setTerm(t)}
              style={{
                padding: "7px 16px",
                borderRadius: "6px",
                border: term === t ? "1px solid #09090b" : "1px solid #e4e4e7",
                background: term === t ? "#09090b" : "#ffffff",
                color: term === t ? "#ffffff" : "#52525b",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              {t} Results
            </button>
          ))}
        </div>
      </div>

      {/* Overview Highlight Banner */}
      <div
        style={{
          background: "#09090b",
          border: "1px solid #27272a",
          borderRadius: "14px",
          padding: "24px",
          color: "#ffffff",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <span className="sp-welcome-badge" style={{ marginBottom: "6px" }}>
            <Trophy size={13} color="#facc15" /> {term} Official Results
          </span>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "2px 0", color: "#ffffff" }}>
            {currentTerm.status}
          </h2>
          <p style={{ color: "#a1a1aa", margin: 0, fontSize: "0.85rem" }}>
            Class Standing: <strong style={{ color: "#ffffff" }}>{currentTerm.rank}</strong> • Score: <strong style={{ color: "#ffffff" }}>{currentTerm.totalMarks}</strong> ({currentTerm.percentage})
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.68rem", color: "#a1a1aa", fontWeight: 700, textTransform: "uppercase" }}>
              Aggregate GPA
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#22c55e", lineHeight: 1 }}>
              {currentTerm.gpa}
            </div>
          </div>
          <Link
            to="/student/report-card"
            className="sp-banner-btn primary-light"
          >
            <Download size={14} /> Official Grade Card
          </Link>
        </div>
      </div>

      {/* Subject Breakdown Card */}
      <div className="sp-report-card">
        <div className="sp-card-header">
          <div className="sp-card-title-group">
            <span className="sp-badge-num">📊</span>
            <h3>Subject Performance Breakdown ({term})</h3>
          </div>
        </div>

        <table className="sp-mini-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks</th>
              <th>Grade</th>
              <th>Grade Point</th>
              <th>Teacher Evaluation</th>
            </tr>
          </thead>
          <tbody>
            {currentTerm.breakdown.map((item, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 700, color: "#0f172a" }}>{item.subject}</td>
                <td style={{ fontWeight: 800 }}>{item.marks} / 100</td>
                <td>
                  <span className={`sp-grade-badge ${item.grade === "A+" ? "a-plus" : "a"}`}>
                    {item.grade}
                  </span>
                </td>
                <td style={{ fontWeight: 700 }}>{item.gp.toFixed(1)}</td>
                <td style={{ color: "#475569", fontSize: "0.82rem" }}>{item.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
