import React, { useState, useEffect } from 'react';

const CLASS_SUBJECTS = {
  'Class 5': ['English', 'Nepali', 'Math', 'Science', 'Social', 'Computer'],
  'Class 6': ['English', 'Nepali', 'Math', 'Science', 'Social', 'Computer'],
  'Class 7': ['English', 'Nepali', 'Math', 'Science', 'Social', 'Computer'],
  'Class 8': ['English', 'Nepali', 'Math', 'Science', 'Social', 'Computer'],
  'Class 9': ['English', 'Nepali', 'Math', 'Science', 'Social', 'Computer', 'Optional Math', 'Account'],
  'Class 10': ['English', 'Nepali', 'Math', 'Science', 'Social', 'Computer', 'Optional Math', 'Account'],
};

export default function AdminClasses() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    // Fetch students and compute counts per class
    fetch('http://localhost:5000/api/students')
      .then(r => r.json())
      .then(students => {
        const c = {};
        students.forEach(s => { c[s.class] = (c[s.class] || 0) + 1; });
        setCounts(c);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="admin-page-content">
      <div className="admin-page-header">
        <h1>Classes</h1>
        <p>Class 5 to Class 10</p>
      </div>
      <div className="admin-classes-grid">
        {Object.entries(CLASS_SUBJECTS).map(([cls, subjects]) => (
          <div key={cls} className="admin-class-card">
            <div className="admin-class-card-header">
              <h3><i className="ri-book-open-line"></i> {cls}</h3>
              <span className="badge">{counts[cls] || 0} students</span>
            </div>
            <p className="admin-class-subtitle">Subjects:</p>
            <div className="admin-class-subjects">
              {subjects.map(s => <span key={s} className="admin-subject-tag">{s}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
