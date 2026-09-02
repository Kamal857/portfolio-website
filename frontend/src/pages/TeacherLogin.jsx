import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

export default function TeacherLogin() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [msg, setMsg]           = useState({ text: "", type: "" });
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg({ text: "Logging in…", type: "info" });
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/teacher/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("teacherEmail", data.teacher.email);
        localStorage.setItem("teacherName",  data.teacher.name);
        setMsg({ text: "Login successful! Redirecting…", type: "success" });
        setTimeout(() => navigate("/teacher/dashboard"), 900);
      } else {
        setMsg({ text: data.message, type: "error" });
      }
    } catch {
      setMsg({ text: "Network error. Is the backend running?", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0ea5e9 100%)",
    }}>
      <div style={{
        background: "#fff", borderRadius: "24px", padding: "48px 40px", width: "100%", maxWidth: "420px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.25)", borderTop: "5px solid #0ea5e9",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%", margin: "0 auto 14px",
            background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", color: "#fff",
          }}>
            <i className="ri-user-star-line" />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Teacher Portal</h1>
          <p style={{ color: "#64748b", margin: "6px 0 0", fontSize: "0.9rem" }}>Aimer&rsquo;s Academy — Staff Login</p>
        </div>

        {msg.text && (
          <div style={{
            padding: "10px 14px", borderRadius: "10px", marginBottom: "18px", textAlign: "center",
            fontSize: "0.875rem", fontWeight: 600,
            background: msg.type === "success" ? "#dcfce7" : msg.type === "error" ? "#fee2e2" : "#e0f2fe",
            color: msg.type === "success" ? "#166534" : msg.type === "error" ? "#991b1b" : "#075985",
          }}>{msg.text}</div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#374151", fontSize: "0.875rem" }}>
              Email Address
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com"
              style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, color: "#374151", fontSize: "0.875rem" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password"
                style={{ width: "100%", padding: "12px 44px 12px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }} />
              <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: "1.1rem" }}>
                <i className={showPw ? "ri-eye-off-line" : "ri-eye-line"} />
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} style={{
            padding: "13px", borderRadius: "10px", border: "none", marginTop: "4px",
            background: "linear-gradient(135deg, #0ea5e9, #6366f1)", color: "#fff",
            fontWeight: 700, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
          }}>
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.85rem", color: "#94a3b8" }}>
          Admin?{" "}
          <a href="/projects" style={{ color: "#0ea5e9", fontWeight: 600, textDecoration: "none" }}>Go to Admin Login</a>
        </p>
      </div>
    </div>
  );
}
