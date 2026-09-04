import React, { useState, useEffect } from "react";
import { Plus, Search, Trash2, FileX } from "lucide-react";
import { API } from "../../config";

const CLASSES = ["Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const EXAMS   = ["First Term", "Second Term", "Final Exam", "Pre-Board"];

function calcGrade(pct) {
  if (pct >= 90) return "A+"; if (pct >= 80) return "A"; if (pct >= 70) return "B+";
  if (pct >= 60) return "B";  if (pct >= 50) return "C+"; if (pct >= 40) return "C";
  if (pct >= 32) return "D";  return "F";
}

export default function TeacherResults() {
  const [results, setResults] = useState([]);
  const [search, setSearch]   = useState("");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]  = useState({ studentId: "", name: "", class: "Class 5", exam: "First Term", total: "", percentage: "", grade: "A", status: "Pass" });
  const [msg, setMsg]    = useState({ text: "", type: "" });

  const fetch$ = async () => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (classFilter !== "All Classes") params.append("class", classFilter);
    try { const res = await fetch(`${API}/api/results?${params}`); const data = await res.json(); setResults(Array.isArray(data) ? data : []); } catch { setResults([]); }
  };
  useEffect(() => { fetch$(); }, [search, classFilter]);

  const handleChange = e => {
    const { name, value } = e.target; let u = { ...form, [name]: value };
    if (name === "percentage") { const p = parseFloat(value); u.grade = isNaN(p) ? form.grade : calcGrade(p); u.status = isNaN(p) ? form.status : (p >= 32 ? "Pass" : "Fail"); }
    setForm(u);
  };

  const handleAdd = async e => {
    e.preventDefault();
    const res = await fetch(`${API}/api/results`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, total: Number(form.total), percentage: Number(form.percentage) }) });
    const data = await res.json();
    if (res.ok) { setMsg({ text: "Result added!", type: "success" }); setForm({ studentId: "", name: "", class: "Class 5", exam: "First Term", total: "", percentage: "", grade: "A", status: "Pass" }); setShowForm(false); fetch$(); }
    else setMsg({ text: data.message, type: "error" });
  };

  const handleDelete = async id => { if (!confirm("Delete this result?")) return; await fetch(`${API}/api/results/${id}`, { method: "DELETE" }); fetch$(); };

  return (
    <div className="admin-page-content">
      <div className="admin-page-header split">
        <div><h1>Results</h1><p>{results.length} result{results.length !== 1 ? "s" : ""}</p></div>
        <button className="admin-btn-dark" onClick={() => setShowForm(!showForm)}><Plus size={18} /> Add Result</button>
      </div>

      {showForm && (
        <div className="admin-form-card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 14, fontWeight: 700 }}>New Result</h3>
          {msg.text && <div className={`admin-form-message ${msg.type}`}>{msg.text}</div>}
          <form onSubmit={handleAdd} style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
            {[["Student ID", "studentId"], ["Name", "name"], ["Total Marks", "total"], ["Percentage (%)", "percentage"]].map(([label, key]) => (
              <div key={key} style={{ flex: "1 1 140px" }}><label className="admin-label">{label}</label>
                <input type={["total", "percentage"].includes(key) ? "number" : "text"} name={key} className="admin-input" value={form[key]} onChange={handleChange} required />
              </div>
            ))}
            <div style={{ flex: "1 1 120px" }}><label className="admin-label">Class</label><select name="class" className="admin-input" value={form.class} onChange={handleChange}>{CLASSES.map(c => <option key={c}>{c}</option>)}</select></div>
            <div style={{ flex: "1 1 120px" }}><label className="admin-label">Exam</label><select name="exam" className="admin-input" value={form.exam} onChange={handleChange}>{EXAMS.map(e => <option key={e}>{e}</option>)}</select></div>
            <div style={{ flex: "0 1 80px" }}><label className="admin-label">Grade</label><input className="admin-input" value={form.grade} readOnly style={{ background: "#f9f9f9" }} /></div>
            <div style={{ flex: "0 1 80px" }}><label className="admin-label">Status</label><input className="admin-input" value={form.status} readOnly style={{ background: form.status === "Pass" ? "#dcfce7" : "#fee2e2", color: form.status === "Pass" ? "#16a34a" : "#dc2626", fontWeight: 700 }} /></div>
            <button type="submit" className="admin-btn-dark" style={{ height: 42 }}>Save</button>
          </form>
        </div>
      )}

      <div className="admin-table-controls">
        <div className="admin-search-bar"><Search size={18} className="search-icon-svg" /><input type="text" placeholder="Search student, ID, class..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <select className="admin-dropdown" value={classFilter} onChange={e => setClassFilter(e.target.value)}><option>All Classes</option>{CLASSES.map(c => <option key={c}>{c}</option>)}</select>
      </div>

      <div className="results-count-summary">
        Showing {results.length} result{results.length !== 1 ? "s" : ""}
      </div>

      {/* Desktop View Table (> 768px) */}
      <div className="desktop-results-table admin-table-container">
        <table className="admin-table">
          <thead><tr><th>Student ID</th><th>Name</th><th>Class</th><th>Exam</th><th>Total</th><th>%</th><th>Grade</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {results.length === 0 ? (<tr><td colSpan="9" className="admin-table-empty">No results found</td></tr>)
            : results.map(r => (
              <tr key={r._id}>
                <td style={{ fontWeight: 600, color: "#0284c7" }}>{r.studentId}</td>
                <td style={{ fontWeight: 500 }}>{r.name}</td>
                <td>{r.class}</td><td>{r.exam}</td><td>{r.total}</td><td>{r.percentage}%</td>
                <td><span style={{ fontWeight: 700 }}>{r.grade}</span></td>
                <td><span style={{ padding: "3px 10px", borderRadius: 20, fontSize: "0.8rem", fontWeight: 700, background: r.status === "Pass" ? "#dcfce7" : "#fee2e2", color: r.status === "Pass" ? "#16a34a" : "#dc2626" }}>{r.status}</span></td>
                <td><button onClick={() => handleDelete(r._id)} style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}><Trash2 size={15} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View Result Cards (<= 768px) */}
      <div className="mobile-results-cards">
        {results.length === 0 ? (
          <div className="results-empty-card">
            <FileX size={38} className="results-empty-icon" />
            <h3>No results found</h3>
            <p>Try changing your search or class filter.</p>
          </div>
        ) : (
          results.map((r) => (
            <div key={r._id} className="result-card">
              <div className="result-card-header">
                <div className="result-card-user">
                  <h3 className="result-card-name">{r.name}</h3>
                  <span className="result-card-id">ID: {r.studentId}</span>
                </div>
                <div className="result-card-badges">
                  <span className="result-badge-class">{r.class}</span>
                  <span className="result-badge-exam">{r.exam}</span>
                </div>
              </div>

              <div className="result-card-stats">
                <div className="result-stat-item">
                  <span className="result-stat-label">Total Score</span>
                  <span className="result-stat-value">{r.total}</span>
                </div>
                <div className="result-stat-item">
                  <span className="result-stat-label">Percentage</span>
                  <span className="result-stat-value">{r.percentage}%</span>
                </div>
                <div className="result-stat-item">
                  <span className="result-stat-label">Grade</span>
                  <span className="result-stat-grade">{r.grade}</span>
                </div>
                <div className="result-stat-item">
                  <span className="result-stat-label">Status</span>
                  <span className={`result-stat-status ${r.status === "Pass" ? "pass" : "fail"}`}>
                    {r.status}
                  </span>
                </div>
              </div>

              <div className="result-card-actions">
                <button 
                  type="button" 
                  onClick={() => handleDelete(r._id)} 
                  className="result-card-btn-delete"
                  title="Delete Result"
                  aria-label="Delete result"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
