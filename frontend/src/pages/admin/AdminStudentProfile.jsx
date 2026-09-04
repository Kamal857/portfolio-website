import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, UserRound, GraduationCap, Phone, Mail,
  ClipboardCheck, FileCheck2, School, CalendarDays,
  RefreshCw, AlertCircle, Users
} from 'lucide-react';
import { API } from '../../config';

const TABS = ['Overview', 'Results', 'Attendance'];

function Avatar({ name, size = 72 }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  return (
    <div className="profile-avatar" style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {initials}
    </div>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="profile-stat-card">
      <div className="profile-stat-icon" style={{ background: accent + '18', color: accent }}>
        {icon}
      </div>
      <div>
        <div className="profile-stat-value">{value}</div>
        <div className="profile-stat-label">{label}</div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="profile-info-row">
      <span className="profile-info-label">{label}</span>
      <span className="profile-info-value">{value}</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="profile-skeleton-wrap">
      <div className="profile-skeleton-header">
        <div className="skel skel-circle" />
        <div>
          <div className="skel skel-line w200" />
          <div className="skel skel-line w120" style={{ marginTop: 8 }} />
          <div className="skel skel-line w160" style={{ marginTop: 8 }} />
        </div>
      </div>
      <div className="profile-skeleton-body">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="skel skel-card" />
        ))}
      </div>
      <div className="skel skel-block" style={{ marginTop: 20 }} />
    </div>
  );
}

