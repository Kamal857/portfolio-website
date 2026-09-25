import React, { useState, useEffect } from "react";
import { Bell, CalendarDays, Pin, Megaphone, CheckCircle2, Search } from "lucide-react";
import { API } from "../../config";

export default function StudentNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const sampleNotices = [
    {
      _id: "demo-1",
      title: "Second Terminal Examination Routine Published",
      content: "The official examination routine for the upcoming Second Terminal Exams has been published. Please collect your admit cards from the administrative office by Friday.",
      category: "Academic",
      isPinned: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "demo-2",
      title: "Annual Sports Week & Inter-House Football Tournament",
      content: "Annual sports meet will commence from next Monday. Students interested in track, relay, badminton, and football are requested to register with their sports captains.",
      category: "Events",
      isPinned: false,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      _id: "demo-3",
      title: "Science & Robotics Exhibition 2026",
      content: "All classes are invited to submit their science project models before the end of the month. Winning projects will represent the academy in the National Science Fair.",
      category: "Academic",
      isPinned: false,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ];

  useEffect(() => {
    fetch(`${API}/api/notices`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setNotices(data);
        } else {
          setNotices(sampleNotices);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotices(sampleNotices);
        setLoading(false);
      });
  }, []);

  const formatDate = (d) => {
    if (!d) return "Recently";
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="sp-page-wrapper">
      {/* Header */}
      <div className="sp-subpage-header">
        <div className="sp-subpage-title-wrap">
          <div className="sp-subpage-icon-badge">
            <Bell size={24} />
          </div>
          <div>
            <h1>School Notices & Circulars</h1>
            <p>Important announcements and official updates from Aimer's Academy</p>
          </div>
        </div>
        <div className="sp-profile-pills">
          <span className="sp-pill sp-pill-primary">{notices.length} Active Notices</span>
        </div>
      </div>

      {loading ? (
        <div className="sp-loading">
          <div className="sp-spinner"></div>
          <p>Loading notices...</p>
        </div>
      ) : (
        <div className="sp-notices-container">
          {notices.map((notice) => (
            <div key={notice._id} className="sp-notice-item-card">
              <div className="sp-notice-icon-circle">
                {notice.isPinned ? <Pin size={18} color="#09090b" /> : <Megaphone size={18} color="#09090b" />}
              </div>
              <div className="sp-notice-main-text" style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <h3>{notice.title}</h3>
                  {notice.isPinned && (
                    <span className="sp-pill sp-pill-amber" style={{ fontSize: "0.68rem" }}>
                      📌 Pinned
                    </span>
                  )}
                </div>
                <p>{notice.content}</p>
                <div className="sp-notice-date-badge">
                  <CalendarDays size={13} /> {formatDate(notice.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
