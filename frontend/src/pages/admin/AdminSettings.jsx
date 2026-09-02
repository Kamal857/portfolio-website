import React, { useState, useEffect } from "react";

const API = "http://localhost:5000";

export default function AdminSettings() {
  const username = localStorage.getItem("adminUsername") || "admin";

  const [profile, setProfile] = useState({ name: "", email: "", phone: "", address: "" });
  const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });
  const [profileLoading, setProfileLoading] = useState(false);

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState({ text: "", type: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/profile/${username}`)
      .then(r => r.json())
      .then(data => {
        if (data.username) {
          setProfile({ name: data.name || "", email: data.email || "", phone: data.phone || "", address: data.address || "" });
        }
      })
      .catch(() => {});
  }, [username]);

  const handleProfileChange = e => setProfile(p => ({ ...p, [e.target.name]: e.target.value }));
  const handlePwChange = e => setPwForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const saveProfile = async e => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg({ text: "", type: "" });
    try {
      const res = await fetch(`${API}/api/profile/${username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      setProfileMsg({ text: data.message, type: res.ok ? "success" : "error" });
    } catch {
      setProfileMsg({ text: "Network error. Is the backend running?", type: "error" });
    } finally {
      setProfileLoading(false);
    }
  };

  const savePassword = async e => {
    e.preventDefault();
    setPwMsg({ text: "", type: "" });
    if (pwForm.next !== pwForm.confirm) { setPwMsg({ text: "New passwords do not match.", type: "error" }); return; }
    if (pwForm.next.length < 6) { setPwMsg({ text: "New password must be at least 6 characters.", type: "error" }); return; }
    setPwLoading(true);
    try {
      const verify = await fetch(`${API}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: pwForm.current }),
      });
      if (!verify.ok) { setPwMsg({ text: "Current password is incorrect.", type: "error" }); setPwLoading(false); return; }
      const res = await fetch(`${API}/api/profile/${username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwForm.next }),
      });
      const data = await res.json();
      if (res.ok) { setPwMsg({ text: "Password updated successfully!", type: "success" }); setPwForm({ current: "", next: "", confirm: "" }); }
      else setPwMsg({ text: data.message, type: "error" });
    } catch {
      setPwMsg({ text: "Network error. Is the backend running?", type: "error" });
    } finally {
      setPwLoading(false);
    }
  };

  const msgStyle = type => ({
    padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.875rem", fontWeight: 600,
    backgroundColor: type === "success" ? "#dcfce7" : type === "error" ? "#fee2e2" : "#e0f2fe",
    color: type === "success" ? "#166534" : type === "error" ? "#991b1b" : "#075985",
  });

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0",
    fontSize: "0.95rem", outline: "none", background: "#f8fafc", transition: "border-color 0.2s", boxSizing: "border-box",
  };

  const labelStyle = { display: "block", marginBottom: "6px", fontWeight: 600, color: "#374151", fontSize: "0.875rem" };

  const cardStyle = (color) => ({
    background: "#fff", borderRadius: "16px", padding: "32px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)", borderTop: `4px solid ${color}`,
  });

  const iconBadge = (gradient) => ({
    width: 44, height: 44, borderRadius: "50%", background: gradient,
    display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1.2rem",
  });

  const eyeBtn = (setter) => ({
    onClick: () => setter(v => !v),
    type: "button",
    style: { position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: "1rem" },
  });

  const pwStrength = len => len < 6 ? { w: "33%", c: "#ef4444", label: "Weak" } : len < 10 ? { w: "66%", c: "#f59e0b", label: "Moderate" } : { w: "100%", c: "#22c55e", label: "Strong" };
  const str = pwStrength(pwForm.next.length);

  return (
    <div className="admin-page-content">
      <div className="admin-page-header">
        <h1>Settings</h1>
        <p>Manage your admin profile and security</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "8px" }}>

        {/* Profile Card */}
        <div style={cardStyle("#0ea5e9")}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={iconBadge("linear-gradient(135deg,#0ea5e9,#6366f1)")}><i className="ri-user-3-line" /></div>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#1e293b" }}>Profile Information</h2>
              <p style={{ margin: 0, color: "#64748b", fontSize: "0.8rem" }}>Update your name, email & contact details</p>
            </div>
          </div>

          {profileMsg.text && <div style={msgStyle(profileMsg.type)}>{profileMsg.text}</div>}

          <form onSubmit={saveProfile} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={labelStyle}>Username</label>
              <input type="text" value={username} readOnly style={{ ...inputStyle, background: "#f1f5f9", color: "#94a3b8", cursor: "not-allowed" }} />
            </div>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input type="text" name="name" value={profile.name} onChange={handleProfileChange} placeholder="Enter your full name" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input type="email" name="email" value={profile.email} onChange={handleProfileChange} placeholder="Enter your email" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input type="tel" name="phone" value={profile.phone} onChange={handleProfileChange} placeholder="Enter your phone number" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Address</label>
              <textarea name="address" value={profile.address} onChange={handleProfileChange} placeholder="Enter your address" rows={3} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <button type="submit" disabled={profileLoading} style={{
              padding: "12px", borderRadius: "10px", border: "none",
              background: "linear-gradient(135deg,#0ea5e9,#6366f1)", color: "#fff", fontWeight: 700,
              fontSize: "0.95rem", cursor: profileLoading ? "not-allowed" : "pointer", opacity: profileLoading ? 0.7 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}>
              {profileLoading ? <><i className="ri-loader-4-line" /> Saving...</> : <><i className="ri-save-line" /> Save Profile</>}
            </button>
          </form>
        </div>

        {/* Password Card */}
        <div style={cardStyle("#f59e0b")}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={iconBadge("linear-gradient(135deg,#f59e0b,#ef4444)")}><i className="ri-lock-password-line" /></div>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#1e293b" }}>Change Password</h2>
              <p style={{ margin: 0, color: "#64748b", fontSize: "0.8rem" }}>Keep your account secure</p>
            </div>
          </div>

          {pwMsg.text && <div style={msgStyle(pwMsg.type)}>{pwMsg.text}</div>}

          <form onSubmit={savePassword} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={labelStyle}>Current Password</label>
              <div style={{ position: "relative" }}>
                <input type={showCurrent ? "text" : "password"} name="current" value={pwForm.current} onChange={handlePwChange} placeholder="Enter current password" required style={{ ...inputStyle, paddingRight: "44px" }} />
                <button {...eyeBtn(setShowCurrent)}><i className={showCurrent ? "ri-eye-off-line" : "ri-eye-line"} /></button>
              </div>
            </div>
            <div>
              <label style={labelStyle}>New Password</label>
              <div style={{ position: "relative" }}>
                <input type={showNext ? "text" : "password"} name="next" value={pwForm.next} onChange={handlePwChange} placeholder="Min. 6 characters" required style={{ ...inputStyle, paddingRight: "44px" }} />
                <button {...eyeBtn(setShowNext)}><i className={showNext ? "ri-eye-off-line" : "ri-eye-line"} /></button>
              </div>
              {pwForm.next && (
                <div style={{ marginTop: "6px" }}>
                  <div style={{ height: "4px", borderRadius: "4px", background: "#e2e8f0", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: "4px", transition: "width 0.3s, background 0.3s", width: str.w, background: str.c }} />
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: str.c }}>{str.label}</p>
                </div>
              )}
            </div>
            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <div style={{ position: "relative" }}>
                <input type={showConfirm ? "text" : "password"} name="confirm" value={pwForm.confirm} onChange={handlePwChange} placeholder="Re-enter new password" required
                  style={{ ...inputStyle, paddingRight: "44px", borderColor: pwForm.confirm && pwForm.next !== pwForm.confirm ? "#ef4444" : "#e2e8f0" }} />
                <button {...eyeBtn(setShowConfirm)}><i className={showConfirm ? "ri-eye-off-line" : "ri-eye-line"} /></button>
              </div>
              {pwForm.confirm && pwForm.next !== pwForm.confirm && (
                <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#ef4444" }}>Passwords do not match</p>
              )}
            </div>
            <button type="submit" disabled={pwLoading} style={{
              padding: "12px", borderRadius: "10px", border: "none",
              background: "linear-gradient(135deg,#f59e0b,#ef4444)", color: "#fff", fontWeight: 700,
              fontSize: "0.95rem", cursor: pwLoading ? "not-allowed" : "pointer", opacity: pwLoading ? 0.7 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "4px",
            }}>
              {pwLoading ? <><i className="ri-loader-4-line" /> Updating...</> : <><i className="ri-lock-line" /> Update Password</>}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input:focus, textarea:focus { border-color: #0ea5e9 !important; background: #fff !important; }
        @media (max-width: 768px) { .settings-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
