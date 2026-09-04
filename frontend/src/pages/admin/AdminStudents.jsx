import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Users } from 'lucide-react';
import { API } from '../../config';

const CLASSES = ['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All Classes');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ studentId: '', name: '', class: 'Class 5', rollNo: '', guardian: '', phone: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchStudents = async () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (classFilter !== 'All Classes') params.append('class', classFilter);
    const res = await fetch(`${API}/api/students?${params}`);
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => { fetchStudents(); }, [search, classFilter]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/api/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg({ text: 'Student added!', type: 'success' });
      setForm({ studentId: '', name: '', class: 'Class 5', rollNo: '', guardian: '', phone: '' });
      setShowForm(false);
      fetchStudents();
    } else {
      setMsg({ text: data.message, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return;
    await fetch(`${API}/api/students/${id}`, { method: 'DELETE' });
    fetchStudents();
  };

  return (
    <div className="admin-page-content">
      <div className="admin-page-header split">
        <div>
          <h1>Students</h1>
          <p>{students.length} student{students.length !== 1 ? 's' : ''} found</p>
        </div>
        <button className="admin-btn-dark" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Add Student
        </button>
      </div>

      {showForm && (
        <div className="admin-form-card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 14, fontWeight: 700 }}>New Student</h3>
          {msg.text && <div className={`admin-form-message ${msg.type}`}>{msg.text}</div>}
          <form onSubmit={handleAdd} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
            {[['Student ID', 'studentId', 'text'], ['Full Name', 'name', 'text'], ['Roll No', 'rollNo', 'text'], ['Guardian', 'guardian', 'text'], ['Phone', 'phone', 'text']].map(([label, key, type]) => (
              <div key={key} style={{ flex: '1 1 150px' }}>
                <label className="admin-label">{label}</label>
                <input type={type} className="admin-input" value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  required={['studentId', 'name', 'rollNo'].includes(key)} />
              </div>
            ))}
            <div style={{ flex: '1 1 150px' }}>
              <label className="admin-label">Class</label>
              <select className="admin-input" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })}>
                {CLASSES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button type="submit" className="admin-btn-dark" style={{ height: 42 }}>Save</button>
          </form>
        </div>
      )}

      <div className="admin-table-controls">
        <div className="admin-search-bar">
          <Search size={18} className="search-icon-svg" />
          <input type="text" placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="admin-dropdown" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
          <option>All Classes</option>
          {CLASSES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="results-count-summary">
        Showing {students.length} student{students.length !== 1 ? 's' : ''}
      </div>

      {/* Desktop Table (> 768px) */}
      <div className="desktop-results-table admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student ID</th><th>Name</th><th>Class</th><th>Roll No</th><th>Guardian</th><th>Phone</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan="7" className="admin-table-empty">No students found</td></tr>
            ) : students.map(s => (
              <tr key={s._id}>
                <td style={{ fontWeight: 600, color: '#0284c7' }}>{s.studentId}</td>
                <td style={{ fontWeight: 500 }}>{s.name}</td>
                <td>{s.class}</td>
                <td>{s.rollNo}</td>
                <td>{s.guardian || '—'}</td>
                <td>{s.phone || '—'}</td>
                <td>
                  <button onClick={() => handleDelete(s._id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Trash2 size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (<= 768px) */}
      <div className="mobile-results-cards">
        {students.length === 0 ? (
          <div className="results-empty-card">
            <Users size={38} className="results-empty-icon" />
            <h3>No students found</h3>
            <p>Try changing your search or class filter.</p>
          </div>
        ) : students.map(s => (
          <div key={s._id} className="result-card">
            <div className="result-card-header">
              <div className="result-card-user">
                <h3 className="result-card-name">{s.name}</h3>
                <span className="result-card-id">ID: {s.studentId}</span>
              </div>
              <div className="result-card-badges">
                <span className="result-badge-class">{s.class}</span>
                <span className="result-badge-exam">Roll {s.rollNo}</span>
              </div>
            </div>

            <div className="result-card-stats">
              <div className="result-stat-item">
                <span className="result-stat-label">Guardian</span>
                <span className="result-stat-value" style={{ fontSize: '0.9rem' }}>{s.guardian || '—'}</span>
              </div>
              <div className="result-stat-item">
                <span className="result-stat-label">Phone</span>
                <span className="result-stat-value" style={{ fontSize: '0.9rem' }}>{s.phone || '—'}</span>
              </div>
            </div>

            <div className="result-card-actions">
              <button
                type="button"
                onClick={() => handleDelete(s._id)}
                className="result-card-btn-delete"
                title="Delete Student"
                aria-label="Delete student"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
