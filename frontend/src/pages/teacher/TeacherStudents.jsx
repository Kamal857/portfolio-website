import React, { useState, useEffect } from "react";
import {
  Search, Eye, GraduationCap, RotateCw, X, User, Phone, ShieldCheck, Hash, BookOpen
} from "lucide-react";
import { API } from "../../config";
import { StudentAvatarSvg } from "../admin/AdminStudents";

const CLASSES = ["Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

export default function TeacherStudents() {
  const email = localStorage.getItem("teacherEmail") || "";
  const [assignedClass, setAssignedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [isRotating, setIsRotating] = useState(false);
  const [viewingStudent, setViewingStudent] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/teacher/profile/${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.assignedClass) {
          setAssignedClass(d.assignedClass);
        }
      })
      .catch(() => {});
  }, [email]);

  const fetchStudents = async () => {
    setIsRotating(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    const cls = classFilter !== "All Classes" && classFilter !== "-- Select a class --" ? classFilter : assignedClass;
    if (cls) params.append("class", cls);
    try {
      const res = await fetch(`${API}/api/students?${params}`);
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch {
      setStudents([]);
    } finally {
      setTimeout(() => setIsRotating(false), 500);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, classFilter, assignedClass]);

  return (
    <div className="admin-page-content">
      {/* 1. Top Breadcrumb Bar */}
      <div className="esk-breadcrumb-card">
        <div className="esk-breadcrumb-left">
          <div className="esk-breadcrumb-icon">
            <GraduationCap size={18} />
          </div>
          <span className="esk-breadcrumb-title">Students</span>
          <span className="esk-breadcrumb-sep">&gt;</span>
          <span className="esk-breadcrumb-sub">
            All Students {assignedClass && `· ${assignedClass}`}
          </span>
        </div>
        <button
          type="button"
          className="esk-reload-btn"
          onClick={fetchStudents}
          title="Reload students list"
        >
          <RotateCw
            size={14}
            style={{
              transition: "transform 0.5s ease",
              transform: isRotating ? "rotate(360deg)" : "none"
            }}
          />
          <span>Reload</span>
        </button>
      </div>

      {/* 2. Filter & Search Card */}
      <div className="esk-filter-card">
        <div className="esk-filter-grid" style={{ gridTemplateColumns: "2fr 1.5fr" }}>
          <div className="esk-filter-group">
            <label className="esk-filter-label">SEARCH STUDENT</label>
            <input
              type="text"
              className="esk-filter-input"
              placeholder="Type student name or reg number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="esk-filter-group">
            <label className="esk-filter-label">FILTER BY CLASS</label>
            <select
              className="esk-filter-select"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            >
              <option value="All Classes">-- Select a class --</option>
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c} {c === assignedClass ? "(Assigned)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Students Grid */}
      {students.length === 0 ? (
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e4e4e7",
            borderRadius: 16,
            padding: "48px 24px",
            textAlign: "center",
            color: "#71717a"
          }}
        >
          <GraduationCap size={44} style={{ margin: "0 auto 12px", color: "#a1a1aa" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#09090b", marginBottom: 6 }}>
            No Students Found
          </h3>
          <p style={{ fontSize: "0.88rem", margin: 0 }}>
            Try adjusting your search query or class filter.
          </p>
        </div>
      ) : (
        <div className="esk-students-grid">
          {students.map((student) => (
            <div key={student._id} className="esk-student-card">
              <div className="esk-student-avatar-wrap">
                <StudentAvatarSvg name={student.name} size={84} />
              </div>

              <h3 className="esk-student-name" title={student.name}>
                {student.name}
              </h3>

              <p className="esk-student-sub">
                {student.rollNo ? (student.rollNo.length <= 2 ? student.rollNo : `Roll ${student.rollNo}`) : "01"}
              </p>

              <span className="esk-student-meta-badge">
                {student.class} {student.studentId && `· ${student.studentId}`}
              </span>

              <div className="esk-student-actions">
                <button
                  type="button"
                  className="esk-action-btn view"
                  onClick={() => setViewingStudent(student)}
                  title="View Student Details"
                  aria-label="View student details"
                  style={{ width: "100%", height: 34, gap: 6, fontSize: "0.82rem", fontWeight: 600 }}
                >
                  <Eye size={15} />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Student Modal */}
      {viewingStudent && (
        <div className="esk-modal-overlay" onClick={() => setViewingStudent(null)}>
          <div className="esk-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="esk-modal-header">
              <h3>Student Details</h3>
              <button
                type="button"
                className="esk-modal-close"
                onClick={() => setViewingStudent(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="esk-modal-body">
              <div className="esk-view-avatar-header">
                <div className="esk-student-avatar-wrap" style={{ width: 96, height: 96, marginBottom: 12 }}>
                  <StudentAvatarSvg name={viewingStudent.name} size={96} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 4px 0", color: "#09090b" }}>
                  {viewingStudent.name}
                </h3>
                <span className="esk-student-meta-badge" style={{ fontSize: "0.8rem", padding: "4px 12px" }}>
                  {viewingStudent.class} · Roll #{viewingStudent.rollNo || "01"}
                </span>
              </div>

              <div className="esk-view-detail-grid">
                <div className="esk-view-detail-item">
                  <div className="esk-view-detail-label">Student ID</div>
                  <div className="esk-view-detail-val">{viewingStudent.studentId || "—"}</div>
                </div>

                <div className="esk-view-detail-item">
                  <div className="esk-view-detail-label">Class</div>
                  <div className="esk-view-detail-val">{viewingStudent.class || "—"}</div>
                </div>

                <div className="esk-view-detail-item">
                  <div className="esk-view-detail-label">Roll Number</div>
                  <div className="esk-view-detail-val">{viewingStudent.rollNo || "—"}</div>
                </div>

                <div className="esk-view-detail-item">
                  <div className="esk-view-detail-label">Guardian / Parent</div>
                  <div className="esk-view-detail-val">{viewingStudent.guardian || "—"}</div>
                </div>

                <div className="esk-view-detail-item" style={{ gridColumn: "1 / -1" }}>
                  <div className="esk-view-detail-label">Contact Phone</div>
                  <div className="esk-view-detail-val">{viewingStudent.phone || "—"}</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                <button
                  type="button"
                  onClick={() => setViewingStudent(null)}
                  className="btn-outline"
                  style={{ padding: "8px 18px", fontSize: "0.85rem" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

