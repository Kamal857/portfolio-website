import React, { useState, useEffect } from "react";
const API = "http://localhost:5000";
const CLASSES = ["","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10"];

export default function TeacherSettings() {
  const email = localStorage.getItem("teacherEmail") || "";
  const [profile, setProfile] = useState({ name:"",phone:"",assignedClass:"",subject:"" });
  const [profileMsg, setProfileMsg] = useState({text:"",type:""});
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwForm, setPwForm]   = useState({current:"",next:"",confirm:""});
  const [pwMsg, setPwMsg]     = useState({text:"",type:""});
  const [pwLoading, setPwLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(()=>{
    fetch(`${API}/api/teacher/profile/${encodeURIComponent(email)}`).then(r=>r.json()).then(d=>{ if(d.name) setProfile({name:d.name||"",phone:d.phone||"",assignedClass:d.assignedClass||"",subject:d.subject||""}); }).catch(()=>{});
  },[email]);

  const saveProfile = async e => {
    e.preventDefault(); setProfileLoading(true); setProfileMsg({text:"",type:""});
    try {
      const res=await fetch(`${API}/api/teacher/profile/${encodeURIComponent(email)}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(profile)});
      const data=await res.json();
      setProfileMsg({text:data.message,type:res.ok?"success":"error"});
      if(res.ok) localStorage.setItem("teacherName",profile.name);
    }catch{setProfileMsg({text:"Network error.",type:"error"});}
    finally{setProfileLoading(false);}
  };

  const savePassword = async e => {
    e.preventDefault(); setPwMsg({text:"",type:""});
    if(pwForm.next!==pwForm.confirm){setPwMsg({text:"Passwords do not match.",type:"error"});return;}
    if(pwForm.next.length<6){setPwMsg({text:"Min. 6 characters.",type:"error"});return;}
    setPwLoading(true);
    try {
      const verify=await fetch(`${API}/api/teacher/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password:pwForm.current})});
      if(!verify.ok){setPwMsg({text:"Current password is incorrect.",type:"error"});setPwLoading(false);return;}
      const res=await fetch(`${API}/api/teacher/profile/${encodeURIComponent(email)}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:pwForm.next})});
      const data=await res.json();
      if(res.ok){setPwMsg({text:"Password updated!",type:"success"});setPwForm({current:"",next:"",confirm:""});}
      else setPwMsg({text:data.message,type:"error"});
    }catch{setPwMsg({text:"Network error.",type:"error"});}
    finally{setPwLoading(false);}
  };

  const inputStyle={width:"100%",padding:"11px 14px",borderRadius:"10px",border:"1.5px solid #e2e8f0",fontSize:"0.95rem",outline:"none",background:"#f8fafc",boxSizing:"border-box"};
  const labelStyle={display:"block",marginBottom:"6px",fontWeight:600,color:"#374151",fontSize:"0.875rem"};
  const msgStyle=type=>({padding:"10px 14px",borderRadius:"8px",marginBottom:"16px",fontSize:"0.875rem",fontWeight:600,backgroundColor:type==="success"?"#dcfce7":"#fee2e2",color:type==="success"?"#166534":"#991b1b"});
  const eyeBtn=(setter,show)=>(<button type="button" onClick={()=>setter(v=>!v)} style={{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#64748b",fontSize:"1rem"}}><i className={show?"ri-eye-off-line":"ri-eye-line"}/></button>);
  const pwStr=len=>len<6?{w:"33%",c:"#ef4444",label:"Weak"}:len<10?{w:"66%",c:"#f59e0b",label:"Moderate"}:{w:"100%",c:"#22c55e",label:"Strong"};
  const str=pwStr(pwForm.next.length);

  return (
    <div className="admin-page-content">
      <div className="admin-page-header"><h1>Settings</h1><p>Manage your profile and security</p></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"24px",marginTop:8}}>

        {/* Profile */}
        <div style={{background:"#fff",borderRadius:"16px",padding:"32px",boxShadow:"0 4px 20px rgba(0,0,0,0.06)",borderTop:"4px solid #0ea5e9"}}>
          <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"24px"}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#0ea5e9,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"1.2rem"}}><i className="ri-user-3-line"/></div>
            <div><h2 style={{margin:0,fontSize:"1.15rem",fontWeight:700,color:"#1e293b"}}>Profile Information</h2><p style={{margin:0,color:"#64748b",fontSize:"0.8rem"}}>{email}</p></div>
          </div>
          {profileMsg.text&&<div style={msgStyle(profileMsg.type)}>{profileMsg.text}</div>}
          <form onSubmit={saveProfile} style={{display:"flex",flexDirection:"column",gap:"18px"}}>
            <div><label style={labelStyle}>Full Name</label><input type="text" value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))} placeholder="Your name" style={inputStyle}/></div>
            <div><label style={labelStyle}>Subject</label><input type="text" value={profile.subject} readOnly style={{...inputStyle,background:"#f1f5f9",color:"#94a3b8",cursor:"not-allowed"}}/></div>
            <div><label style={labelStyle}>Phone Number</label><input type="tel" value={profile.phone} onChange={e=>setProfile(p=>({...p,phone:e.target.value}))} placeholder="Phone number" style={inputStyle}/></div>
            <div><label style={labelStyle}>Assigned Class</label>
              <select value={profile.assignedClass} onChange={e=>setProfile(p=>({...p,assignedClass:e.target.value}))} style={inputStyle}>
                {CLASSES.map(c=><option key={c} value={c}>{c||"Not Assigned"}</option>)}
              </select>
            </div>
            <button type="submit" disabled={profileLoading} style={{padding:"12px",borderRadius:"10px",border:"none",background:"linear-gradient(135deg,#0ea5e9,#6366f1)",color:"#fff",fontWeight:700,fontSize:"0.95rem",cursor:profileLoading?"not-allowed":"pointer",opacity:profileLoading?0.7:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              {profileLoading?<><i className="ri-loader-4-line"/> Saving...</>:<><i className="ri-save-line"/> Save Profile</>}
            </button>
          </form>
        </div>

        {/* Password */}
        <div style={{background:"#fff",borderRadius:"16px",padding:"32px",boxShadow:"0 4px 20px rgba(0,0,0,0.06)",borderTop:"4px solid #f59e0b"}}>
          <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"24px"}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#f59e0b,#ef4444)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"1.2rem"}}><i className="ri-lock-password-line"/></div>
            <div><h2 style={{margin:0,fontSize:"1.15rem",fontWeight:700,color:"#1e293b"}}>Change Password</h2><p style={{margin:0,color:"#64748b",fontSize:"0.8rem"}}>Keep your account secure</p></div>
          </div>
          {pwMsg.text&&<div style={msgStyle(pwMsg.type)}>{pwMsg.text}</div>}
          <form onSubmit={savePassword} style={{display:"flex",flexDirection:"column",gap:"18px"}}>
            <div><label style={labelStyle}>Current Password</label><div style={{position:"relative"}}><input type={showCurrent?"text":"password"} value={pwForm.current} onChange={e=>setPwForm(p=>({...p,current:e.target.value}))} required style={{...inputStyle,paddingRight:"44px"}}/>{eyeBtn(setShowCurrent,showCurrent)}</div></div>
            <div><label style={labelStyle}>New Password</label><div style={{position:"relative"}}><input type={showNext?"text":"password"} value={pwForm.next} onChange={e=>setPwForm(p=>({...p,next:e.target.value}))} required style={{...inputStyle,paddingRight:"44px"}}/>{eyeBtn(setShowNext,showNext)}</div>
              {pwForm.next&&<div style={{marginTop:6}}><div style={{height:"4px",borderRadius:"4px",background:"#e2e8f0",overflow:"hidden"}}><div style={{height:"100%",borderRadius:"4px",transition:"width 0.3s",width:str.w,background:str.c}}/></div><p style={{margin:"4px 0 0",fontSize:"0.75rem",color:str.c}}>{str.label}</p></div>}
            </div>
            <div><label style={labelStyle}>Confirm Password</label><div style={{position:"relative"}}><input type={showConfirm?"text":"password"} value={pwForm.confirm} onChange={e=>setPwForm(p=>({...p,confirm:e.target.value}))} required style={{...inputStyle,paddingRight:"44px",borderColor:pwForm.confirm&&pwForm.next!==pwForm.confirm?"#ef4444":"#e2e8f0"}}/>{eyeBtn(setShowConfirm,showConfirm)}</div>
              {pwForm.confirm&&pwForm.next!==pwForm.confirm&&<p style={{margin:"4px 0 0",fontSize:"0.75rem",color:"#ef4444"}}>Passwords do not match</p>}
            </div>
            <button type="submit" disabled={pwLoading} style={{padding:"12px",borderRadius:"10px",border:"none",background:"linear-gradient(135deg,#f59e0b,#ef4444)",color:"#fff",fontWeight:700,fontSize:"0.95rem",cursor:pwLoading?"not-allowed":"pointer",opacity:pwLoading?0.7:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:4}}>
              {pwLoading?<><i className="ri-loader-4-line"/> Updating...</>:<><i className="ri-lock-line"/> Update Password</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
