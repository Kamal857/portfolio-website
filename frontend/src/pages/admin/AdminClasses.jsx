import React, { useState, useEffect } from 'react';
import {
  Plus, Pencil, Trash2, Clock, Users, BookOpen,
  GraduationCap, DollarSign, X, RotateCw, Calendar,
  MapPin, CheckCircle, AlertCircle, Tag
} from 'lucide-react';
import { API } from '../../config';

const CLASS_OPTIONS = [
  'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
];
const SUBJECT_OPTIONS = [
  'English', 'Nepali', 'Mathematics', 'Science', 'Social', 'Computer',
  'Optional Math', 'Account', 'Economics', 'History', 'Physics', 'Chemistry', 'Biology'
];
const STATUS_OPTIONS = ['Active', 'Upcoming', 'Completed'];
const DAYS_OPTIONS = [
  'Sun - Fri', 'Mon - Fri', 'Sat - Thu', 'Daily (Sun - Sat)', 'Mon - Sat', 'Weekends Only'
];

// ── Generate AM/PM time options in 30-min steps ──────────────────
function buildTimeOptions() {
  const times = [];
  for (let h = 5; h <= 21; h++) {
    ['00', '30'].forEach(m => {
      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const period = h < 12 ? 'AM' : 'PM';
      times.push(`${String(hour12).padStart(2, '0')}:${m} ${period}`);
    });
  }
  return times;
}
const TIME_OPTIONS = buildTimeOptions();

const STATUS_CONFIG = {
  Active: { bg: '#dcfce7', text: '#166534', border: '#bbf7d0', icon: CheckCircle },
  Upcoming: { bg: '#fef9c3', text: '#854d0e', border: '#fde047', icon: AlertCircle },
  Completed: { bg: '#f3f4f6', text: '#374151', border: '#d1d5db', icon: CheckCircle }
};

const EMPTY_FORM = {
  name: '',
  className: 'Class 10',
  maxStudents: 30,
  subjects: [],
  assignedTeacher: '',
  fee: '',
  startTime: '07:00 AM',
  endTime: '09:00 AM',
  days: 'Sun - Fri',
  room: '',
  status: 'Active',
  description: ''
};

