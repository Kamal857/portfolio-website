import React, { useState, useEffect } from "react";
import { API } from "../../config";

export default function TeacherNotices() {
  const [notices, setNotices] = useState([]);

  useEffect(()=>{ fetch(`${API}/api/notices`).then(r=>r.json()).then(d=>setNotices(Array.isArray(d)?d:[])).catch(()=>{}); },[]);

  return (
    <div className="admin-page-content">
      <div className="admin-page-header"><h1>Notices</h1><p>{notices.length} notice{notices.length!==1?"s":""}</p></div>
      {notices.length===0?(<p style={{color:"#94a3b8",marginTop:20}}>No notices yet.</p>):(
        <div style={{display:"flex",flexDirection:"column",gap:14,marginTop:8}}>
          {notices.map(n=>(
            <div key={n._id} style={{background:"#fff",borderRadius:12,padding:"20px 24px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",borderLeft:"4px solid #f59e0b"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <h3 style={{margin:0,fontWeight:700,color:"#1e293b"}}>{n.title}</h3>
                <span style={{fontSize:"0.8rem",color:"#94a3b8"}}>{new Date(n.createdAt).toLocaleDateString()}</span>
              </div>
              <p style={{margin:0,color:"#475569",lineHeight:1.6}}>{n.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
