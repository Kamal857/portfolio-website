import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Trash2, Pencil, Eye, GraduationCap,
  RotateCw, X, User, Phone, ShieldCheck, Mail, BookOpen
} from 'lucide-react';
import { API } from '../../config';

// ─── Avatar for Teachers ──────────────────────────────────────
export function TeacherAvatarSvg({ name = '', size = 84 }) {
  const charCode = (name || 'T').charCodeAt(0) + (name || 'T').charCodeAt((name || 'T').length - 1 || 0);
  const bgColors = ['#f8fafc', '#f1f5f9', '#e2e8f0', '#f3f4f6', '#f4f4f5'];
  const jacketColors = ['#1e293b', '#334155', '#0f172a', '#111827', '#18181b', '#312e81'];
  const tieColors = ['#dc2626', '#0284c7', '#059669', '#d97706', '#7c3aed'];
  
  const bg = bgColors[charCode % bgColors.length];
  const jacket = jacketColors[charCode % jacketColors.length];
  const tie = tieColors[charCode % tieColors.length];

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="esk-student-avatar-svg">
      <circle cx="50" cy="50" r="50" fill={bg} />
      {/* Hair back */}
      <path d="M30 40 C30 20 70 20 70 40 L70 50 L30 50 Z" fill="#09090b" />
      {/* Neck */}
      <rect x="44" y="55" width="12" height="15" rx="2" fill="#fcd34d" />
      {/* Shirt */}
      <path d="M20 95 C20 75 34 64 50 64 C66 64 80 75 80 95 Z" fill="#ffffff" />
      {/* Jacket */}
      <path d="M20 95 C20 75 34 64 43 64 L35 95 Z" fill={jacket} />
      <path d="M80 95 C80 75 66 64 57 64 L65 95 Z" fill={jacket} />
      {/* Tie */}
      <path d="M47 68 L53 68 L51 85 L50 88 L49 85 Z" fill={tie} />
      {/* Face */}
      <ellipse cx="50" cy="42" rx="17" ry="19" fill="#fde68a" />
      {/* Hair front / neat side part */}
      <path d="M31 34 C35 22 55 22 69 34 C65 26 55 23 45 23 C35 23 31 30 31 34 Z" fill="#09090b" />
      {/* Glasses */}
      <rect x="36" y="37" width="10" height="7" rx="1" fill="none" stroke="#1e293b" strokeWidth="1.5" />
      <rect x="54" y="37" width="10" height="7" rx="1" fill="none" stroke="#1e293b" strokeWidth="1.5" />
      <path d="M46 40 L54 40" stroke="#1e293b" strokeWidth="1.5" />
      <path d="M30 40 L36 40" stroke="#1e293b" strokeWidth="1.5" />
      <path d="M64 40 L70 40" stroke="#1e293b" strokeWidth="1.5" />
      {/* Smile */}
      <path d="M46 51 C48 53 52 53 54 51" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isRotating, setIsRotating] = useState(false);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [viewingTeacher, setViewingTeacher] = useState(null);

  // Form data
  const [form, setForm] = useState({
    name: '',
    subject: '',
    email: '',
    password: '',
    phone: '',
    assignedClass: ''
  });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchTeachers = async () => {
    setLoading(true);
    setIsRotating(true);
    try {
      const res = await fetch(`${API}/api/teachers`);
      const data = await res.json();
      setTeachers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setTeachers([]);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRotating(false), 500);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Filter teachers client-side based on search
  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setForm({ name: '', subject: '', email: '', password: '', phone: '', assignedClass: '' });
    setMsg({ text: '', type: '' });
    setShowAddModal(true);
  };

  const handleOpenEdit = (teacher) => {
    setEditingTeacher(teacher);
    setForm({
      name: teacher.name || '',
      subject: teacher.subject || '',
      email: teacher.email || '',
      password: '',
      phone: teacher.phone || '',
      assignedClass: teacher.assignedClass || ''
    });
    setMsg({ text: '', type: '' });
    setShowAddModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const isEditing = !!editingTeacher;
      const url = isEditing ? `${API}/api/teachers/${editingTeacher._id}` : `${API}/api/teachers`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (res.ok) {
        setMsg({ text: isEditing ? 'Teacher updated successfully!' : 'Teacher added successfully!', type: 'success' });
        setTimeout(() => {
          setShowAddModal(false);
          setEditingTeacher(null);
          fetchTeachers();
        }, 600);
      } else {
        setMsg({ text: data.message || 'Error processing request', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Network error occurred.', type: 'error' });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete teacher "${name}"?`)) return;
    try {
      await fetch(`${API}/api/teachers/${id}`, { method: 'DELETE' });
      fetchTeachers();
      if (viewingTeacher && viewingTeacher._id === id) {
        setViewingTeacher(null);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="admin-page-content">
      {/* 1. Top Breadcrumb Bar */}
      <div className="esk-breadcrumb-card">
        <div className="esk-breadcrumb-left">
          <div className="esk-breadcrumb-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
            <GraduationCap size={18} />
          </div>
          <span className="esk-breadcrumb-title">Teachers</span>
          <span className="esk-breadcrumb-sep">&gt;</span>
          <span className="esk-breadcrumb-sub">Faculty Directory</span>
        </div>
        <button
          type="button"
          className="esk-reload-btn"
          onClick={fetchTeachers}
          title="Reload teachers list"
        >
          <RotateCw
            size={14}
            style={{
              transition: 'transform 0.5s ease',
              transform: isRotating ? 'rotate(360deg)' : 'none'
            }}
          />
          <span>Reload</span>
        </button>
      </div>

      {/* 2. Filter & Action Card */}
      <div className="esk-filter-card">
        <div className="esk-filter-grid" style={{ gridTemplateColumns: '1fr auto' }}>
          <div className="esk-filter-group">
            <label className="esk-filter-label">SEARCH TEACHER</label>
            <input
              type="text"
              className="esk-filter-input"
              placeholder="Search by name, email, or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="esk-add-btn"
            onClick={handleOpenAdd}
            style={{ alignSelf: 'flex-end', height: 44, padding: '0 24px' }}
          >
            <Plus size={18} />
            <span>Add Teacher</span>
          </button>
        </div>
      </div>

      {/* 3. Teachers Grid */}
      <div className="esk-students-grid">
        {filteredTeachers.map((teacher) => (
          <div key={teacher._id} className="esk-student-card">
            <div className="esk-student-avatar-wrap" style={{ cursor: 'pointer' }} onClick={() => setViewingTeacher(teacher)}>
              <TeacherAvatarSvg name={teacher.name} size={84} />
            </div>

            <h3 className="esk-student-name" title={teacher.name} onClick={() => setViewingTeacher(teacher)} style={{ cursor: 'pointer' }}>
              {teacher.name}
            </h3>

            <p className="esk-student-sub" style={{ color: '#4f46e5', fontWeight: 600 }}>
              {teacher.subject}
            </p>

            <span className="esk-student-meta-badge" style={{ marginTop: 8 }}>
              {teacher.assignedClass || 'No Class Assigned'}
            </span>

            <div className="esk-student-actions">
              <button
                type="button"
                className="esk-action-btn view"
                onClick={() => setViewingTeacher(teacher)}
                title="View Profile"
              >
                <Eye size={15} />
              </button>
              <button
                type="button"
                className="esk-action-btn edit"
                onClick={() => handleOpenEdit(teacher)}
                title="Edit Teacher"
              >
                <Pencil size={15} />
              </button>
              <button
                type="button"
                className="esk-action-btn delete"
                onClick={() => handleDelete(teacher._id, teacher.name)}
                title="Delete Teacher"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
        
        {filteredTeachers.length === 0 && !loading && (
          <div className="esk-add-card" onClick={handleOpenAdd} style={{ gridColumn: '1 / -1' }}>
            <div className="esk-add-card-circle">
              <Plus size={24} />
            </div>
            <h4 className="esk-add-card-title">Add New Teacher</h4>
            <p className="esk-add-card-sub">Click to register a new faculty member.</p>
          </div>
        )}
      </div>

      {/* 4. Add/Edit Teacher Modal */}
      {showAddModal && (
        <div className="esk-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="esk-modal-container" onClick={e => e.stopPropagation()}>
            <div className="esk-modal-header">
              <h3>{editingTeacher ? 'Edit Teacher Profile' : 'Register New Teacher'}</h3>
              <button type="button" className="esk-modal-close" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="esk-modal-body">
              {msg.text && (
                <div className={`admin-form-message ${msg.type}`} style={{ marginBottom: 20 }}>
                  {msg.text}
                </div>
              )}
              <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="admin-label">Full Name *</label>
                  <input type="text" className="admin-input" name="name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
                </div>
                <div>
                  <label className="admin-label">Email Address *</label>
                  <input type="email" className="admin-input" name="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
                </div>
                <div>
                  <label className="admin-label">Subject Area *</label>
                  <input type="text" className="admin-input" name="subject" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} required />
                </div>
                <div>
                  <label className="admin-label">Assigned Class (Optional)</label>
                  <input type="text" className="admin-input" name="assignedClass" value={form.assignedClass} onChange={(e) => setForm({...form, assignedClass: e.target.value})} placeholder="e.g. Class 10" />
                </div>
                <div>
                  <label className="admin-label">Phone Number</label>
                  <input type="text" className="admin-input" name="phone" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
                </div>
                <div>
                  <label className="admin-label">{editingTeacher ? 'New Password' : 'Password *'}</label>
                  <input type="password" className="admin-input" name="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder={editingTeacher ? 'Leave blank to keep current' : 'Required for login'} required={!editingTeacher} />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button type="submit" className="admin-btn-dark" style={{ flex: 1, padding: '12px', height: 'auto' }}>
                    {editingTeacher ? 'Update Teacher' : 'Save Teacher'}
                  </button>
                  <button type="button" className="btn-outline" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '12px', height: 'auto' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 5. View Details Modal */}
      {viewingTeacher && (
        <div className="esk-modal-overlay" onClick={() => setViewingTeacher(null)}>
          <div className="esk-modal-container" onClick={e => e.stopPropagation()}>
            <div className="esk-modal-header">
              <h3>Faculty Profile</h3>
              <button type="button" className="esk-modal-close" onClick={() => setViewingTeacher(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="esk-modal-body">
              <div className="esk-view-avatar-header">
                <TeacherAvatarSvg name={viewingTeacher.name} size={96} />
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#09090b', margin: '16px 0 4px 0' }}>
                  {viewingTeacher.name}
                </h2>
                <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '4px 12px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 700 }}>
                  {viewingTeacher.subject}
                </span>
              </div>

              <div className="esk-view-detail-grid">
                <div className="esk-view-detail-item">
                  <div className="esk-view-detail-label">Email Address</div>
                  <div className="esk-view-detail-val" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Mail size={14} style={{ color: '#94a3b8' }}/> {viewingTeacher.email}
                  </div>
                </div>
                <div className="esk-view-detail-item">
                  <div className="esk-view-detail-label">Phone</div>
                  <div className="esk-view-detail-val" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Phone size={14} style={{ color: '#94a3b8' }}/> {viewingTeacher.phone || 'N/A'}
                  </div>
                </div>
                <div className="esk-view-detail-item">
                  <div className="esk-view-detail-label">Assigned Class</div>
                  <div className="esk-view-detail-val" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <BookOpen size={14} style={{ color: '#94a3b8' }}/> {viewingTeacher.assignedClass || 'None'}
                  </div>
                </div>
                <div className="esk-view-detail-item">
                  <div className="esk-view-detail-label">System Role</div>
                  <div className="esk-view-detail-val" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheck size={14} style={{ color: '#10b981' }}/> Faculty
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24, borderTop: '1px solid #f4f4f5', paddingTop: 20 }}>
                <button
                  type="button"
                  className="admin-btn-dark"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 42 }}
                  onClick={() => {
                    setViewingTeacher(null);
                    handleOpenEdit(viewingTeacher);
                  }}
                >
                  <Pencil size={16} /> Edit Profile
                </button>
                <button
                  type="button"
                  style={{ flex: 1, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 42, cursor: 'pointer' }}
                  onClick={() => handleDelete(viewingTeacher._id, viewingTeacher.name)}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
