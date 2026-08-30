import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, classes: 6, notices: 0 });

  useEffect(() => {
    fetch('http://localhost:5000/api/stats')
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Students', value: stats.students, icon: 'ri-group-line', color: 'blue' },
    { label: 'Total Teachers', value: stats.teachers, icon: 'ri-user-settings-line', color: 'green' },
    { label: 'Total Classes', value: stats.classes, icon: 'ri-book-open-line', color: 'purple' },
    { label: 'Notices', value: stats.notices, icon: 'ri-notification-3-line', color: 'orange' },
  ];

  return (
    <div className="admin-page-content">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Admin Overview</p>
      </div>
      <div className="admin-stats-grid">
        {cards.map((card) => (
          <div key={card.label} className="admin-stat-card">
            <div className="admin-stat-header">
              <h3>{card.label}</h3>
              <div className={`admin-stat-icon ${card.color}`}><i className={card.icon}></i></div>
            </div>
            <p className="admin-stat-value">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
