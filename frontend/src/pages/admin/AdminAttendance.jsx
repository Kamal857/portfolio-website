import React, { useState, useEffect } from 'react';

const CLASSES = ['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];

export default function AdminAttendance() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedClass, setSelectedClass] = useState('Class 5');
  const [selectedDate, setSelectedDate] = useState(today);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [saved, setSaved] = useState(false);

  // Load students for the selected class
  useEffect(() => {
    fetch(`https://portfolio-website-os0q.onrender.com/api/students?class=${encodeURIComponent(selectedClass)}`)
      .then(r => r.json())
      .then(data => {
        setStudents(data);
        // Default everyone to Present
        const def = {};
        data.forEach(s => { def[s.studentId] = 'Present'; });
        setAttendance(def);
        setSaved(false);
      })
      .catch(() => {});
  }, [selectedClass]);

  // Load existing attendance for the date
  useEffect(() => {
    fetch(`https://portfolio-website-os0q.onrender.com/api/attendance?class=${encodeURIComponent(selectedClass)}&date=${selectedDate}`)
      .then(r => r.json())
      .then(records => {
        if (records.length > 0) {
          const map = {};
          records.forEach(r => { map[r.studentId] = r.status; });
          setAttendance(prev => ({ ...prev, ...map }));
        }
      })
      .catch(() => {});
  }, [selectedClass, selectedDate]);

  const toggle = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
    setSaved(false);
  };

  const markAll = (status) => {
    const all = {};
    students.forEach(s => { all[s.studentId] = status; });
    setAttendance(all);
    setSaved(false);
  };

  const handleSave = async () => {
    const records = students.map(s => ({
      studentId: s.studentId,
      studentName: s.name,
      class: selectedClass,
      date: selectedDate,
      status: attendance[s.studentId] || 'Absent',
    }));
    const res = await fetch('https://portfolio-website-os0q.onrender.com/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ records }),
    });
    if (res.ok) setSaved(true);
  };

  return (
    <div className="admin-page-content">
      <div className="admin-page-header">
        <h1>Attendance</h1>
      </div>

      <div className="admin-table-controls" style={{ marginBottom: 16 }}>
        <select className="admin-dropdown" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
          {CLASSES.map(c => <option key={c}>{c}</option>)}
        </select>
        <div className="admin-date-picker">
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        </div>
      </div>

      <div className="admin-table-container">
        <div className="admin-attendance-header">
          <h3>{selectedClass} — {selectedDate}</h3>
          <div className="admin-attendance-actions">
            <button className="btn-outline" onClick={() => markAll('Present')}>All Present</button>
            <button className="btn-outline" onClick={() => markAll('Absent')}>All Absent</button>
            <button className="admin-btn-dark" onClick={handleSave} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
              {saved ? '✓ Saved' : 'Save Attendance'}
            </button>
          </div>
        </div>

        {students.length === 0 ? (
          <div className="admin-table-empty">No students in this class</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Student ID</th><th>Name</th><th>Roll No</th><th>Status</th></tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id}>
                  <td style={{ fontWeight: 600, color: '#0284c7' }}>{s.studentId}</td>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td>{s.rollNo}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => toggle(s.studentId, 'Present')}
                        style={{ padding: '4px 12px', borderRadius: 6, border: '1.5px solid', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                          background: attendance[s.studentId] === 'Present' ? '#dcfce7' : '#fff',
                          color: attendance[s.studentId] === 'Present' ? '#16a34a' : '#aaa',
                          borderColor: attendance[s.studentId] === 'Present' ? '#16a34a' : '#ddd' }}>
                        Present
                      </button>
                      <button
                        onClick={() => toggle(s.studentId, 'Absent')}
                        style={{ padding: '4px 12px', borderRadius: 6, border: '1.5px solid', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                          background: attendance[s.studentId] === 'Absent' ? '#fee2e2' : '#fff',
                          color: attendance[s.studentId] === 'Absent' ? '#dc2626' : '#aaa',
                          borderColor: attendance[s.studentId] === 'Absent' ? '#dc2626' : '#ddd' }}>
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
