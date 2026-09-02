import React, { useState, useEffect } from "react";
import { API } from "../../config";
const CLASSES = ["Class 5","Class 6","Class 7","Class 8","Class 9","Class 10"];

export default function TeacherStudents() {
  const email = localStorage.getItem("teacherEmail") || "";
  const [assignedClass, setAssignedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [search, setSearch]     = useState("");
  const [classFilter, setClassFilter] = useState("All Classes");

  useEffect(() => {
    fetch(`${API}/api/teacher/profile/${encodeURIComponent(email)}`).then(r=>r.json()).then(d=>{ if(d.assignedClass) setAssignedClass(d.assignedClass); }).catch(()=>{});
  }, [email]);

  const fetchStudents = async () => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    const cls = classFilter !== "All Classes" ? classFilter : assignedClass;
    if (cls) params.append("class", cls);
    try {
      const res = await fetch(`${API}/api/students?${params}`);
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch { setStudents([]); }
  };

  useEffect(() => { fetchStudents(); }, [search, classFilter, assignedClass]);

  return (
    <div className="admin-page-content">
      <div className="admin-page-header">
        <h1>My Students</h1>
        <p>{students.length} student{students.length !== 1 ? "s" : ""} {assignedClass && `· ${assignedClass}`}</p>
      </div>

      <div className="admin-table-controls">
        <div className="admin-search-bar">
          <i className="ri-search-line" />
          <input type="text" placeholder="Search by name or ID…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="admin-dropdown" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
          <option>All Classes</option>
          {CLASSES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr><th>Student ID</th><th>Name</th><th>Class</th><th>Roll No</th><th>Guardian</th><th>Phone</th></tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan="6" className="admin-table-empty">No students found.</td></tr>
            ) : students.map(s => (
              <tr key={s._id}>
                <td style={{ fontWeight:600, color:"#0284c7" }}>{s.studentId}</td>
                <td style={{ fontWeight:500 }}>{s.name}</td>
                <td>{s.class}</td>
                <td>{s.rollNo}</td>
                <td>{s.guardian || "—"}</td>
                <td>{s.phone || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
