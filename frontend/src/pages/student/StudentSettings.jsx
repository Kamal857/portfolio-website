import React, { useState } from "react";
import { SAMPLE_STUDENT } from "../../components/StudentLayout";
import {
  Settings,
  UserRound,
  GraduationCap,
  Phone,
  Users,
  CalendarDays,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Save,
} from "lucide-react";

export default function StudentSettings() {
  const s = SAMPLE_STUDENT;
  const avatarInitials = s.name.split(" ").map((w) => w[0]).join("").toUpperCase();
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="sp-page-wrapper">
      {/* Page Header */}
      <div className="sp-subpage-header">
        <div className="sp-subpage-title-wrap">
          <div className="sp-subpage-icon-badge">
            <Settings size={24} />
          </div>
          <div>
            <h1>Student Profile & Settings</h1>
            <p>Manage your student record, security, and contact information</p>
          </div>
        </div>
      </div>

      {savedToast && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 20px",
            background: "#dcfce7",
            color: "#166534",
            borderRadius: "12px",
            marginBottom: "20px",
            fontWeight: 700,
            border: "1px solid #86efac",
            animation: "spFadeInUp 0.3s ease",
          }}
        >
          <CheckCircle2 size={18} /> Settings saved successfully!
        </div>
      )}

      <div className="sp-settings-card-elevated">
        {/* Banner Hero */}
        <div className="sp-settings-hero">
          <div className="sp-settings-avatar-big">
            <span>{avatarInitials}</span>
          </div>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 4px 0" }}>{s.name}</h2>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span className="sp-pill sp-pill-primary" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>
                Roll #{s.registrationNo}
              </span>
              <span className="sp-pill sp-pill-success" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>
                {s.class}
              </span>
            </div>
          </div>
        </div>

        {/* Settings Form Grid */}
        <form onSubmit={handleSave}>
          <div className="sp-settings-form-grid">
            <div className="sp-setting-field-group">
              <label>Full Name</label>
              <div className="sp-setting-field-input">
                <UserRound size={18} />
                <span>{s.name}</span>
              </div>
            </div>

            <div className="sp-setting-field-group">
              <label>Class & Section</label>
              <div className="sp-setting-field-input">
                <GraduationCap size={18} />
                <span>{s.class} (Section A)</span>
              </div>
            </div>

            <div className="sp-setting-field-group">
              <label>Date of Admission</label>
              <div className="sp-setting-field-input">
                <CalendarDays size={18} />
                <span>{s.dateOfAdmission}</span>
              </div>
            </div>

            <div className="sp-setting-field-group">
              <label>Date of Birth</label>
              <div className="sp-setting-field-input">
                <CalendarDays size={18} />
                <span>{s.dateOfBirth}</span>
              </div>
            </div>

            <div className="sp-setting-field-group">
              <label>Guardian (Father's Name)</label>
              <div className="sp-setting-field-input">
                <Users size={18} />
                <span>{s.fatherName}</span>
              </div>
            </div>

            <div className="sp-setting-field-group">
              <label>Guardian (Mother's Name)</label>
              <div className="sp-setting-field-input">
                <Users size={18} />
                <span>{s.motherName}</span>
              </div>
            </div>

            <div className="sp-setting-field-group">
              <label>Emergency Contact Phone</label>
              <div className="sp-setting-field-input">
                <Phone size={18} />
                <span>{s.phone || "+977 9800000000"}</span>
              </div>
            </div>

            <div className="sp-setting-field-group">
              <label>Permanent Residential Address</label>
              <div className="sp-setting-field-input">
                <MapPin size={18} />
                <span>{s.address || "Kathmandu, Nepal"}</span>
              </div>
            </div>
          </div>

          <div style={{ padding: "0 32px 32px 32px", display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px" }}
            >
              <Save size={16} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
