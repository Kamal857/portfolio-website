import React from "react";
import { SAMPLE_STUDENT } from "../../components/StudentLayout";
import { FileText, Printer, Download, Award, CheckCircle2, Star } from "lucide-react";

export default function StudentReportCard() {
  const s = SAMPLE_STUDENT;

  const subjects = [
    { code: "MTH-101", name: "Compulsory Mathematics", fullMarks: 100, passMarks: 40, theory: 72, practical: 24, total: 96, grade: "A+", gp: 4.0 },
    { code: "SCI-102", name: "General Science & Technology", fullMarks: 100, passMarks: 40, theory: 65, practical: 25, total: 90, grade: "A+", gp: 4.0 },
    { code: "ENG-103", name: "English (Compulsory)", fullMarks: 100, passMarks: 40, theory: 70, practical: 23, total: 93, grade: "A+", gp: 4.0 },
    { code: "NEP-104", name: "Nepali Language & Lit.", fullMarks: 100, passMarks: 40, theory: 68, practical: 20, total: 88, grade: "A", gp: 3.6 },
    { code: "SOC-105", name: "Social Studies & Moral Edu.", fullMarks: 100, passMarks: 40, theory: 64, practical: 22, total: 86, grade: "A", gp: 3.6 },
    { code: "COM-106", name: "Computer Science & IT", fullMarks: 100, passMarks: 40, theory: 48, practical: 47, total: 95, grade: "A+", gp: 4.0 },
  ];

  const totalFull = subjects.reduce((a, b) => a + b.fullMarks, 0);
  const totalObtained = subjects.reduce((a, b) => a + b.total, 0);
  const percentage = ((totalObtained / totalFull) * 100).toFixed(1);
  const gpa = (subjects.reduce((a, b) => a + b.gp, 0) / subjects.length).toFixed(2);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="sp-page-wrapper">
      {/* Header Actions */}
      <div className="sp-subpage-header">
        <div className="sp-subpage-title-wrap">
          <div className="sp-subpage-icon-badge">
            <FileText size={24} />
          </div>
          <div>
            <h1>Academic Report Card</h1>
            <p>Official Grade Sheet • First Terminal Examination 2026</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handlePrint}
            className="btn btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px" }}
          >
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Printable Sheet Frame */}
      <div className="sp-report-card-paper">
        {/* School Banner Header */}
        <div className="sp-report-school-header">
          <h2>AIMER'S ACADEMY</h2>
          <p>Affiliated to National Examination Board • Kathmandu, Nepal</p>
          <div className="sp-report-subtag">
            ACADEMIC PROGRESS REPORT • SESSION 2025/2026
          </div>
        </div>

        {/* Student Particulars */}
        <div className="sp-student-particulars-grid">
          <div className="sp-particular-item">
            <strong>Student Name:</strong>
            <span>{s.name}</span>
          </div>
          <div className="sp-particular-item">
            <strong>Roll No:</strong>
            <span>{s.registrationNo}</span>
          </div>
          <div className="sp-particular-item">
            <strong>Class & Sec:</strong>
            <span>{s.class} (Sec A)</span>
          </div>
          <div className="sp-particular-item">
            <strong>Date of Birth:</strong>
            <span>{s.dateOfBirth}</span>
          </div>
          <div className="sp-particular-item">
            <strong>Father Name:</strong>
            <span>{s.fatherName}</span>
          </div>
          <div className="sp-particular-item">
            <strong>Mother Name:</strong>
            <span>{s.motherName}</span>
          </div>
        </div>

        {/* Marksheet Table */}
        <table className="sp-mini-table" style={{ marginBottom: "24px" }}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Subject Name</th>
              <th>Full</th>
              <th>Theory</th>
              <th>Practical</th>
              <th>Total</th>
              <th>Grade</th>
              <th>GP</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((sub, idx) => (
              <tr key={idx}>
                <td style={{ color: "#64748b", fontFamily: "monospace", fontSize: "0.8rem" }}>{sub.code}</td>
                <td style={{ fontWeight: 700 }}>{sub.name}</td>
                <td>{sub.fullMarks}</td>
                <td>{sub.theory}</td>
                <td>{sub.practical}</td>
                <td style={{ fontWeight: 800, color: "#0f172a" }}>{sub.total}</td>
                <td>
                  <span className={`sp-grade-badge ${sub.grade === "A+" ? "a-plus" : "a"}`}>
                    {sub.grade}
                  </span>
                </td>
                <td style={{ fontWeight: 700 }}>{sub.gp.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Results Summary Box */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
            background: "#fafafa",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #e4e4e7",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "0.7rem", color: "#71717a", fontWeight: 700, textTransform: "uppercase" }}>
              Total Marks
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#09090b" }}>
              {totalObtained} / {totalFull}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", color: "#71717a", fontWeight: 700, textTransform: "uppercase" }}>
              Percentage
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#09090b" }}>
              {percentage}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", color: "#71717a", fontWeight: 700, textTransform: "uppercase" }}>
              Grade Point Avg (GPA)
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#16a34a" }}>
              {gpa} (A+)
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", color: "#71717a", fontWeight: 700, textTransform: "uppercase" }}>
              Class Rank
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#09090b" }}>
              2nd Position
            </div>
          </div>
        </div>

        {/* Teacher Remarks Box */}
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <Star size={16} color="#16a34a" fill="#16a34a" />
            <strong style={{ fontSize: "0.88rem", color: "#14532d" }}>Class Teacher's Remarks:</strong>
          </div>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#15803d", lineHeight: 1.5 }}>
            "{s.name} demonstrates exceptional academic aptitude, analytical thinking, and classroom participation. Highly disciplined and consistently produces top-tier work across all subjects. Keep up the brilliant effort!"
          </p>
        </div>

        {/* Signatures Row */}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "40px", borderTop: "1px dashed #cbd5e1" }}>
          <div style={{ textAlign: "center", minWidth: "140px" }}>
            <div style={{ borderBottom: "1px solid #94a3b8", height: "30px", marginBottom: "6px" }}></div>
            <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>Class Teacher</span>
          </div>
          <div style={{ textAlign: "center", minWidth: "140px" }}>
            <div style={{ borderBottom: "1px solid #94a3b8", height: "30px", marginBottom: "6px" }}></div>
            <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>Principal / Headmaster</span>
          </div>
          <div style={{ textAlign: "center", minWidth: "140px" }}>
            <div style={{ borderBottom: "1px solid #94a3b8", height: "30px", marginBottom: "6px" }}></div>
            <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>Official Seal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