export default function AdminBatches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All Classes');

  const [showModal, setShowModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [subjectInput, setSubjectInput] = useState('');

  const fetchBatches = async () => {
    setLoading(true);
    setIsRotating(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (classFilter !== 'All Classes') params.append('class', classFilter);
      const res = await fetch(`${API}/api/batches?${params}`);
      const data = await res.json();
      setBatches(Array.isArray(data) ? data : []);
    } catch {
      setBatches([]);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRotating(false), 500);
    }
  };

  useEffect(() => { fetchBatches(); }, [search, classFilter]);

  const handleOpenAdd = () => {
    setEditingBatch(null);
    setForm(EMPTY_FORM);
    setMsg({ text: '', type: '' });
    setSubjectInput('');
    setShowModal(true);
  };

  const handleOpenEdit = (batch) => {
    setEditingBatch(batch);
    setForm({
      name: batch.name || '',
      className: batch.className || 'Class 10',
      maxStudents: batch.maxStudents || 30,
      subjects: Array.isArray(batch.subjects) ? [...batch.subjects] : [],
      assignedTeacher: batch.assignedTeacher || '',
      fee: batch.fee !== undefined ? String(batch.fee) : '',
      startTime: batch.startTime || '07:00 AM',
      endTime: batch.endTime || '09:00 AM',
      days: batch.days || 'Sun - Fri',
      room: batch.room || '',
      status: batch.status || 'Active',
      description: batch.description || ''
    });
    setMsg({ text: '', type: '' });
    setSubjectInput('');
    setShowModal(true);
  };

  const toggleSubject = (subject) => {
    setForm(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const addCustomSubject = () => {
    const trimmed = subjectInput.trim();
    if (trimmed && !form.subjects.includes(trimmed)) {
      setForm(prev => ({ ...prev, subjects: [...prev.subjects, trimmed] }));
    }
    setSubjectInput('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setMsg({ text: 'Batch name is required.', type: 'error' });
      return;
    }
    try {
      const isEditing = !!editingBatch;
      const url = isEditing
        ? `${API}/api/batches/${editingBatch._id}`
        : `${API}/api/batches`;
      const method = isEditing ? 'PUT' : 'POST';

      const payload = {
        ...form,
        fee: form.fee !== '' ? Number(form.fee) : 0,
        maxStudents: Number(form.maxStudents)
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        setMsg({ text: isEditing ? 'Batch updated!' : 'Batch created!', type: 'success' });
        setTimeout(() => {
          setShowModal(false);
          setEditingBatch(null);
          fetchBatches();
        }, 600);
      } else {
        setMsg({ text: data.message || 'Error saving batch.', type: 'error' });
      }
    } catch {
      setMsg({ text: 'Network error. Try again.', type: 'error' });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete batch "${name}"?`)) return;
    await fetch(`${API}/api/batches/${id}`, { method: 'DELETE' });
    fetchBatches();
  };

  const capacityPct = (enrolled, max) =>
    max > 0 ? Math.min(Math.round((enrolled / max) * 100), 100) : 0;

  return (
    <div className="admin-page-content">

      {/* ── Breadcrumb ─────────────────────────────────── */}
      <div className="esk-breadcrumb-card">
        <div className="esk-breadcrumb-left">
          <div className="esk-breadcrumb-icon">
            <GraduationCap size={18} />
          </div>
          <span className="esk-breadcrumb-title">Batches</span>
          <span className="esk-breadcrumb-sep">&gt;</span>
          <span className="esk-breadcrumb-sub">All Batches</span>
        </div>
        <button
          type="button"
          className="esk-reload-btn"
          onClick={fetchBatches}
          title="Reload"
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

      {/* ── Search / Filter / Add ──────────────────────── */}
      <div className="esk-filter-card">
        <div className="esk-filter-grid">
          <div className="esk-filter-group">
            <label className="esk-filter-label">SEARCH BATCH</label>
            <input
              type="text"
              className="esk-filter-input"
              placeholder="Type batch name, teacher, or class..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="esk-filter-group">
            <label className="esk-filter-label">FILTER BY CLASS</label>
            <select
              className="esk-filter-select"
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
            >
              <option value="All Classes">-- All Classes --</option>
              {CLASS_OPTIONS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button type="button" className="esk-add-btn" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>Add Batch</span>
          </button>
        </div>
      </div>

      {/* ── Stats Bar ──────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap'
      }}>
        {[
          { label: 'Total Batches', value: batches.length, icon: Tag, accent: '#09090b' },
          { label: 'Active', value: batches.filter(b => b.status === 'Active').length, icon: CheckCircle, accent: '#16a34a' },
          { label: 'Upcoming', value: batches.filter(b => b.status === 'Upcoming').length, icon: AlertCircle, accent: '#d97706' },
          { label: 'Total Seats', value: batches.reduce((s, b) => s + (b.maxStudents || 0), 0), icon: Users, accent: '#2563eb' },
        ].map(({ label, value, icon: Icon, accent }) => (
          <div key={label} style={{
            flex: '1 1 140px',
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: 12,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: accent + '18', color: accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <Icon size={18} />
            </div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#09090b', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 600, marginTop: 2 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Batch Cards Grid ───────────────────────────── */}
      {batches.length === 0 ? (
        <div style={{
          background: '#ffffff', border: '1px solid #e4e4e7', borderRadius: 16,
          padding: '56px 24px', textAlign: 'center', color: '#71717a'
        }}>
          <GraduationCap size={48} style={{ margin: '0 auto 14px', color: '#a1a1aa' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#09090b', marginBottom: 6 }}>
            No Batches Found
          </h3>
          <p style={{ fontSize: '0.88rem', margin: '0 0 18px' }}>
            Add a batch to get started.
          </p>
          <button className="esk-add-btn" onClick={handleOpenAdd}>
            <Plus size={16} /> Add First Batch
          </button>
        </div>
      ) : (
        <div className="admin-batches-grid">
          {batches.map(batch => {
            const enrolled = batch.enrolledStudents || 0;
            const pct = capacityPct(enrolled, batch.maxStudents);
            const StatusIcon = STATUS_CONFIG[batch.status]?.icon || CheckCircle;
            const statusCfg = STATUS_CONFIG[batch.status] || STATUS_CONFIG.Active;

            return (
              <div key={batch._id} className="admin-batch-card">

                {/* Header */}
                <div className="admin-batch-card-header">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 className="admin-batch-title">{batch.name}</h3>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                      <span className="admin-batch-class-pill">
                        <BookOpen size={12} /> {batch.className}
                      </span>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '4px 10px',
                        background: statusCfg.bg,
                        color: statusCfg.text,
                        border: `1px solid ${statusCfg.border}`,
                        borderRadius: 20,
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        <StatusIcon size={11} /> {batch.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timing Bar */}
                <div className="admin-batch-timing-bar">
                  <Clock size={14} style={{ color: '#64748b', flexShrink: 0 }} />
                  <span>{batch.startTime} — {batch.endTime}</span>
                  <span style={{ color: '#94a3b8', fontWeight: 400 }}>·</span>
                  <Calendar size={13} style={{ color: '#64748b' }} />
                  <span>{batch.days}</span>
                  {batch.room && (
                    <>
                      <span style={{ color: '#94a3b8', fontWeight: 400 }}>·</span>
                      <MapPin size={12} style={{ color: '#64748b' }} />
                      <span>{batch.room}</span>
                    </>
                  )}
                </div>

                {/* Detail Grid */}
                <div className="admin-batch-details-grid">
                  <div className="admin-batch-stat-box">
                    <div className="admin-batch-stat-label">
                      <GraduationCap size={12} /> Teacher
                    </div>
                    <div className="admin-batch-stat-val" style={{ fontSize: '0.85rem' }}>
                      {batch.assignedTeacher || '—'}
                    </div>
                  </div>

                  <div className="admin-batch-stat-box">
                    <div className="admin-batch-stat-label">
                      <Users size={12} /> Capacity
                    </div>
                    <div className="admin-batch-stat-val">
                      {enrolled} / {batch.maxStudents}
                    </div>
                    <div className="admin-batch-capacity-bar">
                      <div
                        className="admin-batch-capacity-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Subjects */}
                {batch.subjects && batch.subjects.length > 0 && (
                  <div className="admin-batch-subjects-wrap">
                    <div className="admin-batch-subjects-label">Subjects ({batch.subjects.length})</div>
                    <div className="admin-batch-tags">
                      {batch.subjects.slice(0, 5).map(s => (
                        <span key={s} className="admin-batch-tag">{s}</span>
                      ))}
                      {batch.subjects.length > 5 && (
                        <span className="admin-batch-tag">+{batch.subjects.length - 5} more</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="admin-batch-footer">
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#71717a', fontWeight: 600, marginBottom: 2 }}>
                      ENROLLMENT FEE
                    </div>
                    <div className="admin-batch-fee-tag">
                      {batch.fee > 0 ? `Rs. ${Number(batch.fee).toLocaleString()}` : 'Free'}
                    </div>
                  </div>
                  <div className="admin-batch-actions">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(batch)}
                      className="esk-action-btn edit"
                      title="Edit Batch"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(batch._id, batch.name)}
                      className="esk-action-btn delete"
                      title="Delete Batch"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add New Batch card */}
          <div
            className="esk-add-card"
            style={{ minHeight: 280 }}
            onClick={handleOpenAdd}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && handleOpenAdd()}
          >
            <div className="esk-add-card-circle">
              <Plus size={26} strokeWidth={2.5} />
            </div>
            <h4 className="esk-add-card-title">Add New</h4>
            <span className="esk-add-card-sub">Batch</span>
          </div>
        </div>
      )}

      {/* ── Add / Edit Batch Modal ─────────────────────── */}
      {showModal && (
        <div
          className="esk-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="esk-modal-container"
            style={{ maxWidth: 680 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="esk-modal-header">
              <h3>{editingBatch ? 'Edit Batch' : 'Add New Batch'}</h3>
              <button
                type="button"
                className="esk-modal-close"
                onClick={() => setShowModal(false)}
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

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Batch Name */}
                <div>
                  <label className="admin-label">Batch Name *</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Class 10 – Morning Excellence Batch"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                {/* Class + Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="admin-label">Class *</label>
                    <select
                      className="admin-input"
                      value={form.className}
                      onChange={e => setForm({ ...form, className: e.target.value })}
                      required
                    >
                      {CLASS_OPTIONS.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="admin-label">Status</label>
                    <select
                      className="admin-input"
                      value={form.status}
                      onChange={e => setForm({ ...form, status: e.target.value })}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Max Students + Fee */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="admin-label">Max Students</label>
                    <input
                      type="number"
                      className="admin-input"
                      placeholder="e.g. 30"
                      min={1}
                      value={form.maxStudents}
                      onChange={e => setForm({ ...form, maxStudents: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Enrollment Fee (Rs.)</label>
                    <input
                      type="number"
                      className="admin-input"
                      placeholder="e.g. 5500"
                      min={0}
                      value={form.fee}
                      onChange={e => setForm({ ...form, fee: e.target.value })}
                    />
                  </div>
                </div>

                {/* Assigned Teacher + Room */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="admin-label">Assign Teacher</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Kamal Bohara"
                      value={form.assignedTeacher}
                      onChange={e => setForm({ ...form, assignedTeacher: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Room / Location</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Hall A – Room 101"
                      value={form.room}
                      onChange={e => setForm({ ...form, room: e.target.value })}
                    />
                  </div>
                </div>

                {/* Timing — AM/PM dropdowns */}
                <div>
                  <label className="admin-label">
                    <Clock size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    Class Timing
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr 1fr', gap: 10, alignItems: 'center' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: '#71717a', fontWeight: 600, display: 'block', marginBottom: 4 }}>START TIME</label>
                      <select
                        className="admin-input"
                        value={form.startTime}
                        onChange={e => setForm({ ...form, startTime: e.target.value })}
                      >
                        {TIME_OPTIONS.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ fontWeight: 700, color: '#71717a', paddingTop: 18, fontSize: '1.1rem' }}>→</div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: '#71717a', fontWeight: 600, display: 'block', marginBottom: 4 }}>END TIME</label>
                      <select
                        className="admin-input"
                        value={form.endTime}
                        onChange={e => setForm({ ...form, endTime: e.target.value })}
                      >
                        {TIME_OPTIONS.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: '#71717a', fontWeight: 600, display: 'block', marginBottom: 4 }}>DAYS</label>
                      <select
                        className="admin-input"
                        value={form.days}
                        onChange={e => setForm({ ...form, days: e.target.value })}
                      >
                        {DAYS_OPTIONS.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Subjects — toggle chips */}
                <div>
                  <label className="admin-label">
                    <BookOpen size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    Subjects to be Taught
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                    {SUBJECT_OPTIONS.map(sub => {
                      const active = form.subjects.includes(sub);
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => toggleSubject(sub)}
                          style={{
                            padding: '5px 13px',
                            borderRadius: 20,
                            border: `1.5px solid ${active ? '#09090b' : '#e4e4e7'}`,
                            background: active ? '#09090b' : '#fafafa',
                            color: active ? '#ffffff' : '#52525b',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {sub}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom subject input */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Add custom subject..."
                      value={subjectInput}
                      onChange={e => setSubjectInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSubject(); } }}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={addCustomSubject}
                      style={{ whiteSpace: 'nowrap', padding: '9px 16px' }}
                    >
                      + Add
                    </button>
                  </div>

                  {/* Selected chips list */}
                  {form.subjects.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                      {form.subjects.map(s => (
                        <span
                          key={s}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '3px 10px',
                            background: '#09090b', color: '#ffffff',
                            borderRadius: 20, fontSize: '0.78rem', fontWeight: 600
                          }}
                        >
                          {s}
                          <button
                            type="button"
                            onClick={() => setForm(prev => ({
                              ...prev,
                              subjects: prev.subjects.filter(x => x !== s)
                            }))}
                            style={{
                              background: 'none', border: 'none',
                              color: '#ffffff', cursor: 'pointer',
                              padding: 0, display: 'flex', alignItems: 'center'
                            }}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="admin-label">Description (optional)</label>
                  <textarea
                    className="admin-input"
                    placeholder="Briefly describe this batch..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-dark">
                    {editingBatch ? 'Update Batch' : 'Save Batch'}
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
