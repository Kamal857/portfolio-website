import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Trash2, Pencil, Eye, GraduationCap,
  RotateCw, X, User, Phone, ShieldCheck, Hash, BookOpen
} from 'lucide-react';
import { API } from '../../config';

const CLASSES = ['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];

export function StudentAvatarSvg({ name = '', size = 84 }) {
  const charCode = (name || 'A').charCodeAt(0) + (name || 'A').charCodeAt((name || 'A').length - 1 || 0);
  const bgColors = ['#f1f5f9', '#eff6ff', '#f0fdf4', '#faf5ff', '#fff1f2', '#f0fdfa'];
  const shirtColors = ['#09090b', '#0284c7', '#2563eb', '#059669', '#4f46e5', '#d97706'];
  const bg = bgColors[charCode % bgColors.length];
  const shirt = shirtColors[charCode % shirtColors.length];

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="esk-student-avatar-svg">
      <circle cx="50" cy="50" r="50" fill={bg} />
      {/* Hair back */}
      <path d="M28 44 C26 28 34 16 50 16 C66 16 74 28 72 44 Z" fill="#1e293b" />
      {/* Neck */}
      <rect x="44" y="55" width="12" height="15" rx="2" fill="#fbc08d" />
      {/* Shirt */}
      <path d="M20 88 C20 68 34 64 50 64 C66 64 80 68 80 88 Z" fill={shirt} />
      {/* Shirt Collar V-neck */}
      <path d="M44 64 L50 73 L56 64 Z" fill="#ffffff" opacity="0.95" />
      {/* Face */}
      <ellipse cx="50" cy="42" rx="17" ry="19" fill="#fed7aa" />
      {/* Hair front / stylish cut */}
      <path d="M31 34 C33 20 45 18 50 18 C61 18 69 23 69 35 C65 29 58 30 52 27 C46 32 39 32 31 34 Z" fill="#1e293b" />
      {/* Ears */}
      <circle cx="33" cy="43" r="3.5" fill="#fbc08d" />
      <circle cx="67" cy="43" r="3.5" fill="#fbc08d" />
      {/* Eyes */}
      <circle cx="43" cy="41" r="2.2" fill="#0f172a" />
      <circle cx="57" cy="41" r="2.2" fill="#0f172a" />
      {/* Eyebrows */}
      <path d="M40 36 C42 34 45 35 46 36" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M54 36 C55 35 58 34 60 36" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" />
      {/* Smile */}
      <path d="M46 50 C48 53 52 53 54 50" stroke="#9a3412" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All Classes');
  const [isRotating, setIsRotating] = useState(false);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);

  // Form data
  const [form, setForm] = useState({
    studentId: '',
    name: '',
    class: 'Class 5',
    rollNo: '',
    guardian: '',
    phone: ''
  });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchStudents = async () => {
    setLoading(true);
    setIsRotating(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (classFilter !== 'All Classes' && classFilter !== '-- Select a class --') {
        params.append('class', classFilter);
      }
      const res = await fetch(`${API}/api/students?${params}`);
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setStudents([]);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRotating(false), 500);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, classFilter]);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setForm({ studentId: '', name: '', class: 'Class 5', rollNo: '', guardian: '', phone: '' });
    setMsg({ text: '', type: '' });
    setShowAddModal(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setForm({
      studentId: student.studentId || '',
      name: student.name || '',
      class: student.class || 'Class 5',
      rollNo: student.rollNo || '',
      guardian: student.guardian || '',
      phone: student.phone || ''
    });
    setMsg({ text: '', type: '' });
    setShowAddModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const isEditing = !!editingStudent;
      const url = isEditing ? `${API}/api/students/${editingStudent._id}` : `${API}/api/students`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (res.ok) {
        setMsg({ text: isEditing ? 'Student updated successfully!' : 'Student added successfully!', type: 'success' });
        setTimeout(() => {
          setShowAddModal(false);
          setEditingStudent(null);
          fetchStudents();
        }, 600);
      } else {
        setMsg({ text: data.message || 'Error processing request', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Network error occurred.', type: 'error' });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete student "${name || 'selected'}"?`)) return;
    try {
      await fetch(`${API}/api/students/${id}`, { method: 'DELETE' });
      fetchStudents();
      if (viewingStudent && viewingStudent._id === id) {
        setViewingStudent(null);
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
          <div className="esk-breadcrumb-icon">
            <GraduationCap size={18} />
          </div>
          <span className="esk-breadcrumb-title">Students</span>
          <span className="esk-breadcrumb-sep">&gt;</span>
          <span className="esk-breadcrumb-sub">All Students</span>
        </div>
        <button
          type="button"
          className="esk-reload-btn"
          onClick={fetchStudents}
          title="Reload students list"
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
        <div className="esk-filter-grid">
          <div className="esk-filter-group">
            <label className="esk-filter-label">SEARCH STUDENT</label>
            <input
              type="text"
              className="esk-filter-input"
              placeholder="Type student name or reg number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="esk-filter-group">
            <label className="esk-filter-label">FILTER BY CLASS</label>
            <select
              className="esk-filter-select"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            >
              <option value="All Classes">-- Select a class --</option>
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="esk-add-btn"
            onClick={handleOpenAdd}
          >
            <Plus size={18} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* 3. Students Grid */}
      <div className="esk-students-grid">
        {students.map((student) => (
          <div key={student._id} className="esk-student-card">
            <div className="esk-student-avatar-wrap">
              <StudentAvatarSvg name={student.name} size={84} />
            </div>

            <h3 className="esk-student-name" title={student.name}>
              {student.name}
            </h3>

            <p className="esk-student-sub">
              {student.rollNo ? (student.rollNo.length <= 2 ? student.rollNo : `Roll ${student.rollNo}`) : '01'}
            </p>

            <span className="esk-student-meta-badge">
              {student.class} {student.studentId && `· ${student.studentId}`}
            </span>

            <div className="esk-student-actions">
              <button
                type="button"
                className="esk-action-btn view"
                onClick={() => setViewingStudent(student)}
                title="View Student Details"
                aria-label="View student details"
              >
                <Eye size={16} />
              </button>

              <button
                type="button"
                className="esk-action-btn edit"
                onClick={() => handleOpenEdit(student)}
                title="Edit Student"
                aria-label="Edit student"
              >
                <Pencil size={15} />
              </button>

              <button
                type="button"
                className="esk-action-btn delete"
                onClick={() => handleDelete(student._id, student.name)}
                title="Delete Student"
                aria-label="Delete student"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        {/* Dashed Add New Student Card */}
        <div
          className="esk-add-card"
          onClick={handleOpenAdd}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleOpenAdd()}
          title="Add New Student"
        >
          <div className="esk-add-card-circle">
            <Plus size={26} strokeWidth={2.5} />
          </div>
          <h4 className="esk-add-card-title">Add New</h4>
          <span className="esk-add-card-sub">Student</span>
        </div>
      </div>

      {/* View Student Modal */}
      {viewingStudent && (
        <div className="esk-modal-overlay" onClick={() => setViewingStudent(null)}>
          <div className="esk-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="esk-modal-header">
              <h3>Student Details</h3>
              <button
                type="button"
                className="esk-modal-close"
                onClick={() => setViewingStudent(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="esk-modal-body">
              <div className="esk-view-avatar-header">
                <div className="esk-student-avatar-wrap" style={{ width: 96, height: 96, marginBottom: 12 }}>
                  <StudentAvatarSvg name={viewingStudent.name} size={96} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 4px 0', color: '#09090b' }}>
                  {viewingStudent.name}
                </h3>
                <span className="esk-student-meta-badge" style={{ fontSize: '0.8rem', padding: '4px 12px' }}>
                  {viewingStudent.class} · Roll #{viewingStudent.rollNo || '01'}
                </span>
              </div>

              <div className="esk-view-detail-grid">
                <div className="esk-view-detail-item">
                  <div className="esk-view-detail-label">Student ID</div>
                  <div className="esk-view-detail-val">{viewingStudent.studentId || '—'}</div>
                </div>

                <div className="esk-view-detail-item">
                  <div className="esk-view-detail-label">Class</div>
                  <div className="esk-view-detail-val">{viewingStudent.class || '—'}</div>
                </div>

                <div className="esk-view-detail-item">
                  <div className="esk-view-detail-label">Roll Number</div>
                  <div className="esk-view-detail-val">{viewingStudent.rollNo || '—'}</div>
                </div>

                <div className="esk-view-detail-item">
                  <div className="esk-view-detail-label">Guardian / Parent</div>
                  <div className="esk-view-detail-val">{viewingStudent.guardian || '—'}</div>
                </div>

                <div className="esk-view-detail-item" style={{ gridColumn: '1 / -1' }}>
                  <div className="esk-view-detail-label">Contact Phone</div>
                  <div className="esk-view-detail-val">{viewingStudent.phone || '—'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="admin-btn-dark"
                  onClick={() => {
                    const studentToEdit = viewingStudent;
                    setViewingStudent(null);
                    handleOpenEdit(studentToEdit);
                  }}
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  <Pencil size={14} /> Edit Student
                </button>
                <button
                  type="button"
                  onClick={() => setViewingStudent(null)}
                  className="btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {showAddModal && (
        <div className="esk-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="esk-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="esk-modal-header">
              <h3>{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
              <button
                type="button"
                className="esk-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="esk-modal-body">
              {msg.text && (
                <div className={`admin-form-message ${msg.type}`} style={{ marginBottom: 16 }}>
                  {msg.text}
                </div>
              )}

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="admin-label">Student ID *</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. STU001"
                      value={form.studentId}
                      onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="admin-label">Roll No *</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. 01"
                      value={form.rollNo}
                      onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="admin-label">Full Name *</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Pranish Bohara"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="admin-label">Class *</label>
                  <select
                    className="admin-input"
                    value={form.class}
                    onChange={(e) => setForm({ ...form, class: e.target.value })}
                    required
                  >
                    {CLASSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="admin-label">Guardian / Parent Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Kamal Bohara"
                    value={form.guardian}
                    onChange={(e) => setForm({ ...form, guardian: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-label">Phone Number</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. +977 9800000000"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-dark">
                    {editingStudent ? 'Update Student' : 'Save Student'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

