import React, { useState, useEffect } from 'react';

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({ name: '', subject: '', email: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showForm, setShowForm] = useState(false);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/teachers');
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ text: 'Teacher added successfully!', type: 'success' });
        setFormData({ name: '', subject: '', email: '' });
        setShowForm(false);
        fetchTeachers();
      } else {
        setMessage({ text: data.message || 'Error adding teacher', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error while adding teacher.', type: 'error' });
    }
  };

  return (
    <div className="admin-page-content">
      <div className="admin-page-header split">
        <div>
          <h1>Teachers</h1>
          <p>{teachers.length} teacher{teachers.length !== 1 ? 's' : ''} found</p>
        </div>
        <button className="admin-btn-dark" onClick={() => setShowForm(!showForm)}>
          <i className="ri-add-line"></i> Add Teacher
        </button>
      </div>

      {/* Add Teacher Form (toggleable) */}
      {showForm && (
        <div className="admin-form-card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', fontWeight: 700 }}>New Teacher</h3>
          {message.text && (
            <div className={`admin-form-message ${message.type}`}>{message.text}</div>
          )}
          <form onSubmit={handleAddTeacher} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label className="admin-label">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="admin-input" />
            </div>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label className="admin-label">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="admin-input" />
            </div>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label className="admin-label">Subject Area</label>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="admin-input" />
            </div>
            <button type="submit" className="admin-btn-dark" style={{ height: '42px', whiteSpace: 'nowrap' }}>
              Save Teacher
            </button>
          </form>
        </div>
      )}

      {/* Teacher Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Subject</th>
              <th>Email</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td colSpan="4" className="admin-table-empty">No teachers registered yet.</td>
              </tr>
            ) : (
              teachers.map((teacher, index) => (
                <tr key={teacher._id || index}>
                  <td style={{ fontWeight: 500 }}>{teacher.name}</td>
                  <td>{teacher.subject}</td>
                  <td>{teacher.email}</td>
                  <td>{new Date(teacher.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
