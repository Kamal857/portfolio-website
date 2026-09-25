import React, { useState, useEffect } from "react";
import { Search, Save, CheckCircle, AlertCircle, FileText, Loader2 } from "lucide-react";
import { API } from "../../config";

const CLASSES = ["Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const SUBJECTS = ["Mathematics", "Science", "English", "Nepali", "Social Studies", "Computer", "Optional Math", "Physics", "Chemistry", "Biology", "History", "Geography", "Economics"];
const DURATION_MINS = { "30 Min": 30, "45 Min": 45, "1 Hour": 60, "1.5 Hours": 90, "2 Hours": 120, "3 Hours": 180 };

function calcGrade(pct) {
  if (pct >= 90) return "A+"; if (pct >= 80) return "A"; if (pct >= 70) return "B+";
  if (pct >= 60) return "B"; if (pct >= 50) return "C+"; if (pct >= 40) return "C";
  if (pct >= 32) return "D"; return "F";
}

function computeTestStatus(date, time, duration) {
  if (!date || !time) return "Upcoming";
  try {
    const start = new Date(`${date}T${time}`);
    const end = new Date(start.getTime() + (DURATION_MINS[duration] || 60) * 60000);
    const now = new Date();
    if (now < start) return "Upcoming";
    if (now <= end) return "Ongoing";
    return "Completed";
  } catch { return "Upcoming"; }
}

export default function TeacherResults() {
  const [selectedClass, setSelectedClass] = useState("Class 10");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  
  const [availableTests, setAvailableTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState("");
  const [students, setStudents] = useState([]);
  
  const [marksMatrix, setMarksMatrix] = useState({});
  const [loadingTests, setLoadingTests] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const selectedTest = availableTests.find(t => t._id === selectedTestId);

  // Fetch tests whenever class or subject changes
  useEffect(() => {
    async function fetchTests() {
      setLoadingTests(true);
      try {
        const res = await fetch(`${API}/api/tests?class=${encodeURIComponent(selectedClass)}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          // Filter by subject and ensure they are completed
          const filtered = data.filter(t => 
            (t.subject === selectedSubject || (t.subjects && t.subjects.includes(selectedSubject))) &&
            computeTestStatus(t.date, t.time, t.duration) === "Completed"
          );
          setAvailableTests(filtered);
          setSelectedTestId(filtered.length > 0 ? filtered[0]._id : "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTests(false);
      }
    }
    fetchTests();
  }, [selectedClass, selectedSubject]);

  // Fetch students whenever class changes
  useEffect(() => {
    async function fetchStudents() {
      setLoadingStudents(true);
      try {
        const res = await fetch(`${API}/api/students?class=${encodeURIComponent(selectedClass)}`);
        const data = await res.json();
        setStudents(Array.isArray(data) ? data : []);
        // Reset matrix when students load
        setMarksMatrix({});
        setMsg({ text: "", type: "" });
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStudents(false);
      }
    }
    fetchStudents();
  }, [selectedClass]);

  // Handle matrix input change
  const handleMarkChange = (studentId, val) => {
    setMarksMatrix(prev => ({ ...prev, [studentId]: val }));
    if (msg.text) setMsg({ text: "", type: "" }); // Clear message on new input
  };

  // Validation
  let hasErrors = false;
  const matrixData = students.map(student => {
    const rawVal = marksMatrix[student.studentId];
    const mark = rawVal === "" || rawVal === undefined ? null : Number(rawVal);
    let error = false;
    
    if (mark !== null && selectedTest) {
      if (mark < 0 || mark > selectedTest.totalMarks) {
        error = true;
        hasErrors = true;
      }
    }

    let pct = null, grade = "-", status = "-";
    if (mark !== null && !error && selectedTest && selectedTest.totalMarks > 0) {
      pct = (mark / selectedTest.totalMarks) * 100;
      grade = calcGrade(pct);
      status = pct >= 32 ? "Pass" : "Fail";
    }

    return { ...student, mark, rawVal: rawVal || "", pct, grade, status, error };
  });

  const handleSave = async () => {
    if (!selectedTest) return;
    
    // Only save students that have marks entered and no errors
    const toSave = matrixData.filter(d => d.mark !== null && !d.error);
    
    if (toSave.length === 0) {
      setMsg({ text: "No valid marks to save.", type: "error" });
      return;
    }

    setSaving(true);
    setMsg({ text: "", type: "" });

    try {
      // Execute all saves in parallel
      const promises = toSave.map(data => {
        const payload = {
          studentId: data.studentId,
          name: data.name,
          class: selectedClass,
          exam: selectedTest.title, // use the test title as the exam name
          total: selectedTest.totalMarks,
          percentage: Number(data.pct.toFixed(2)),
          grade: data.grade,
          status: data.status
        };
        return fetch(`${API}/api/results`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      });

      await Promise.all(promises);
      
      setMsg({ text: `Successfully saved ${promises.length} result(s)!`, type: "success" });
      setMarksMatrix({}); // clear inputs after successful save
    } catch (err) {
      setMsg({ text: "Error saving results. Please try again.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e, index, total) => {
    if (['Enter', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      const next = document.getElementById(`mark-input-${index + 1}`);
      if (next) {
        next.focus();
        next.select();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = document.getElementById(`mark-input-${index - 1}`);
      if (prev) {
        prev.focus();
        prev.select();
      }
    }
  };

  return (
    <div className="admin-page-content">
      
      {/* ── Breadcrumb & Save Button ────────────────────────── */}
      <div className="esk-breadcrumb-card" style={{ marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="esk-breadcrumb-left">
          <div className="esk-breadcrumb-icon"><FileText size={18} /></div>
          <span className="esk-breadcrumb-title">Bulk Entry</span>
          <span className="esk-breadcrumb-sep">&gt;</span>
          <span className="esk-breadcrumb-sub">Results</span>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving || hasErrors || !selectedTest || matrixData.every(d => d.mark === null)}
          className="admin-btn-dark"
          style={{
            opacity: (saving || hasErrors || !selectedTest || matrixData.every(d => d.mark === null)) ? 0.5 : 1,
            cursor: (saving || hasErrors || !selectedTest || matrixData.every(d => d.mark === null)) ? 'not-allowed' : 'pointer',
            gap: 8, display: 'flex', alignItems: 'center'
          }}
        >
          {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Results'}
        </button>
      </div>

      {msg.text && (
        <div className={`admin-form-message ${msg.type}`} style={{ marginBottom: 20 }}>
          {msg.text}
        </div>
      )}

      {/* ── Selection Controls ────────────────────────────── */}
      <div className="esk-filter-card" style={{ marginBottom: 24 }}>
        <div className="esk-filter-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          
          <div className="esk-filter-group">
            <label className="esk-filter-label">CLASS</label>
            <select 
              value={selectedClass} 
              onChange={e => setSelectedClass(e.target.value)}
              className="esk-filter-select"
            >
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="esk-filter-group">
            <label className="esk-filter-label">SUBJECT</label>
            <select 
              value={selectedSubject} 
              onChange={e => setSelectedSubject(e.target.value)}
              className="esk-filter-select"
            >
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="esk-filter-group">
            <label className="esk-filter-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              SELECT COMPLETED TEST
              {loadingTests && <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />}
            </label>
            <select 
              value={selectedTestId} 
              onChange={e => setSelectedTestId(e.target.value)}
              disabled={availableTests.length === 0}
              className="esk-filter-select"
            >
              {availableTests.length === 0 
                ? <option value="">No completed tests found</option>
                : availableTests.map(t => <option key={t._id} value={t._id}>{t.title} ({t.date})</option>)
              }
            </select>
          </div>
        </div>

        {selectedTest && (
          <div style={{
            marginTop: 20, paddingTop: 16, borderTop: '1px solid #f4f4f5',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10
          }}>
            <div style={{ display: 'flex', gap: 12, fontSize: '0.85rem', color: '#52525b', fontWeight: 600 }}>
              <span style={{ background: '#f4f4f5', padding: '4px 12px', borderRadius: 8 }}>
                Total Marks: <span style={{ color: '#09090b', fontWeight: 800 }}>{selectedTest.totalMarks}</span>
              </span>
              <span style={{ background: '#f4f4f5', padding: '4px 12px', borderRadius: 8 }}>
                Duration: <span style={{ color: '#09090b', fontWeight: 800 }}>{selectedTest.duration}</span>
              </span>
            </div>
            {hasErrors && (
              <span style={{
                color: '#dc2626', fontSize: '0.8rem', fontWeight: 700,
                background: '#fef2f2', padding: '4px 12px', borderRadius: 8,
                border: '1px solid #fee2e2', display: 'flex', alignItems: 'center', gap: 6
              }}>
                <AlertCircle size={14} /> Please fix highlighted errors
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Matrix Table ──────────────────────────────────── */}
      <div className="admin-table-container">
        {loadingStudents ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#a1a1aa' }}>
            <Loader2 size={30} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
            <p style={{ fontWeight: 600 }}>Loading student list...</p>
          </div>
        ) : !selectedTest ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#a1a1aa' }}>
            <div style={{
              width: 60, height: 60, background: '#f4f4f5', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
            }}>
              <FileText size={24} style={{ color: '#a1a1aa' }} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#09090b', marginBottom: 4 }}>
              No Test Selected
            </h3>
            <p style={{ fontSize: '0.88rem' }}>Please select a completed test to enter marks.</p>
          </div>
        ) : students.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#71717a', fontWeight: 600 }}>
            No students found in {selectedClass}.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 80, textAlign: 'center' }}>Roll No</th>
                <th style={{ width: 120 }}>Student ID</th>
                <th>Student Name</th>
                <th style={{ width: 150, textAlign: 'center' }}>
                  Marks Obtained<br/>
                  <span style={{ fontSize: '0.65rem', fontWeight: 400, textTransform: 'none', color: '#a1a1aa' }}>
                    (out of {selectedTest.totalMarks})
                  </span>
                </th>
                <th style={{ width: 100, textAlign: 'center' }}>Percentage</th>
                <th style={{ width: 100, textAlign: 'center' }}>Grade</th>
                <th style={{ width: 100, textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {matrixData.map((d, i) => (
                <tr key={d._id}>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: '#09090b' }}>
                    {d.rollNo || '-'}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 600, color: '#71717a' }}>
                    {d.studentId}
                  </td>
                  <td style={{ fontWeight: 700, color: '#18181b' }}>
                    {d.name}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      id={`mark-input-${i}`}
                      type="number"
                      min="0"
                      max={selectedTest.totalMarks}
                      value={d.rawVal}
                      onChange={e => handleMarkChange(d.studentId, e.target.value)}
                      onKeyDown={e => handleKeyDown(e, i, matrixData.length)}
                      placeholder="0"
                      className="admin-input"
                      style={{
                        width: '100%', maxWidth: 100, textAlign: 'center', fontWeight: 800,
                        padding: '8px',
                        background: d.error ? '#fef2f2' : '#ffffff',
                        borderColor: d.error ? '#fca5a5' : '#e4e4e7',
                        color: d.error ? '#dc2626' : '#09090b'
                      }}
                      tabIndex={i + 1}
                    />
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 800, color: '#3f3f46' }}>
                    {d.pct !== null ? `${d.pct.toFixed(1)}%` : '-'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {d.mark !== null && !d.error ? (
                      <span style={{
                        display: 'inline-flex', padding: '3px 10px', borderRadius: 6,
                        fontSize: '0.78rem', fontWeight: 800,
                        background: ['A+', 'A'].includes(d.grade) ? '#dcfce7' :
                                    ['B+', 'B'].includes(d.grade) ? '#dbeafe' :
                                    ['C+', 'C'].includes(d.grade) ? '#fef9c3' :
                                    d.grade === 'D' ? '#ffedd5' : '#fee2e2',
                        color: ['A+', 'A'].includes(d.grade) ? '#166534' :
                               ['B+', 'B'].includes(d.grade) ? '#1e40af' :
                               ['C+', 'C'].includes(d.grade) ? '#854d0e' :
                               d.grade === 'D' ? '#9a3412' : '#991b1b',
                      }}>
                        {d.grade}
                      </span>
                    ) : '-'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {d.mark !== null && !d.error ? (
                      <span style={{
                        display: 'inline-flex', padding: '3px 10px', borderRadius: 6,
                        fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em',
                        background: d.status === 'Pass' ? '#16a34a' : '#dc2626',
                        color: '#ffffff'
                      }}>
                        {d.status}
                      </span>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        @keyframes spin { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  );
}
