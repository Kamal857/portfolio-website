import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, GraduationCap, Phone, Mail,
  School, CalendarDays, Users, UserRound,
  RefreshCw, AlertCircle, BookOpen, FileCheck2
} from 'lucide-react';
import { API } from '../../config';

const TABS = ['Overview', 'Class & Students'];

function Avatar({ name, size = 72 }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  return (
    <div className="profile-avatar teacher" style={{ width: size, height: size, fontSize: size * 0.36 }}>
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
        {[1, 2, 3, 4].map(i => <div key={i} className="skel skel-card" />)}
      </div>
      <div className="skel skel-block" style={{ marginTop: 20 }} />
    </div>
  );
}

export default function AdminTeacherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [classResults, setClassResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('Overview');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const tRes = await fetch(`${API}/api/teachers/${id}`);
      if (!tRes.ok) {
        const d = await tRes.json();
        setError(d.message || 'Teacher not found');
        setLoading(false);
        return;
      }
      const tData = await tRes.json();
      setTeacher(tData);

      // If assigned class exists, load students in that class
      if (tData.assignedClass) {
        const params = new URLSearchParams({ class: tData.assignedClass });
        const [sRes, rRes] = await Promise.all([
          fetch(`${API}/api/students?${params}`),
          fetch(`${API}/api/results?${params}`),
        ]);
        const sData = sRes.ok ? await sRes.json() : [];
        const rData = rRes.ok ? await rRes.json() : [];
        setClassStudents(Array.isArray(sData) ? sData : []);
        setClassResults(Array.isArray(rData) ? rData : []);
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const classAvgPct = classResults.length > 0
    ? Math.round(classResults.reduce((s, r) => s + r.percentage, 0) / classResults.length)
    : null;

  if (loading) return (
    <div className="admin-page-content">
      <button className="profile-back-btn" onClick={() => navigate('/admin/teachers')}>
        <ArrowLeft size={18} /> Back to Teachers
      </button>
      <Skeleton />
    </div>
  );

  if (error) return (
    <div className="admin-page-content">
      <button className="profile-back-btn" onClick={() => navigate('/admin/teachers')}>
        <ArrowLeft size={18} /> Back to Teachers
      </button>
      <div className="profile-error-card">
        <AlertCircle size={36} className="profile-error-icon" />
        <h3>{error.toLowerCase().includes('not found') ? 'Teacher Not Found' : 'Unable to Load Profile'}</h3>
        <p>{error}</p>
        <div className="profile-error-actions">
          {!error.toLowerCase().includes('not found') && (
            <button className="admin-btn-dark" onClick={load}>
              <RefreshCw size={16} /> Retry
            </button>
          )}
          <button className="profile-back-btn" onClick={() => navigate('/admin/teachers')}>
            <ArrowLeft size={16} /> Back to Teachers
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-page-content">
      {/* Back nav */}
      <button className="profile-back-btn" onClick={() => navigate('/admin/teachers')}>
        <ArrowLeft size={18} /> Back to Teachers
      </button>

      {/* Profile Header */}
      <div className="profile-header-card">
        <div className="profile-header-left">
          <Avatar name={teacher.name} size={80} />
          <div className="profile-header-info">
            <h1 className="profile-name">{teacher.name}</h1>
            <div className="profile-meta-row">
              <span className="profile-meta-chip">
                <BookOpen size={14} /> {teacher.subject}
              </span>
              {teacher.assignedClass && (
                <span className="profile-meta-chip">
                  <School size={14} /> {teacher.assignedClass}
                </span>
              )}
            </div>
            <div className="profile-meta-row" style={{ marginTop: 6 }}>
              <span className="profile-meta-text"><Mail size={13} /> {teacher.email}</span>
              {teacher.phone && (
                <span className="profile-meta-text"><Phone size={13} /> {teacher.phone}</span>
              )}
            </div>
          </div>
        </div>
        <div className="profile-header-right">
          <span className="profile-status-badge active">Active</span>
          <div className="profile-join-date">
            <CalendarDays size={14} />
            <span>Joined {formatDate(teacher.createdAt)}</span>
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
            {t === 'Class & Students' && <Users size={15} />}
            {t}
          </button>
        ))}
      </div>

      {/* ===== OVERVIEW TAB ===== */}
      {tab === 'Overview' && (
        <div className="profile-tab-content">
          <div className="profile-stat-grid">
            <StatCard icon={<BookOpen size={20} />} label="Subject" value={teacher.subject} accent="#7c3aed" />
            <StatCard
              icon={<School size={20} />}
              label="Assigned Class"
              value={teacher.assignedClass || '—'}
              accent="#0284c7"
            />
            <StatCard
              icon={<Users size={20} />}
              label="Class Students"
              value={teacher.assignedClass ? classStudents.length : '—'}
              accent="#059669"
            />
            <StatCard
              icon={<FileCheck2 size={20} />}
              label="Class Avg Score"
              value={classAvgPct !== null ? `${classAvgPct}%` : '—'}
              accent="#f59e0b"
            />
          </div>

          {/* Personal + Professional info */}
          <div className="profile-info-two-col">
            <div className="profile-section-card">
              <h2 className="profile-section-title">
                <UserRound size={18} /> Personal Information
              </h2>
              <div className="profile-info-grid">
                <InfoRow label="Full Name" value={teacher.name} />
                <InfoRow label="Email" value={teacher.email} />
                <InfoRow label="Phone" value={teacher.phone || '—'} />
                <InfoRow label="Joined" value={formatDate(teacher.createdAt)} />
              </div>
            </div>

            <div className="profile-section-card">
              <h2 className="profile-section-title">
                <GraduationCap size={18} /> Professional Details
              </h2>
              <div className="profile-info-grid">
                <InfoRow label="Subject" value={teacher.subject} />
                <InfoRow label="Assigned Class" value={teacher.assignedClass || '—'} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== CLASS & STUDENTS TAB ===== */}
      {tab === 'Class & Students' && (
        <div className="profile-tab-content">
          {!teacher.assignedClass ? (
            <div className="profile-empty-state">
              <School size={38} />
              <h3>No Class Assigned</h3>
              <p>This teacher has not been assigned to a class yet.</p>
            </div>
          ) : (
            <>
              <div className="profile-section-card" style={{ marginBottom: 16 }}>
                <h2 className="profile-section-title"><School size={18} /> {teacher.assignedClass}</h2>
                <div className="profile-info-grid">
                  <InfoRow label="Class" value={teacher.assignedClass} />
                  <InfoRow label="Class Teacher" value={teacher.name} />
                  <InfoRow label="Subject" value={teacher.subject} />
                  <InfoRow label="Total Students" value={classStudents.length} />
                </div>
              </div>

              {classStudents.length === 0 ? (
                <div className="profile-empty-state">
                  <Users size={38} />
                  <h3>No Students in {teacher.assignedClass}</h3>
                  <p>No students have been added to this class yet.</p>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="profile-section-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px 12px' }}>
                      <h2 className="profile-section-title" style={{ marginBottom: 0 }}>
                        <Users size={18} /> Students in {teacher.assignedClass}
                      </h2>
                    </div>
                    <div className="desktop-results-table admin-table-container" style={{ margin: 0 }}>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Student ID</th><th>Name</th><th>Roll No</th>
                            <th>Guardian</th><th>Phone</th>
                          </tr>
                        </thead>
                        <tbody>
                          {classStudents.map(s => (
                            <tr key={s._id}>
                              <td style={{ fontWeight: 600, color: '#0284c7' }}>{s.studentId}</td>
                              <td style={{ fontWeight: 500 }}>{s.name}</td>
                              <td>{s.rollNo}</td>
                              <td>{s.guardian || '—'}</td>
                              <td>{s.phone || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Mobile cards */}
                    <div className="mobile-results-cards" style={{ padding: '12px' }}>
                      {classStudents.map(s => (
                        <div key={s._id} className="result-card">
                          <div className="result-card-header">
                            <div className="result-card-user">
                              <h3 className="result-card-name">{s.name}</h3>
                              <span className="result-card-id">ID: {s.studentId}</span>
                            </div>
                            <div className="result-card-badges">
                              <span className="result-badge-class">Roll {s.rollNo}</span>
                            </div>
                          </div>
                          <div className="result-card-stats">
                            <div className="result-stat-item">
                              <span className="result-stat-label">Guardian</span>
                              <span className="result-stat-value" style={{ fontSize: '0.88rem' }}>{s.guardian || '—'}</span>
                            </div>
                            <div className="result-stat-item">
                              <span className="result-stat-label">Phone</span>
                              <span className="result-stat-value" style={{ fontSize: '0.88rem' }}>{s.phone || '—'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Class results summary */}
                  {classResults.length > 0 && (
                    <div className="profile-section-card" style={{ marginTop: 16 }}>
                      <h2 className="profile-section-title"><FileCheck2 size={18} /> Class Results Summary</h2>
                      <div className="profile-stat-grid" style={{ marginTop: 12 }}>
                        <StatCard icon={<FileCheck2 size={18} />} label="Total Results" value={classResults.length} accent="#0284c7" />
                        <StatCard icon={<GraduationCap size={18} />} label="Average Score" value={`${classAvgPct}%`} accent="#7c3aed" />
                        <StatCard
                          icon={<Users size={18} />}
                          label="Passed"
                          value={classResults.filter(r => r.status === 'Pass').length}
                          accent="#059669"
                        />
                        <StatCard
                          icon={<AlertCircle size={18} />}
                          label="Failed"
                          value={classResults.filter(r => r.status === 'Fail').length}
                          accent="#dc2626"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
