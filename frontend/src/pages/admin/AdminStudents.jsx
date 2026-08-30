import React, { useState, useEffect } from 'react';

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
    const res = await fetch(`http://localhost:5000/api/students?${params}`);
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => { fetchStudents(); }, [search, classFilter]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/students', {
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
    await fetch(`http://localhost:5000/api/students/${id}`, { method: 'DELETE' });
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
          <i className="ri-add-line"></i> Add Student
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
          <i className="ri-search-line"></i>
          <input type="text" placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="admin-dropdown" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
          <option>All Classes</option>
          {CLASSES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="admin-table-container">
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
                  <button onClick={() => handleDelete(s._id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                    <i className="ri-delete-bin-line"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
