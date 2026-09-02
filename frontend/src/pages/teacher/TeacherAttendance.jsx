import React, { useState, useEffect } from "react";
const API = "http://localhost:5000";
const CLASSES = ["Class 5","Class 6","Class 7","Class 8","Class 9","Class 10"];

export default function TeacherAttendance() {
  const email = localStorage.getItem("teacherEmail") || "";
  const [assignedClass, setAssignedClass] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate]     = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents]   = useState([]);
  const [attendance, setAttendance] = useState({});
  const [msg, setMsg]     = useState({ text:"",type:"" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/teacher/profile/${encodeURIComponent(email)}`).then(r=>r.json()).then(d=>{ if(d.assignedClass){setAssignedClass(d.assignedClass);setSelectedClass(d.assignedClass);} }).catch(()=>{});
  },[email]);

  useEffect(() => {
    if (!selectedClass) return;
    fetch(`${API}/api/students?class=${encodeURIComponent(selectedClass)}`).then(r=>r.json()).then(data=>{ setStudents(Array.isArray(data)?data:[]); }).catch(()=>{});
    fetch(`${API}/api/attendance?class=${encodeURIComponent(selectedClass)}&date=${date}`).then(r=>r.json()).then(data=>{
      if(Array.isArray(data)){
        const map = {};
        data.forEach(r=>{ map[r.studentId]=r.status; });
        setAttendance(map);
      }
    }).catch(()=>{});
  },[selectedClass, date]);

  const toggle = (sid, status) => setAttendance(p=>({...p,[sid]:status}));

  const markAll = status => {
    const map = {};
    students.forEach(s=>{ map[s.studentId]=status; });
    setAttendance(map);
  };

  const save = async () => {
    setSaving(true); setMsg({text:"",type:""});
    const records = students.map(s=>({ studentId:s.studentId, studentName:s.name, class:selectedClass, date, status:attendance[s.studentId]||"Absent" }));
    try {
      const res = await fetch(`${API}/api/attendance`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({records})});
      const data = await res.json();
      setMsg({text:data.message||"Saved!",type:res.ok?"success":"error"});
    } catch { setMsg({text:"Network error.",type:"error"}); }
    finally { setSaving(false); }
  };

  const statusStyle = s => ({
    padding:"5px 14px", borderRadius:20, fontSize:"0.8rem", fontWeight:700, cursor:"pointer", border:"none",
    background: s==="Present"?"#dcfce7":s==="Late"?"#fef9c3":"#fee2e2",
    color: s==="Present"?"#166534":s==="Late"?"#92400e":"#991b1b",
  });

  return (
    <div className="admin-page-content">
      <div className="admin-page-header split">
        <div><h1>Attendance</h1><p>Mark daily attendance</p></div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <button onClick={()=>markAll("Present")} style={{padding:"8px 16px",borderRadius:8,border:"none",background:"#dcfce7",color:"#166534",fontWeight:700,cursor:"pointer"}}>✓ All Present</button>
          <button onClick={()=>markAll("Absent")}  style={{padding:"8px 16px",borderRadius:8,border:"none",background:"#fee2e2",color:"#991b1b",fontWeight:700,cursor:"pointer"}}>✗ All Absent</button>
          <button onClick={save} disabled={saving} className="admin-btn-dark" style={{height:40}}>{saving?"Saving…":"Save Attendance"}</button>
        </div>
      </div>

      {msg.text && <div style={{padding:"10px 14px",borderRadius:8,marginBottom:16,fontWeight:600,fontSize:"0.875rem",background:msg.type==="success"?"#dcfce7":"#fee2e2",color:msg.type==="success"?"#166534":"#991b1b"}}>{msg.text}</div>}

      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <div><label style={{display:"block",marginBottom:5,fontWeight:600,color:"#374151",fontSize:"0.875rem"}}>Class</label>
          <select value={selectedClass} onChange={e=>setSelectedClass(e.target.value)} className="admin-dropdown">
            <option value="">Select Class</option>{CLASSES.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div><label style={{display:"block",marginBottom:5,fontWeight:600,color:"#374151",fontSize:"0.875rem"}}>Date</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="admin-dropdown" style={{height:40}}/>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead><tr><th>#</th><th>Student ID</th><th>Name</th><th>Roll No</th><th>Status</th></tr></thead>
          <tbody>
            {students.length===0?(<tr><td colSpan="5" className="admin-table-empty">Select a class to load students.</td></tr>)
            :students.map((s,i)=>(
              <tr key={s._id}>
                <td>{i+1}</td>
                <td style={{fontWeight:600,color:"#0284c7"}}>{s.studentId}</td>
                <td style={{fontWeight:500}}>{s.name}</td>
                <td>{s.rollNo}</td>
                <td>
                  <div style={{display:"flex",gap:6}}>
                    {["Present","Late","Absent"].map(st=>(
                      <button key={st} onClick={()=>toggle(s.studentId,st)} style={{...statusStyle(st), opacity:(attendance[s.studentId]||"Absent")===st?1:0.35}}>{st}</button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
