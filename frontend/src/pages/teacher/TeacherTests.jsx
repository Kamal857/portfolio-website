import React, { useState, useEffect, useRef } from "react";
import { API } from "../../config";
const CLASSES  = ["Class 5","Class 6","Class 7","Class 8","Class 9","Class 10"];
const SUBJECTS = ["Mathematics","Science","English","Nepali","Social Studies","Computer","Optional Math","Physics","Chemistry","Biology","History","Geography","Economics"];
const DURATIONS = ["30 Min","45 Min","1 Hour","1.5 Hours","2 Hours","3 Hours"];
const DURATION_MINS = { "30 Min":30,"45 Min":45,"1 Hour":60,"1.5 Hours":90,"2 Hours":120,"3 Hours":180 };

function formatTime(t) {
  if (!t) return "—";
  const [h,m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h%12||12}:${String(m).padStart(2,"0")} ${ampm}`;
}

function computeStatus(date, time, duration) {
  if (!date||!time) return "Upcoming";
  try {
    const start = new Date(`${date}T${time}`);
    const end   = new Date(start.getTime()+(DURATION_MINS[duration]||60)*60000);
    const now   = new Date();
    if (now < start) return "Upcoming";
    if (now <= end)  return "Ongoing";
    return "Completed";
  } catch { return "Upcoming"; }
}

const STATUS_META = {
  Upcoming:  { bg:"#e0f2fe",color:"#0369a1",icon:"ri-time-line" },
  Ongoing:   { bg:"#fef9c3",color:"#92400e",icon:"ri-play-circle-line" },
  Completed: { bg:"#dcfce7",color:"#166534",icon:"ri-checkbox-circle-line" },
};
const emptyForm = { testType:"single",title:"",subject:"Mathematics",class:"Class 5",date:"",time:"",duration:"1 Hour",totalMarks:100 };

export default function TeacherTests() {
  const email = localStorage.getItem("teacherEmail") || "";
  const [teacherSubject, setTeacherSubject] = useState("");
  const [tests, setTests]     = useState([]);
  const [search, setSearch]   = useState("");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(emptyForm);
  const [mixedSubjects, setMixedSubjects]     = useState([]);
  const [subjectInput, setSubjectInput]       = useState("");
  const [subjectSuggestions, setSubjectSuggestions] = useState([]);
  const [msg, setMsg]     = useState({ text:"",type:"" });
  const [loading, setLoading] = useState(false);
  const [, tick] = useState(0);
  const tagInputRef = useRef(null);

  useEffect(() => { const id = setInterval(()=>tick(n=>n+1),60000); return ()=>clearInterval(id); },[]);

  useEffect(() => {
    fetch(`${API}/api/teacher/profile/${encodeURIComponent(email)}`).then(r=>r.json()).then(d=>{ if(d.subject) setTeacherSubject(d.subject); }).catch(()=>{});
  },[email]);

  const fetchTests = async () => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (classFilter !== "All Classes") params.append("class", classFilter);
    try { const res=await fetch(`${API}/api/tests?${params}`); const data=await res.json(); setTests(Array.isArray(data)?data:[]); }
    catch { setTests([]); }
  };
  useEffect(()=>{ fetchTests(); },[search,classFilter]);

  const handleChange = e => setForm(p=>({...p,[e.target.name]:e.target.value}));
  const switchType   = type => { setForm(p=>({...p,testType:type})); setMixedSubjects([]); setSubjectInput(""); setSubjectSuggestions([]); };

  const handleSubjectInputChange = e => {
    const val = e.target.value; setSubjectInput(val);
    if (val.trim()) setSubjectSuggestions(SUBJECTS.filter(s=>s.toLowerCase().includes(val.toLowerCase())&&!mixedSubjects.includes(s)));
    else setSubjectSuggestions([]);
  };
  const addTag = tag => { const t=tag.trim(); if(!t||mixedSubjects.includes(t)){setSubjectInput("");setSubjectSuggestions([]);return;} setMixedSubjects(p=>[...p,t]); setSubjectInput(""); setSubjectSuggestions([]); tagInputRef.current?.focus(); };
  const removeTag = tag => setMixedSubjects(p=>p.filter(s=>s!==tag));
  const handleTagKeyDown = e => {
    if((e.key==="Enter"||e.key===",")&&subjectInput.trim()){e.preventDefault();addTag(subjectInput);}
    if(e.key==="Backspace"&&!subjectInput&&mixedSubjects.length) setMixedSubjects(p=>p.slice(0,-1));
  };

  const handleAdd = async e => {
    e.preventDefault(); setMsg({text:"",type:""});
    if(form.testType==="mixed"&&mixedSubjects.length<2){setMsg({text:"Add at least 2 subjects.",type:"error"});return;}
    setLoading(true);
    try {
      const payload = { ...form,totalMarks:Number(form.totalMarks), subjects:form.testType==="mixed"?mixedSubjects:[form.subject], subject:form.testType==="mixed"?"Mixed":form.subject };
      const res  = await fetch(`${API}/api/tests`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const data = await res.json();
      if(res.ok){ setMsg({text:"Test scheduled!",type:"success"}); setForm(emptyForm); setMixedSubjects([]); setSubjectInput(""); setShowForm(false); fetchTests(); }
      else setMsg({text:data.message,type:"error"});
    } catch { setMsg({text:"Network error.",type:"error"}); }
    finally { setLoading(false); }
  };

  const handleDelete = async id => { if(!confirm("Delete this test?")) return; await fetch(`${API}/api/tests/${id}`,{method:"DELETE"}); fetchTests(); };

  const inputStyle = {width:"100%",padding:"9px 12px",borderRadius:"8px",border:"1.5px solid #e2e8f0",fontSize:"0.9rem",outline:"none",background:"#f8fafc",boxSizing:"border-box"};
  const labelStyle = {display:"block",marginBottom:"5px",fontWeight:600,color:"#374151",fontSize:"0.82rem"};
  const msgStyle   = type => ({padding:"10px 14px",borderRadius:"8px",marginBottom:"14px",fontSize:"0.875rem",fontWeight:600, backgroundColor:type==="success"?"#dcfce7":"#fee2e2",color:type==="success"?"#166534":"#991b1b"});

  const withStatus = tests.map(t=>({...t,_computed:computeStatus(t.date,t.time,t.duration)}));
  const upcoming   = withStatus.filter(t=>t._computed==="Upcoming").length;
  const ongoing    = withStatus.filter(t=>t._computed==="Ongoing").length;
  const completed  = withStatus.filter(t=>t._computed==="Completed").length;
  const displayed  = statusFilter==="All"?withStatus:withStatus.filter(t=>t._computed===statusFilter);
  const displaySubjects = t => { if(t.testType==="mixed"&&t.subjects?.length) return t.subjects; if(t.subject) return [t.subject]; return ["—"]; };

  return (
    <div className="admin-page-content">
      <div className="admin-page-header split">
        <div><h1>Tests</h1><p>{tests.length} test{tests.length!==1?"s":""} scheduled</p></div>
        <button className="admin-btn-dark" onClick={()=>{setShowForm(!showForm);setMsg({text:"",type:""});}}>
          <i className="ri-add-line"/> Schedule Test
        </button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px",marginBottom:"20px"}}>
        {[
          {label:"Upcoming",value:upcoming,icon:"ri-time-line",bg:"#e0f2fe",color:"#0369a1"},
          {label:"Ongoing",value:ongoing,icon:"ri-play-circle-line",bg:"#fef9c3",color:"#92400e"},
          {label:"Completed",value:completed,icon:"ri-checkbox-circle-line",bg:"#dcfce7",color:"#166534"},
        ].map(s=>(
          <div key={s.label} onClick={()=>setStatusFilter(sf=>sf===s.label?"All":s.label)}
            style={{background:s.bg,borderRadius:"12px",padding:"16px 20px",display:"flex",alignItems:"center",gap:"14px",cursor:"pointer",outline:statusFilter===s.label?`2px solid ${s.color}`:"none"}}>
            <i className={s.icon} style={{fontSize:"1.6rem",color:s.color}}/>
            <div><p style={{margin:0,fontSize:"1.6rem",fontWeight:800,color:s.color}}>{s.value}</p><p style={{margin:0,fontSize:"0.8rem",color:s.color,fontWeight:600}}>{s.label}</p></div>
          </div>
        ))}
      </div>

      {showForm&&(
        <div className="admin-form-card" style={{marginBottom:20}}>
          <h3 style={{marginBottom:14,fontWeight:700,color:"#1e293b"}}>Schedule New Test</h3>
          <div style={{display:"flex",gap:10,marginBottom:18}}>
            {["single","mixed"].map(type=>(
              <button key={type} type="button" onClick={()=>switchType(type)} style={{padding:"8px 20px",borderRadius:"20px",border:"2px solid",borderColor:form.testType===type?(type==="mixed"?"#6366f1":"#0ea5e9"):"#e2e8f0",background:form.testType===type?(type==="mixed"?"#eef2ff":"#e0f9ff"):"#fff",color:form.testType===type?(type==="mixed"?"#4f46e5":"#0284c7"):"#64748b",fontWeight:700,fontSize:"0.875rem",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                <i className={type==="single"?"ri-book-open-line":"ri-stack-line"}/>{type==="single"?"Single Subject":"Mixed Subject"}
              </button>
            ))}
          </div>
          {msg.text&&<div style={msgStyle(msg.type)}>{msg.text}</div>}
          <form onSubmit={handleAdd} style={{display:"flex",flexWrap:"wrap",gap:12,alignItems:"flex-end"}}>
            <div style={{flex:"1 1 220px"}}><label style={labelStyle}>Test Title</label><input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Unit Test" required style={inputStyle}/></div>
            {form.testType==="single"?(
              <div style={{flex:"1 1 160px"}}><label style={labelStyle}>Subject</label><select name="subject" value={form.subject} onChange={handleChange} style={inputStyle}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
            ):(
              <div style={{flex:"2 1 320px"}}>
                <label style={labelStyle}>Subjects <span style={{color:"#6366f1",marginLeft:6}}>({mixedSubjects.length} added)</span></label>
                <div style={{position:"relative"}}>
                  <div onClick={()=>tagInputRef.current?.focus()} style={{display:"flex",flexWrap:"wrap",gap:6,padding:"7px 10px",borderRadius:"8px",border:"1.5px solid #a5b4fc",background:"#f5f3ff",minHeight:42,cursor:"text"}}>
                    {mixedSubjects.map(tag=>(
                      <span key={tag} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:"20px",background:"#6366f1",color:"#fff",fontSize:"0.8rem",fontWeight:700}}>
                        {tag}<button type="button" onClick={()=>removeTag(tag)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",padding:0}}>x</button>
                      </span>
                    ))}
                    <input ref={tagInputRef} value={subjectInput} onChange={handleSubjectInputChange} onKeyDown={handleTagKeyDown} placeholder={mixedSubjects.length?"Add more…":"Type & press Enter"} style={{border:"none",outline:"none",background:"transparent",fontSize:"0.875rem",minWidth:160,flex:1}}/>
                  </div>
                  {subjectSuggestions.length>0&&(
                    <ul style={{position:"absolute",top:"100%",left:0,right:0,zIndex:100,background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:"8px",listStyle:"none",margin:"4px 0 0",padding:"6px 0",boxShadow:"0 8px 24px rgba(0,0,0,0.1)"}}>
                      {subjectSuggestions.map(s=><li key={s} onMouseDown={()=>addTag(s)} style={{padding:"8px 16px",cursor:"pointer",fontSize:"0.875rem"}}>{s}</li>)}
                      {subjectInput.trim()&&!SUBJECTS.includes(subjectInput.trim())&&<li onMouseDown={()=>addTag(subjectInput)} style={{padding:"8px 16px",cursor:"pointer",fontSize:"0.875rem",color:"#6366f1",fontWeight:700}}>+ Add "{subjectInput.trim()}"</li>}
                    </ul>
                  )}
                </div>
              </div>
            )}
            <div style={{flex:"1 1 120px"}}><label style={labelStyle}>Class</label><select name="class" value={form.class} onChange={handleChange} style={inputStyle}>{CLASSES.map(c=><option key={c}>{c}</option>)}</select></div>
            <div style={{flex:"1 1 130px"}}><label style={labelStyle}>Date</label><input type="date" name="date" value={form.date} onChange={handleChange} required style={inputStyle}/></div>
            <div style={{flex:"1 1 110px"}}><label style={labelStyle}>Time</label><input type="time" name="time" value={form.time} onChange={handleChange} required style={inputStyle}/></div>
            <div style={{flex:"1 1 120px"}}><label style={labelStyle}>Duration</label><select name="duration" value={form.duration} onChange={handleChange} style={inputStyle}>{DURATIONS.map(d=><option key={d}>{d}</option>)}</select></div>
            <div style={{flex:"0 1 110px"}}><label style={labelStyle}>Total Marks</label><input type="number" name="totalMarks" value={form.totalMarks} onChange={handleChange} min={1} required style={inputStyle}/></div>
            <div style={{display:"flex",gap:8}}>
              <button type="submit" className="admin-btn-dark" disabled={loading} style={{height:40}}>{loading?<i className="ri-loader-4-line"/>:<i className="ri-save-line"/>} Save</button>
              <button type="button" onClick={()=>{setShowForm(false);setMixedSubjects([]);setSubjectInput("");}} style={{height:40,padding:"0 14px",borderRadius:8,border:"1.5px solid #e2e8f0",background:"#fff",cursor:"pointer",fontWeight:600,color:"#64748b"}}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-controls">
        <div className="admin-search-bar"><i className="ri-search-line"/><input type="text" placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
        <select className="admin-dropdown" value={classFilter} onChange={e=>setClassFilter(e.target.value)}><option>All Classes</option>{CLASSES.map(c=><option key={c}>{c}</option>)}</select>
        <select className="admin-dropdown" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="All">All Statuses</option><option>Upcoming</option><option>Ongoing</option><option>Completed</option></select>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Type</th><th>Subject(s)</th><th>Class</th><th>Date</th><th>Time</th><th>Duration</th><th>Marks</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {displayed.length===0?(<tr><td colSpan="10" className="admin-table-empty">No tests found.</td></tr>)
            :displayed.map(t=>{
              const st=t._computed; const sc=STATUS_META[st]||{bg:"#f1f5f9",color:"#334155",icon:"ri-question-line"};
              const tags=displaySubjects(t); const isMixed=t.testType==="mixed";
              return(
                <tr key={t._id}>
                  <td style={{fontWeight:600,color:"#1e293b"}}>{t.title}</td>
                  <td><span style={{padding:"3px 10px",borderRadius:20,fontSize:"0.75rem",fontWeight:700,background:isMixed?"#eef2ff":"#f0f9ff",color:isMixed?"#4f46e5":"#0284c7"}}><i className={isMixed?"ri-stack-line":"ri-book-open-line"} style={{marginRight:4}}/>{isMixed?"Mixed":"Single"}</span></td>
                  <td><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{tags.map((tag,i)=><span key={i} style={{padding:"2px 8px",borderRadius:20,fontSize:"0.75rem",fontWeight:600,background:isMixed?"#eef2ff":"#f0f9ff",color:isMixed?"#4f46e5":"#0369a1"}}>{tag}</span>)}</div></td>
                  <td>{t.class}</td>
                  <td style={{fontWeight:500}}>{t.date}</td>
                  <td style={{fontWeight:600,color:"#6366f1"}}>{formatTime(t.time)}</td>
                  <td>{t.duration}</td>
                  <td style={{fontWeight:700,color:"#0284c7"}}>{t.totalMarks}</td>
                  <td><span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 12px",borderRadius:20,fontSize:"0.8rem",fontWeight:700,background:sc.bg,color:sc.color}}><i className={sc.icon}/>{st}</span></td>
                  <td><button onClick={()=>handleDelete(t._id)} style={{background:"#fee2e2",color:"#dc2626",border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:"0.8rem",fontWeight:600}}><i className="ri-delete-bin-line"/></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
