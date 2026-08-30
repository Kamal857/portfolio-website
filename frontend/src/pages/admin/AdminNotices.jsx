import React, { useState, useEffect } from 'react';

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchNotices = async () => {
    const res = await fetch('http://localhost:5000/api/notices');
    const data = await res.json();
    setNotices(data);
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/notices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg({ text: 'Notice posted!', type: 'success' });
      setForm({ title: '', content: '' });
      setShowForm(false);
      fetchNotices();
    } else {
      setMsg({ text: data.message, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this notice?')) return;
    await fetch(`http://localhost:5000/api/notices/${id}`, { method: 'DELETE' });
    fetchNotices();
  };

  return (
    <div className="admin-page-content">
      <div className="admin-page-header split">
        <div>
          <h1>Notices</h1>
          <p>{notices.length} notice{notices.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="admin-btn-dark" onClick={() => setShowForm(!showForm)}>
          <i className="ri-add-line"></i> Post Notice
        </button>
      </div>

      {showForm && (
        <div className="admin-form-card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 14, fontWeight: 700 }}>New Notice</h3>
          {msg.text && <div className={`admin-form-message ${msg.type}`}>{msg.text}</div>}
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label className="admin-label">Title</label>
              <input className="admin-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="admin-label">Content</label>
              <textarea className="admin-input" rows="3" value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })} required
                style={{ resize: 'vertical' }} />
            </div>
            <button type="submit" className="admin-btn-dark" style={{ width: '120px' }}>Post</button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {notices.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 14, padding: 40, textAlign: 'center', color: '#aaa', border: '1px solid #f0f0f0' }}>
            No notices posted yet.
          </div>
        ) : notices.map(n => (
          <div key={n._id} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid rgba(14,165,233,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div>
              <p style={{ fontWeight: 700, color: '#0284c7', fontSize: '1rem', marginBottom: 4 }}>{n.title}</p>
              <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.6 }}>{n.content}</p>
              <p style={{ color: '#bbb', fontSize: '0.75rem', marginTop: 8 }}>{new Date(n.createdAt).toLocaleString()}</p>
            </div>
            <button onClick={() => handleDelete(n._id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontWeight: 600, flexShrink: 0 }}>
              <i className="ri-delete-bin-line"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