export default function AdminStudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('Overview');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const sRes = await fetch(`${API}/api/students/${id}`);
      if (!sRes.ok) {
        const d = await sRes.json();
        setError(d.message || 'Student not found');
        setLoading(false);
        return;
      }
      const sData = await sRes.json();
      setStudent(sData);

      // Load results and attendance in parallel
      const [rRes, aRes] = await Promise.all([
        fetch(`${API}/api/results/student/${sData.studentId}`),
        fetch(`${API}/api/attendance/student/${sData.studentId}`),
      ]);
      const rData = rRes.ok ? await rRes.json() : [];
      const aData = aRes.ok ? await aRes.json() : [];
      setResults(Array.isArray(rData) ? rData : []);
      setAttendance(Array.isArray(aData) ? aData : []);
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  // Attendance stats
  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const absentCount = attendance.filter(a => a.status === 'Absent').length;
  const totalDays = attendance.length;
  const attendancePct = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : null;

  // Results stats
  const avgPct = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)
    : null;

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) return (
    <div className="admin-page-content">
      <button className="profile-back-btn" onClick={() => navigate('/admin/students')}>
        <ArrowLeft size={18} /> Back to Students
      </button>
      <Skeleton />
    </div>
  );

  if (error) return (
    <div className="admin-page-content">
      <button className="profile-back-btn" onClick={() => navigate('/admin/students')}>
        <ArrowLeft size={18} /> Back to Students
      </button>
      <div className="profile-error-card">
        <AlertCircle size={36} className="profile-error-icon" />
        <h3>{error.toLowerCase().includes('not found') ? 'Student Not Found' : 'Unable to Load Profile'}</h3>
        <p>{error}</p>
        <div className="profile-error-actions">
          {!error.toLowerCase().includes('not found') && (
            <button className="admin-btn-dark" onClick={load}>
              <RefreshCw size={16} /> Retry
            </button>
          )}
          <button className="profile-back-btn" onClick={() => navigate('/admin/students')}>
            <ArrowLeft size={16} /> Back to Students
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-page-content">
      {/* Back nav */}
      <button className="profile-back-btn" onClick={() => navigate('/admin/students')}>
        <ArrowLeft size={18} /> Back to Students
      </button>

      {/* Profile Header */}
      <div className="profile-header-card">
        <div className="profile-header-left">
          <Avatar name={student.name} size={80} />
          <div className="profile-header-info">
            <h1 className="profile-name">{student.name}</h1>
            <div className="profile-meta-row">
              <span className="profile-meta-chip">
                <School size={14} /> {student.class}
              </span>
              <span className="profile-meta-chip">
                <UserRound size={14} /> Roll No: {student.rollNo}
              </span>
              <span className="profile-meta-chip accent">
                ID: {student.studentId}
              </span>
            </div>
            <div className="profile-meta-row" style={{ marginTop: 6 }}>
              {student.phone && (
                <span className="profile-meta-text"><Phone size={13} /> {student.phone}</span>
              )}
              {student.guardian && (
                <span className="profile-meta-text"><Users size={13} /> Guardian: {student.guardian}</span>
              )}
            </div>
          </div>
        </div>
        <div className="profile-header-right">
          <span className="profile-status-badge active">Active</span>
          <div className="profile-join-date">
            <CalendarDays size={14} />
            <span>Enrolled {formatDate(student.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs-bar">
        {TABS.map(t => (
          <button
            key={t}
            className={`profile-tab-btn ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'Overview' && <UserRound size={15} />}
            {t === 'Results' && <FileCheck2 size={15} />}
            {t === 'Attendance' && <ClipboardCheck size={15} />}
            {t}
          </button>
        ))}
      </div>

      {/* ===== OVERVIEW TAB ===== */}
      {tab === 'Overview' && (
        <div className="profile-tab-content">
          <div className="profile-stat-grid">
            <StatCard icon={<School size={20} />} label="Class" value={student.class} accent="#0284c7" />
            <StatCard icon={<GraduationCap size={20} />} label="Roll Number" value={student.rollNo} accent="#7c3aed" />
            <StatCard
              icon={<FileCheck2 size={20} />}
              label="Total Results"
              value={results.length > 0 ? results.length : '—'}
              accent="#059669"
            />
            <StatCard
              icon={<ClipboardCheck size={20} />}
              label="Attendance Rate"
              value={attendancePct !== null ? `${attendancePct}%` : '—'}
              accent={attendancePct !== null && attendancePct >= 75 ? '#059669' : '#dc2626'}
            />
          </div>

          {/* Personal Info */}
          <div className="profile-section-card">
            <h2 className="profile-section-title">
              <UserRound size={18} /> Personal Information
            </h2>
            <div className="profile-info-grid">
              <InfoRow label="Full Name" value={student.name} />
              <InfoRow label="Student ID" value={student.studentId} />
              <InfoRow label="Class" value={student.class} />
              <InfoRow label="Roll Number" value={student.rollNo} />
              <InfoRow label="Guardian" value={student.guardian || '—'} />
              <InfoRow label="Phone" value={student.phone || '—'} />
              <InfoRow label="Enrolled On" value={formatDate(student.createdAt)} />
            </div>
          </div>

          {/* Quick results preview */}
          {results.length > 0 && (
            <div className="profile-section-card">
              <div className="profile-section-title-row">
                <h2 className="profile-section-title"><FileCheck2 size={18} /> Recent Results</h2>
                <button className="profile-view-all-btn" onClick={() => setTab('Results')}>
                  View All
                </button>
              </div>
              <div className="profile-results-list">
                {results.slice(0, 3).map(r => (
                  <div key={r._id} className="profile-result-row">
                    <div className="profile-result-left">
                      <div className="profile-result-exam">{r.exam}</div>
                      <div className="profile-result-class">{r.class}</div>
                    </div>
                    <div className="profile-result-right">
                      <span className="profile-result-grade">{r.grade}</span>
                      <span className="profile-result-pct">{r.percentage}%</span>
                      <span className={`profile-result-status ${r.status === 'Pass' ? 'pass' : 'fail'}`}>
                        {r.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== RESULTS TAB ===== */}
      {tab === 'Results' && (
        <div className="profile-tab-content">
          {results.length === 0 ? (
            <div className="profile-empty-state">
              <FileCheck2 size={38} />
              <h3>No Results Found</h3>
              <p>No exam results have been recorded for this student yet.</p>
            </div>
          ) : (
            <>
              {avgPct !== null && (
                <div className="profile-stat-grid" style={{ marginBottom: 16 }}>
                  <StatCard icon={<FileCheck2 size={20} />} label="Total Exams" value={results.length} accent="#0284c7" />
                  <StatCard icon={<GraduationCap size={20} />} label="Average Score" value={`${avgPct}%`} accent="#7c3aed" />
                  <StatCard
                    icon={<ClipboardCheck size={20} />}
                    label="Passed"
                    value={results.filter(r => r.status === 'Pass').length}
                    accent="#059669"
                  />
                  <StatCard
                    icon={<AlertCircle size={20} />}
                    label="Failed"
                    value={results.filter(r => r.status === 'Fail').length}
                    accent="#dc2626"
                  />
                </div>
              )}
              <div className="profile-section-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="desktop-results-table admin-table-container" style={{ margin: 0 }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Exam</th><th>Class</th><th>Total</th>
                        <th>%</th><th>Grade</th><th>Status</th><th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map(r => (
                        <tr key={r._id}>
                          <td style={{ fontWeight: 600 }}>{r.exam}</td>
                          <td>{r.class}</td>
                          <td>{r.total}</td>
                          <td>{r.percentage}%</td>
                          <td><span style={{ fontWeight: 700 }}>{r.grade}</span></td>
                          <td>
                            <span style={{
                              padding: '3px 10px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700,
                              background: r.status === 'Pass' ? '#dcfce7' : '#fee2e2',
                              color: r.status === 'Pass' ? '#16a34a' : '#dc2626'
                            }}>{r.status}</span>
                          </td>
                          <td style={{ color: '#64748b', fontSize: '0.82rem' }}>{formatDate(r.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Mobile cards */}
                <div className="mobile-results-cards" style={{ padding: '12px' }}>
                  {results.map(r => (
                    <div key={r._id} className="result-card">
                      <div className="result-card-header">
                        <div className="result-card-user">
                          <h3 className="result-card-name">{r.exam}</h3>
                          <span className="result-card-id">{r.class}</span>
                        </div>
                        <div className="result-card-badges">
                          <span className="result-badge-class">{r.grade}</span>
                        </div>
                      </div>
                      <div className="result-card-stats">
                        <div className="result-stat-item">
                          <span className="result-stat-label">Total</span>
                          <span className="result-stat-value">{r.total}</span>
                        </div>
                        <div className="result-stat-item">
                          <span className="result-stat-label">Percentage</span>
                          <span className="result-stat-value">{r.percentage}%</span>
                        </div>
                        <div className="result-stat-item">
                          <span className="result-stat-label">Status</span>
                          <span className={`result-stat-status ${r.status === 'Pass' ? 'pass' : 'fail'}`}>
                            {r.status}
                          </span>
                        </div>
                        <div className="result-stat-item">
                          <span className="result-stat-label">Date</span>
                          <span className="result-stat-value" style={{ fontSize: '0.82rem' }}>{formatDate(r.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ===== ATTENDANCE TAB ===== */}
      {tab === 'Attendance' && (
        <div className="profile-tab-content">
          {attendance.length === 0 ? (
            <div className="profile-empty-state">
              <ClipboardCheck size={38} />
              <h3>No Attendance Records</h3>
              <p>No attendance has been recorded for this student yet.</p>
            </div>
          ) : (
            <>
              <div className="profile-stat-grid" style={{ marginBottom: 16 }}>
                <StatCard icon={<ClipboardCheck size={20} />} label="Total Days" value={totalDays} accent="#0284c7" />
                <StatCard icon={<ClipboardCheck size={20} />} label="Present" value={presentCount} accent="#059669" />
                <StatCard icon={<ClipboardCheck size={20} />} label="Absent" value={absentCount} accent="#dc2626" />
                <StatCard
                  icon={<ClipboardCheck size={20} />}
                  label="Attendance Rate"
                  value={`${attendancePct}%`}
                  accent={attendancePct >= 75 ? '#059669' : '#dc2626'}
                />
              </div>

              {/* Attendance progress bar */}
              <div className="profile-section-card">
                <h2 className="profile-section-title"><ClipboardCheck size={18} /> Attendance Summary</h2>
                <div className="profile-attendance-bar-wrap">
                  <div className="profile-attendance-bar">
                    <div
                      className="profile-attendance-fill"
                      style={{
                        width: `${attendancePct}%`,
                        background: attendancePct >= 75 ? '#22c55e' : '#ef4444'
                      }}
                    />
                  </div>
                  <span className="profile-attendance-pct">{attendancePct}%</span>
                </div>
                <div className="profile-attendance-legend">
                  <span className="legend-item present">● Present: {presentCount} days</span>
                  <span className="legend-item absent">● Absent: {absentCount} days</span>
                </div>
              </div>

              {/* Recent records */}
              <div className="profile-section-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid #f1f5f9' }}>
                  <h2 className="profile-section-title" style={{ marginBottom: 0 }}>
                    <CalendarDays size={18} /> Attendance Records
                  </h2>
                </div>
                <div className="desktop-results-table admin-table-container" style={{ margin: 0 }}>
                  <table className="admin-table">
                    <thead>
                      <tr><th>Date</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {attendance.map((a, i) => (
                        <tr key={i}>
                          <td>{a.date}</td>
                          <td>
                            <span style={{
                              padding: '3px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700,
                              background: a.status === 'Present' ? '#dcfce7' : '#fee2e2',
                              color: a.status === 'Present' ? '#16a34a' : '#dc2626'
                            }}>{a.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Mobile attendance cards */}
                <div className="mobile-results-cards" style={{ padding: '12px' }}>
                  {attendance.map((a, i) => (
                    <div key={i} className="attendance-mobile-row">
                      <span className="attendance-mobile-date">{a.date}</span>
                      <span className={`result-stat-status ${a.status === 'Present' ? 'pass' : 'fail'}`}>
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
