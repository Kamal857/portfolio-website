import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';
import { API } from '../../config';

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({ name: '', subject: '', email: '', password: '', phone: '', assignedClass: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showForm, setShowForm] = useState(false);

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${API}/api/teachers`);
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
    }
  };

  useEffect(() => { fetchTeachers(); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (teacher) => {
    setEditingId(teacher._id);
    setFormData({
      name: teacher.name || '',
      subject: teacher.subject || '',
      email: teacher.email || '',
      password: '',
      phone: teacher.phone || '',
      assignedClass: teacher.assignedClass || ''
    });
    setShowForm(true);
    setMessage({ text: '', type: '' });
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({ name: '', subject: '', email: '', password: '', phone: '', assignedClass: '' });
    setShowForm(true);
    setMessage({ text: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isEditing = !!editingId;
      const url = isEditing ? `${API}/api/teachers/${editingId}` : `${API}/api/teachers`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: isEditing ? 'Teacher updated successfully!' : 'Teacher added successfully!', type: 'success' });
        setFormData({ name: '', subject: '', email: '', password: '', phone: '', assignedClass: '' });
        setShowForm(false);
        setEditingId(null);
        fetchTeachers();
      } else {
        setMessage({ text: data.message || 'Error processing request', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error.', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return;
    try {
      await fetch(`${API}/api/teachers/${id}`, { method: 'DELETE' });
      fetchTeachers();
    } catch (error) {
      console.error('Failed to delete', error);
    }
  };

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155', fontSize: '0.85rem' };

  return (
    <div className="admin-page-content">
      <div className="admin-page-header split">
        <div>
          <h1>Teachers</h1>
          <p>{teachers.length} teacher{teachers.length !== 1 ? 's' : ''} found</p>
        </div>
        <button className="admin-btn-dark" onClick={handleAddClick}>
          <Plus size={18} /> Add Teacher
        </button>
      </div>

      {showForm && (
        <div className="admin-form-card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', fontWeight: 700 }}>
            {editingId ? 'Edit Teacher Details' : 'New Teacher'}
          </h3>
          {message.text && (
            <div style={{ padding: '10px', borderRadius: '8px', marginBottom: '16px', fontWeight: 600, fontSize: '0.85rem', background: message.type === 'success' ? '#dcfce7' : '#fee2e2', color: message.type === 'success' ? '#166534' : '#991b1b' }}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email Address (Login ID)</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Subject Area</label>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Assigned Class (Optional)</label>
              <input type="text" name="assignedClass" value={formData.assignedClass} onChange={handleChange} placeholder="e.g. Class 10" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Phone Number (Optional)</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>
                {editingId ? 'Set New Password (Optional)' : 'Password'}
              </label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={editingId ? 'Leave blank to keep unchanged' : 'Required for login'} style={inputStyle} required={!editingId} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="admin-btn-dark" style={{ padding: '10px 20px' }}>
                {editingId ? 'Update Teacher' : 'Save Teacher'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="results-count-summary">
        Showing {teachers.length} teacher{teachers.length !== 1 ? 's' : ''}
      </div>

      {/* Desktop Table (> 768px) */}
      <div className="desktop-results-table admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Subject</th>
              <th>Class</th>
              <th>Email</th>
              <th>Phone</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td colSpan="6" className="admin-table-empty">No teachers registered yet.</td>
              </tr>
            ) : (
              teachers.map((teacher, index) => (
                <tr key={teacher._id || index}>
                  <td style={{ fontWeight: 600 }}>{teacher.name}</td>
                  <td>{teacher.subject}</td>
                  <td>{teacher.assignedClass || '—'}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.phone || '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => handleEditClick(teacher)} style={{ background: '#e0f2fe', color: '#0284c7', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 600, marginRight: '8px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Pencil size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(teacher._id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (<= 768px) */}
      <div className="mobile-results-cards">
        {teachers.length === 0 ? (
          <div className="results-empty-card">
            <GraduationCap size={38} className="results-empty-icon" />
            <h3>No teachers found</h3>
            <p>Add your first teacher using the button above.</p>
          </div>
        ) : teachers.map((teacher, index) => (
          <div key={teacher._id || index} className="result-card">
            <div className="result-card-header">
              <div className="result-card-user">
                <h3 className="result-card-name">{teacher.name}</h3>
                <span className="result-card-id">{teacher.email}</span>
              </div>
              <div className="result-card-badges">
                <span className="result-badge-class">{teacher.subject}</span>
                {teacher.assignedClass && (
                  <span className="result-badge-exam">{teacher.assignedClass}</span>
                )}
              </div>
            </div>

            <div className="result-card-stats">
              <div className="result-stat-item">
                <span className="result-stat-label">Subject</span>
                <span className="result-stat-value" style={{ fontSize: '0.9rem' }}>{teacher.subject}</span>
              </div>
              <div className="result-stat-item">
                <span className="result-stat-label">Phone</span>
                <span className="result-stat-value" style={{ fontSize: '0.9rem' }}>{teacher.phone || '—'}</span>
              </div>
              <div className="result-stat-item">
                <span className="result-stat-label">Class</span>
                <span className="result-stat-value" style={{ fontSize: '0.9rem' }}>{teacher.assignedClass || '—'}</span>
              </div>
            </div>

            <div className="result-card-actions">
              <button
                type="button"
                onClick={() => handleEditClick(teacher)}
                className="result-card-btn-edit"
                title="Edit Teacher"
                aria-label="Edit teacher"
              >
                <Pencil size={15} />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(teacher._id)}
                className="result-card-btn-delete"
                title="Delete Teacher"
                aria-label="Delete teacher"
              >
                <Trash2 size={15} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
