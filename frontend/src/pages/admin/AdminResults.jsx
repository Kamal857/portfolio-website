import React, { useState, useEffect, useRef } from 'react';
import {
  Search, ArrowRight, FileText, Printer,
  RotateCw, Users, BarChart2,
  ClipboardCheck, Award, TrendingUp
} from 'lucide-react';
import { API } from '../../config';
import { StudentAvatarSvg } from './AdminStudents';

// ─── Grade helpers ────────────────────────────────────────────
function calcGrade(pct) {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B+';
  if (pct >= 60) return 'B';
  if (pct >= 50) return 'C+';
  if (pct >= 40) return 'C';
  if (pct >= 32) return 'D';
  return 'F';
}

function gradeColor(grade) {
  if (['A+', 'A'].includes(grade)) return { bg: '#dcfce7', color: '#16a34a' };
  if (['B+', 'B'].includes(grade)) return { bg: '#dbeafe', color: '#1d4ed8' };
  if (['C+', 'C'].includes(grade)) return { bg: '#fef9c3', color: '#92400e' };
  if (grade === 'D') return { bg: '#fed7aa', color: '#c2410c' };
  return { bg: '#fee2e2', color: '#dc2626' };
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}



// ─── Main component ───────────────────────────────────────────
const CLASSES = ['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];

export default function AdminResults() {
  // ── State: search phase ──────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  // ── State: report card phase ─────────────────────────────
  const [student, setStudent] = useState(null);          // selected student object
  const [studentResults, setStudentResults] = useState([]); // results for student
  const [attendanceData, setAttendanceData] = useState({ total: 0, present: 0 });
  const [classResults, setClassResults] = useState([]);  // all results in same class+exam
  const [allStudents, setAllStudents] = useState([]);    // students in class (for search suggestions)
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedTest, setSelectedTest] = useState('All Tests');

  // Compute unique tests available for this student
  const uniqueTests = [...new Set(studentResults.map(r => r.exam))].reverse();

  // Reset selectedTest if student changes
  useEffect(() => {
    setSelectedTest('All Tests');
  }, [studentResults]);

  // ── Add result modal ─────────────────────────────────────
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    studentId: '', name: '', class: 'Class 5', exam: 'First Term',
    total: '', percentage: '', grade: 'A', status: 'Pass',
    subjects: []
  });
  const [subjectRow, setSubjectRow] = useState({ subject: '', obtained: '', total: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const reportRef = useRef(null);

  // ── Fetch all students for suggestions ──────────────────
  useEffect(() => {
    fetch(`${API}/api/students`)
      .then(r => r.json())
      .then(d => setAllStudents(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  // ── Suggestion filter ────────────────────────────────────
  useEffect(() => {
    if (!searchQuery.trim()) { setSuggestions([]); setShowSuggestions(false); return; }
    const q = searchQuery.toLowerCase();
    const filtered = allStudents.filter(s =>
      s.name.toLowerCase().includes(q) || s.studentId?.toLowerCase().includes(q)
    ).slice(0, 8);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [searchQuery, allStudents]);

  // ── Fetch report for student ─────────────────────────────
  const loadReport = async (stu) => {
    setSearching(true);
    setShowSuggestions(false);
    setStudent(stu);

    try {
      // Student results
      const [resRes, attRes, classResRes] = await Promise.all([
        fetch(`${API}/api/results/student/${stu.studentId}`),
        fetch(`${API}/api/attendance?studentId=${encodeURIComponent(stu.studentId)}`),
        fetch(`${API}/api/results?class=${encodeURIComponent(stu.class)}`)
      ]);

      const resultsData = await resRes.json();
      const attData = await attRes.json();
      const classResData = await classResRes.json();

      setStudentResults(Array.isArray(resultsData) ? resultsData : []);
      setClassResults(Array.isArray(classResData) ? classResData : []);

      // Compute attendance stats
      if (Array.isArray(attData)) {
        const total = attData.length;
        const present = attData.filter(a => a.status === 'Present').length;
        setAttendanceData({ total, present });
      } else {
        setAttendanceData({ total: 0, present: 0 });
      }
    } catch {
      setStudentResults([]);
      setAttendanceData({ total: 0, present: 0 });
      setClassResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    const found = allStudents.find(s =>
      s.name.toLowerCase().includes(q) || s.studentId?.toLowerCase() === q
    );
    if (found) loadReport(found);
  };

  // ── Derive report card metrics ───────────────────────────
  const examResults = selectedTest === 'All Tests'
    ? studentResults
    : studentResults.filter(r => r.exam === selectedTest);

  const overallPct = examResults.length > 0
    ? Math.round(examResults.reduce((s, r) => s + r.percentage, 0) / examResults.length)
    : 0;
  const overallGrade = calcGrade(overallPct);
  const attPct = attendanceData.total > 0
    ? Math.round((attendanceData.present / attendanceData.total) * 100)
    : 0;

  // Class rank: compare student's avg pct with classmates
  const classStudentAvgs = {};
  const filteredClassResults = selectedTest === 'All Tests'
    ? classResults
    : classResults.filter(r => r.exam === selectedTest);

  filteredClassResults.forEach(r => {
    if (!classStudentAvgs[r.studentId]) classStudentAvgs[r.studentId] = [];
    classStudentAvgs[r.studentId].push(r.percentage);
  });
  const rankedAvgs = Object.values(classStudentAvgs)
    .map(pctsArr => Math.round(pctsArr.reduce((s, p) => s + p, 0) / pctsArr.length))
    .sort((a, b) => b - a);
  const rank = rankedAvgs.indexOf(overallPct) + 1 || 1;
  const classStrength = Object.keys(classStudentAvgs).length || 0;

  const classAvg = classStrength > 0
    ? Math.round(rankedAvgs.reduce((s, v) => s + v, 0) / rankedAvgs.length)
    : 0;
  const maxAvg = rankedAvgs[0] || 0;
  const minAvg = rankedAvgs[rankedAvgs.length - 1] || 0;

  // ── Add Result logic ─────────────────────────────────────
  const openAddModal = () => {
    setForm({
      studentId: student?.studentId || '',
      name: student?.name || '',
      class: student?.class || 'Class 5',
      exam: selectedTest === 'All Tests' ? '' : selectedTest,
      total: '', percentage: '', grade: 'A', status: 'Pass'
    });
    setMsg({ text: '', type: '' });
    setShowAddModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...form, [name]: value };
    if (name === 'percentage') {
      const pct = parseFloat(value);
      updated.grade = isNaN(pct) ? form.grade : calcGrade(pct);
      updated.status = isNaN(pct) ? form.status : (pct >= 32 ? 'Pass' : 'Fail');
    }
    setForm(updated);
  };

  const handleAddResult = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          total: Number(form.total),
          percentage: Number(form.percentage)
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: 'Result added!', type: 'success' });
        setTimeout(() => {
          setShowAddModal(false);
          if (student) loadReport(student);
        }, 600);
      } else {
        setMsg({ text: data.message || 'Error adding result', type: 'error' });
      }
    } catch {
      setMsg({ text: 'Network error', type: 'error' });
    }
  };

  const handleDeleteResult = async (id) => {
    if (!window.confirm('Delete this result?')) return;
    await fetch(`${API}/api/results/${id}`, { method: 'DELETE' });
    if (student) loadReport(student);
  };

  const handlePrint = () => { window.print(); };

  // ─────────────────────────────────────────────────────────
  //  RENDER: Search / Landing screen
  // ─────────────────────────────────────────────────────────
  if (!student) {
    return (
      <div className="admin-page-content">
        {/* Breadcrumb */}
        <div className="esk-breadcrumb-card">
          <div className="esk-breadcrumb-left">
            <div className="esk-breadcrumb-icon"><FileText size={18} /></div>
            <span className="esk-breadcrumb-title">Reports</span>
            <span className="esk-breadcrumb-sep">&gt;</span>
            <span className="esk-breadcrumb-sub">Report Card</span>
          </div>
        </div>

        {/* Centered search card */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: 'calc(100vh - 200px)'
        }}>
          <div style={{
            background: '#ffffff', border: '1px solid #e4e4e7',
            borderRadius: 20, padding: '48px 40px',
            maxWidth: 520, width: '100%',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            {/* Icon */}
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: '#f4f4f5', border: '1px solid #e4e4e7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <Search size={30} style={{ color: '#09090b' }} />
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#09090b', marginBottom: 8 }}>
              Find Student Report Card
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#71717a', marginBottom: 28, lineHeight: 1.6 }}>
              Type the student name or registration number to generate the report card.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} style={{ position: 'relative' }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="text"
                  className="esk-filter-input"
                  placeholder="Search student..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  style={{ flex: 1, fontSize: '0.95rem', padding: '12px 16px' }}
                  autoFocus
                />
                <button
                  type="submit"
                  className="admin-btn-dark"
                  style={{ width: 48, height: 48, padding: 0, borderRadius: 12, flexShrink: 0 }}
                >
                  <ArrowRight size={20} />
                </button>
              </div>

              {/* Suggestions dropdown */}
              {showSuggestions && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 58,
                  background: '#ffffff', border: '1px solid #e4e4e7',
                  borderRadius: 10, marginTop: 6, zIndex: 100,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)', overflow: 'hidden'
                }}>
                  {suggestions.map(s => (
                    <button
                      key={s._id}
                      type="button"
                      onClick={() => { setSearchQuery(s.name); loadReport(s); }}
                      style={{
                        width: '100%', background: 'none', border: 'none',
                        padding: '10px 16px', textAlign: 'left', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 12,
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: '#f4f4f5', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0, overflow: 'hidden'
                      }}>
                        <StudentAvatarSvg name={s.name} size={32} />
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#09090b' }}>
                          {s.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#71717a' }}>
                          {s.class} · ID: {s.studentId}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </form>

            {searching && (
              <div style={{ marginTop: 20, color: '#71717a', fontSize: '0.88rem' }}>
                <RotateCw size={14} style={{ animation: 'spin 1s linear infinite', marginRight: 6 }} />
                Loading report card...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  //  RENDER: Report Card view
  // ─────────────────────────────────────────────────────────
  const gradeStyle = gradeColor(overallGrade);

  return (
    <div className="admin-page-content" ref={reportRef}>

      {/* ── Breadcrumb + Actions ─────────────────────────── */}
      <div className="esk-breadcrumb-card" style={{ marginBottom: 20 }}>
        <div className="esk-breadcrumb-left">
          <div className="esk-breadcrumb-icon"><FileText size={18} /></div>
          <span className="esk-breadcrumb-title">Reports</span>
          <span className="esk-breadcrumb-sep">&gt;</span>
          <span className="esk-breadcrumb-sub">Student Report Card</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            type="button"
            className="esk-reload-btn"
            onClick={() => { setStudent(null); setSearchQuery(''); }}
          >
            <Search size={14} /> New Search
          </button>
          <button
            type="button"
            className="admin-btn-dark"
            style={{ padding: '8px 16px', gap: 7 }}
            onClick={handlePrint}
          >
            <Printer size={15} /> Print
          </button>
          <button
            type="button"
            className="btn-outline"
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={openAddModal}
          >
            <FileText size={14} /> + Add Result
          </button>
        </div>
      </div>

      {/* ── Test selector ───────────────────────────────── */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap'
      }}>
        <select
          value={selectedTest}
          onChange={(e) => setSelectedTest(e.target.value)}
          style={{
            padding: '8px 14px', borderRadius: 8, border: '1px solid #e4e4e7',
            background: '#ffffff', fontWeight: 600, fontSize: '0.88rem',
            outline: 'none', cursor: 'pointer', minWidth: 200, color: '#09090b',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          <option value="All Tests">All Tests (Aggregate)</option>
          {uniqueTests.map(testName => (
            <option key={testName} value={testName}>{testName}</option>
          ))}
        </select>
      </div>

      {/* ── Student Identity Card ────────────────────────── */}
      <div style={{
        background: '#ffffff', border: '1px solid #e4e4e7',
        borderRadius: 14, padding: '20px 24px',
        display: 'flex', alignItems: 'center', gap: 20,
        marginBottom: 20, flexWrap: 'wrap',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        {/* Avatar */}
        <div style={{
          width: 68, height: 68, borderRadius: '50%',
          background: '#f4f4f5', border: '3px solid #e4e4e7',
          overflow: 'hidden', flexShrink: 0
        }}>
          <StudentAvatarSvg name={student.name} size={68} />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 180 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#09090b', margin: '0 0 4px' }}>
            {student.name}
          </h2>
          <div style={{ fontSize: '0.85rem', color: '#52525b', fontWeight: 500 }}>
            Reg: <b>{student.studentId || '—'}</b>
            &nbsp;·&nbsp;
            Class: <b>{student.class}</b>
            {student.rollNo && <> &nbsp;·&nbsp; Roll: <b>{student.rollNo}</b></>}
          </div>
        </div>

        {/* Quick badges */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{
            padding: '5px 12px', borderRadius: 8,
            background: '#f4f4f5', border: '1px solid #e4e4e7',
            fontSize: '0.78rem', fontWeight: 600, color: '#09090b',
            display: 'flex', alignItems: 'center', gap: 5
          }}>
            <ClipboardCheck size={13} />
            {attPct}% ATTENDANCE
          </span>
          <span style={{
            padding: '5px 12px', borderRadius: 8,
            background: gradeStyle.bg, border: `1px solid ${gradeStyle.color}30`,
            fontSize: '0.78rem', fontWeight: 700, color: gradeStyle.color,
            display: 'flex', alignItems: 'center', gap: 5
          }}>
            <Award size={13} /> Grade {overallGrade}
          </span>
        </div>
      </div>

      {/* ── 4 KPI stat cards ─────────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16, marginBottom: 24
      }}>
        {[
          {
            icon: <ClipboardCheck size={24} style={{ color: '#0ea5e9' }} />,
            iconBg: '#e0f2fe', value: `${attPct}%`, label: 'Attendance'
          },
          {
            icon: <TrendingUp size={24} style={{ color: '#8b5cf6' }} />,
            iconBg: '#ede9fe', value: `${overallPct}%`, label: 'Overall Score'
          },
          {
            icon: <Award size={24} style={{ color: '#f59e0b' }} />,
            iconBg: '#fef9c3', value: overallGrade, label: 'Grade'
          },
          {
            icon: <BarChart2 size={24} style={{ color: '#0ea5e9' }} />,
            iconBg: '#e0f2fe', value: classStrength > 0 ? ordinal(rank) : '—',
            label: `out of ${classStrength}`
          }
        ].map(({ icon, iconBg, value, label }, i) => (
          <div key={i} style={{
            background: '#ffffff', border: '1px solid #e4e4e7',
            borderRadius: 14, padding: '20px',
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{
              width: 50, height: 50, borderRadius: 12,
              background: iconBg, display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {icon}
            </div>
            <div>
              <div style={{ fontSize: '1.55rem', fontWeight: 800, color: '#09090b', lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#71717a', fontWeight: 600, marginTop: 4 }}>
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Cognitive Domain – Examination ───────────────── */}
      <div style={{
        background: '#ffffff', border: '1px solid #e4e4e7',
        borderRadius: 14, marginBottom: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)', overflow: 'hidden'
      }}>
        <div style={{
          padding: '16px 24px', borderBottom: '1px solid #e4e4e7',
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <ClipboardCheck size={18} style={{ color: '#0ea5e9' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#09090b', margin: 0 }}>
            Test Performance History
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['TEST NAME', 'OBTAINED', 'TOTAL', '%', 'GRADE', 'STATUS'].map(h => (
                  <th key={h} style={{
                    padding: '12px 20px', textAlign: 'left',
                    fontSize: '0.72rem', fontWeight: 700,
                    color: '#64748b', letterSpacing: '0.04em'
                  }}>{h}</th>
                ))}
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {examResults.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#a1a1aa', fontSize: '0.88rem' }}>
                    No test results found for {selectedTest}.
                    <br />
                    <button
                      type="button"
                      className="admin-btn-dark"
                      style={{ marginTop: 12, padding: '7px 16px', fontSize: '0.82rem' }}
                      onClick={openAddModal}
                    >
                      + Add Result
                    </button>
                  </td>
                </tr>
              ) : (
                <>
                  {examResults.map(r => {
                    const gs = gradeColor(r.grade);
                    return (
                      <tr key={r._id} style={{ borderTop: '1px solid #f4f4f5' }}>
                        <td style={{ padding: '14px 20px', fontWeight: 600, color: '#09090b' }}>
                          {r.exam}
                        </td>
                        <td style={{ padding: '14px 20px', color: '#18181b' }}>
                          {r.percentage ? Math.round((r.percentage / 100) * r.total) : '—'}
                        </td>
                        <td style={{ padding: '14px 20px', color: '#18181b' }}>{r.total}</td>
                        <td style={{ padding: '14px 20px', fontWeight: 600 }}>{r.percentage}%</td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            display: 'inline-block', padding: '3px 10px',
                            borderRadius: 6, fontWeight: 700, fontSize: '0.82rem',
                            background: gs.bg, color: gs.color
                          }}>
                            {r.grade}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            display: 'inline-block', padding: '3px 10px',
                            borderRadius: 6, fontWeight: 700, fontSize: '0.82rem',
                            background: r.status === 'Pass' ? '#dcfce7' : '#fee2e2',
                            color: r.status === 'Pass' ? '#16a34a' : '#dc2626'
                          }}>
                            {r.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <button
                            type="button"
                            className="esk-action-btn delete"
                            style={{ width: 30, height: 30 }}
                            onClick={() => handleDeleteResult(r._id)}
                            title="Delete result"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Overall row */}
                  <tr style={{ borderTop: '2px solid #e4e4e7', background: '#fafafa' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: '#09090b' }}>
                      Overall Performance
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: 700 }}>—</td>
                    <td style={{ padding: '14px 20px', fontWeight: 700 }}>—</td>
                    <td style={{ padding: '14px 20px', fontWeight: 700 }}>{overallPct}%</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px',
                        borderRadius: 6, fontWeight: 700, fontSize: '0.82rem',
                        background: gradeStyle.bg, color: gradeStyle.color
                      }}>
                        {overallGrade}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px',
                        borderRadius: 6, fontWeight: 700, fontSize: '0.82rem',
                        background: overallPct >= 32 ? '#dcfce7' : '#fee2e2',
                        color: overallPct >= 32 ? '#16a34a' : '#dc2626'
                      }}>
                        {overallPct >= 32 ? 'PASS' : 'FAIL'}
                      </span>
                    </td>
                    <td />
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Comparison with Class ─────────────────────────── */}
      <div style={{
        background: '#ffffff', border: '1px solid #e4e4e7',
        borderRadius: 14, marginBottom: 20, overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{
          padding: '16px 24px', borderBottom: '1px solid #e4e4e7',
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <TrendingUp size={18} style={{ color: '#8b5cf6' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#09090b', margin: 0 }}>
            Comparison with Class
          </h3>
        </div>
        <div style={{
          padding: '20px 24px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: 14
        }}>
          {[
            { label: 'Class Strength', value: classStrength, icon: <Users size={20} style={{ color: '#6366f1' }} />, iconBg: '#ede9fe' },
            { label: 'Class Average', value: `${classAvg}%`, icon: <BarChart2 size={20} style={{ color: '#0ea5e9' }} />, iconBg: '#e0f2fe' },
            { label: 'Max Average', value: `${maxAvg}%`, icon: <TrendingUp size={20} style={{ color: '#f59e0b' }} />, iconBg: '#fef9c3' },
            { label: 'Min Average', value: `${minAvg}%`, icon: <TrendingUp size={20} style={{ color: '#f43f5e', transform: 'rotate(180deg)' }} />, iconBg: '#ffe4e6' },
            { label: `Rank`, value: classStrength > 0 ? ordinal(rank) : '—', sub: `out of ${classStrength}`, icon: <Award size={20} style={{ color: '#0ea5e9' }} />, iconBg: '#e0f2fe' },
          ].map(({ label, value, sub, icon, iconBg }, i) => (
            <div key={i} style={{
              background: '#f8fafc', border: '1px solid #e2e8f0',
              borderRadius: 12, padding: '16px',
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: iconBg, display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {icon}
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#09090b' }}>
                  {value}
                </div>
                {sub && <div style={{ fontSize: '0.72rem', color: '#71717a', fontWeight: 600 }}>{sub}</div>}
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginTop: sub ? 0 : 2 }}>
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Performance Trend Graph ────────────────────── */}
      {(() => {
        // Build data: take the last 15 tests chronologically for the graph
        const testsForGraph = uniqueTests.slice(-15);
        const examData = testsForGraph.map(testName => {
          const resultsForTest = studentResults.filter(r => r.exam === testName);
          const avg = resultsForTest.length > 0
            ? Math.round(resultsForTest.reduce((s, r) => s + r.percentage, 0) / resultsForTest.length)
            : null;
          return { exam: testName, avg };
        });
        const hasAnyData = examData.some(d => d.avg !== null);

        // SVG dimensions
        const svgW = 700, svgH = 320;
        const padL = 52, padR = 32, padT = 30, padB = 56;
        const chartW = svgW - padL - padR;
        const chartH = svgH - padT - padB;
        const maxVal = 100;
        const barWidth = 52;
        const barGap = examData.length > 0 ? chartW / examData.length : chartW;

        const barColors = ['#6366f1', '#0ea5e9', '#f59e0b', '#10b981'];

        const toX = (i) => padL + barGap * i + barGap / 2;
        const toY = (v) => padT + chartH - (v / maxVal) * chartH;

        // Build SVG line path
        const linePoints = examData
          .map((d, i) => d.avg !== null ? { x: toX(i), y: toY(d.avg) } : null)
          .filter(Boolean);
        const linePath = linePoints.length > 1
          ? linePoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
          : '';

        return (
          <div style={{
            background: '#ffffff', border: '1px solid #e4e4e7',
            borderRadius: 14, marginBottom: 20, overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{
              padding: '16px 24px', borderBottom: '1px solid #e4e4e7',
              display: 'flex', alignItems: 'center', gap: 10
            }}>
              <TrendingUp size={18} style={{ color: '#6366f1' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#09090b', margin: 0 }}>
                Performance Trend — Previous Tests
              </h3>
            </div>

            {!hasAnyData ? (
              <div style={{ padding: '48px 24px', textAlign: 'center', color: '#a1a1aa' }}>
                <BarChart2 size={40} style={{ margin: '0 auto 12px', color: '#d4d4d8' }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No exam data available yet.</p>
                <p style={{ fontSize: '0.82rem' }}>Add results across exams to see the trend graph.</p>
              </div>
            ) : (
              <div style={{ padding: '20px 24px', overflowX: 'auto' }}>
                <svg
                  viewBox={`0 0 ${svgW} ${svgH}`}
                  width="100%"
                  style={{ maxWidth: svgW, display: 'block', margin: '0 auto' }}
                >
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.01" />
                    </linearGradient>
                    {barColors.map((c, i) => (
                      <linearGradient key={i} id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={c} stopOpacity="0.9" />
                        <stop offset="100%" stopColor={c} stopOpacity="0.55" />
                      </linearGradient>
                    ))}
                  </defs>

                  {/* Horizontal grid lines + Y labels */}
                  {[0, 20, 40, 60, 80, 100].map(v => (
                    <g key={v}>
                      <line
                        x1={padL} y1={toY(v)} x2={svgW - padR} y2={toY(v)}
                        stroke="#e4e4e7" strokeWidth="1" strokeDasharray={v === 0 ? 'none' : '4 3'}
                      />
                      <text
                        x={padL - 10} y={toY(v) + 4}
                        textAnchor="end" fontSize="11" fontWeight="600" fill="#94a3b8"
                      >
                        {v}%
                      </text>
                    </g>
                  ))}

                  {/* Pass threshold line at 32% */}
                  <line
                    x1={padL} y1={toY(32)} x2={svgW - padR} y2={toY(32)}
                    stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="6 4" opacity="0.6"
                  />
                  <text
                    x={svgW - padR + 4} y={toY(32) + 4}
                    fontSize="9" fontWeight="700" fill="#f43f5e"
                  >
                    PASS
                  </text>

                  {/* Bars */}
                  {examData.map((d, i) => {
                    if (d.avg === null) return null;
                    const bx = toX(i) - barWidth / 2;
                    const by = toY(d.avg);
                    const bh = chartH - (toY(d.avg) - padT);
                    return (
                      <g key={`bar-${i}`}>
                        <rect
                          x={bx} y={by} width={barWidth} height={bh}
                          rx={6} ry={6}
                          fill={`url(#barGrad${i % barColors.length})`}
                          style={{
                            animation: `barGrow 0.6s ease ${i * 0.12}s both`
                          }}
                        />
                        {/* Value label on bar */}
                        <text
                          x={toX(i)} y={by - 8}
                          textAnchor="middle" fontSize="12" fontWeight="800" fill="#09090b"
                        >
                          {d.avg}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Area fill under line */}
                  {linePoints.length > 1 && (
                    <path
                      d={`${linePath} L${linePoints[linePoints.length - 1].x},${padT + chartH} L${linePoints[0].x},${padT + chartH} Z`}
                      fill="url(#areaGrad)"
                    />
                  )}

                  {/* Line */}
                  {linePath && (
                    <path
                      d={linePath}
                      fill="none" stroke="url(#lineGrad)" strokeWidth="3"
                      strokeLinecap="round" strokeLinejoin="round"
                    />
                  )}

                  {/* Dots on line */}
                  {linePoints.map((p, i) => (
                    <g key={`dot-${i}`}>
                      <circle cx={p.x} cy={p.y} r={7} fill="#ffffff" stroke="#6366f1" strokeWidth="2.5" />
                      <circle cx={p.x} cy={p.y} r={3.5} fill="#6366f1" />
                    </g>
                  ))}

                  {/* X-axis labels */}
                  {examData.map((d, i) => (
                    <text
                      key={`xlabel-${i}`}
                      x={toX(i)} y={svgH - 12}
                      textAnchor="middle" fontSize="11" fontWeight="700"
                      fill={d.avg !== null ? '#09090b' : '#a1a1aa'}
                    >
                      {d.exam.length > 12 ? d.exam.substring(0, 10) + '..' : d.exam}
                    </text>
                  ))}
                </svg>

                {/* Legend */}
                <div style={{
                  display: 'flex', justifyContent: 'center', gap: 18, marginTop: 14,
                  flexWrap: 'wrap'
                }}>
                  {examData.filter(d => d.avg !== null).map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#52525b', fontWeight: 600 }}>
                      <span style={{
                        width: 10, height: 10, borderRadius: 3,
                        background: barColors[i % barColors.length], display: 'inline-block'
                      }} />
                      {d.exam}: {d.avg}%
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#f43f5e', fontWeight: 600 }}>
                    <span style={{ width: 16, height: 2, background: '#f43f5e', display: 'inline-block', borderRadius: 1 }} />
                    Pass Threshold (32%)
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ── Add Result Modal ──────────────────────────────── */}
      {showAddModal && (
        <div className="esk-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div
            className="esk-modal-container"
            style={{ maxWidth: 520 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="esk-modal-header">
              <h3>Add Exam Result</h3>
              <button type="button" className="esk-modal-close" onClick={() => setShowAddModal(false)}>
                ✕
              </button>
            </div>
            <div className="esk-modal-body">
              {msg.text && (
                <div className={`admin-form-message ${msg.type}`} style={{ marginBottom: 14 }}>
                  {msg.text}
                </div>
              )}
              <form onSubmit={handleAddResult} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="admin-label">Student ID *</label>
                    <input type="text" name="studentId" className="admin-input"
                      value={form.studentId} onChange={handleFormChange} required />
                  </div>
                  <div>
                    <label className="admin-label">Student Name *</label>
                    <input type="text" name="name" className="admin-input"
                      value={form.name} onChange={handleFormChange} required />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="admin-label">Class *</label>
                    <select name="class" className="admin-input" value={form.class} onChange={handleFormChange}>
                      {CLASSES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="admin-label">Exam *</label>
                    <select name="exam" className="admin-input" value={form.exam} onChange={handleFormChange}>
                      {EXAMS.map(e => <option key={e}>{e}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="admin-label">Total Marks *</label>
                    <input type="number" name="total" className="admin-input"
                      value={form.total} onChange={handleFormChange} min={0} required />
                  </div>
                  <div>
                    <label className="admin-label">Percentage (%) *</label>
                    <input type="number" name="percentage" className="admin-input"
                      value={form.percentage} onChange={handleFormChange} min={0} max={100} required />
                  </div>
                  <div>
                    <label className="admin-label">Grade (auto)</label>
                    <input className="admin-input" value={form.grade} readOnly
                      style={{ background: gradeColor(form.grade).bg, color: gradeColor(form.grade).color, fontWeight: 700 }} />
                  </div>
                </div>
                <div>
                  <label className="admin-label">Status (auto)</label>
                  <input className="admin-input" value={form.status} readOnly
                    style={{
                      background: form.status === 'Pass' ? '#dcfce7' : '#fee2e2',
                      color: form.status === 'Pass' ? '#16a34a' : '#dc2626', fontWeight: 700
                    }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
                  <button type="button" className="btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="admin-btn-dark">Save Result</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .admin-sidebar, .admin-header, .esk-breadcrumb-card button,
          .esk-action-btn, .btn-outline { display: none !important; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes barGrow {
          from { transform: scaleY(0); transform-origin: bottom; }
          to { transform: scaleY(1); transform-origin: bottom; }
        }
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: 'repeat(4, 1fr)'"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
