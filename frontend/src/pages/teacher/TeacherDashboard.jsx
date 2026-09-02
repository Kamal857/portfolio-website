import React, { useState, useEffect } from "react";
import { API } from "../../config";

function computeStatus(date, time, duration) {
  const map = { "30 Min":30,"45 Min":45,"1 Hour":60,"1.5 Hours":90,"2 Hours":120,"3 Hours":180 };
  if (!date || !time) return "Upcoming";
  try {
    const start = new Date(`${date}T${time}`);
    const end   = new Date(start.getTime() + (map[duration]||60)*60000);
    const now   = new Date();
    if (now < start) return "Upcoming";
    if (now <= end)  return "Ongoing";
    return "Completed";
  } catch { return "Upcoming"; }
}

export default function TeacherDashboard() {
  const email = localStorage.getItem("teacherEmail") || "";
  const [profile, setProfile]   = useState({ name:"", subject:"", assignedClass:"" });
  const [students, setStudents] = useState([]);
  const [tests, setTests]       = useState([]);
  const [notices, setNotices]   = useState([]);

  useEffect(() => {
    fetch(`${API}/api/teacher/profile/${encodeURIComponent(email)}`).then(r=>r.json()).then(d=>{ if(d.name) setProfile(d); }).catch(()=>{});
    fetch(`${API}/api/students`).then(r=>r.json()).then(d=>setStudents(Array.isArray(d)?d:[])).catch(()=>{});
    fetch(`${API}/api/tests`).then(r=>r.json()).then(d=>setTests(Array.isArray(d)?d:[])).catch(()=>{});
    fetch(`${API}/api/notices`).then(r=>r.json()).then(d=>setNotices(Array.isArray(d)?d:[])).catch(()=>{});
  }, [email]);

  const myStudents = profile.assignedClass ? students.filter(s => s.class === profile.assignedClass) : students;
  const myTests    = tests.filter(t => t.subject === profile.subject || t.testType === "mixed");
  const upcoming   = myTests.filter(t => computeStatus(t.date,t.time,t.duration) === "Upcoming");

  const cards = [
    { label:"My Students",    value:myStudents.length, icon:"ri-team-line",           color:"#0284c7", bg:"#e0f2fe" },
    { label:"Total Tests",    value:myTests.length,    icon:"ri-file-list-3-line",     color:"#7c3aed", bg:"#ede9fe" },
    { label:"Upcoming Tests", value:upcoming.length,   icon:"ri-time-line",            color:"#b45309", bg:"#fef9c3" },
    { label:"Notices",        value:notices.length,    icon:"ri-notification-3-line",  color:"#059669", bg:"#d1fae5" },
  ];

  return (
    <div className="admin-page-content">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {profile.name || "Teacher"} — {profile.subject} {profile.assignedClass && `· ${profile.assignedClass}`}</p>
      </div>

      <div className="admin-stats-grid">
        {cards.map(c => (
          <div key={c.label} className="admin-stat-card">
            <div className="admin-stat-header">
              <h3>{c.label}</h3>
              <div style={{ width:40,height:40,borderRadius:"50%",background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",color:c.color,fontSize:"1.2rem" }}>
                <i className={c.icon} />
              </div>
            </div>
            <p className="admin-stat-value" style={{ color:c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Tests */}
      <div style={{ marginTop:28 }}>
        <h2 style={{ fontWeight:700, color:"#1e293b", fontSize:"1.1rem", marginBottom:14 }}>Upcoming Tests</h2>
        {upcoming.length === 0 ? (
          <p style={{ color:"#94a3b8" }}>No upcoming tests.</p>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
            {upcoming.slice(0,6).map(t => (
              <div key={t._id} style={{ background:"#fff", borderRadius:12, padding:"16px 20px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", borderLeft:"4px solid #0ea5e9" }}>
                <p style={{ margin:0, fontWeight:700, color:"#1e293b" }}>{t.title}</p>
                <p style={{ margin:"4px 0 0", fontSize:"0.85rem", color:"#64748b" }}>{t.class} · {t.date} · {t.time}</p>
                <p style={{ margin:"4px 0 0", fontSize:"0.8rem", color:"#0ea5e9", fontWeight:600 }}>{Array.isArray(t.subjects)&&t.subjects.length?t.subjects.join(", "):t.subject}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Notices */}
      <div style={{ marginTop:28 }}>
        <h2 style={{ fontWeight:700, color:"#1e293b", fontSize:"1.1rem", marginBottom:14 }}>Recent Notices</h2>
        {notices.length === 0 ? (
          <p style={{ color:"#94a3b8" }}>No notices yet.</p>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {notices.slice(0,4).map(n => (
              <div key={n._id} style={{ background:"#fff", borderRadius:10, padding:"14px 18px", boxShadow:"0 2px 8px rgba(0,0,0,0.05)", borderLeft:"4px solid #f59e0b" }}>
                <p style={{ margin:0, fontWeight:700, color:"#1e293b" }}>{n.title}</p>
                <p style={{ margin:"4px 0 0", fontSize:"0.85rem", color:"#64748b" }}>{n.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
