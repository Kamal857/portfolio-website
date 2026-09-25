import React, { useState } from "react";
import { SAMPLE_STUDENT } from "../../components/StudentLayout";
import { CalendarDays, Clock, MapPin, User } from "lucide-react";

export default function StudentTimetable() {
  const s = SAMPLE_STUDENT;
  const [selectedDay, setSelectedDay] = useState("Monday");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const scheduleData = {
    Monday: [
      { time: "09:00 AM - 09:45 AM", subject: "Mathematics", teacher: "Mr. B. Sharma", room: "Room 101" },
      { time: "09:45 AM - 10:30 AM", subject: "Science (Physics)", teacher: "Dr. K. Joshi", room: "Lab A" },
      { time: "10:45 AM - 11:30 AM", subject: "English Literature", teacher: "Ms. S. Thapa", room: "Room 101" },
      { time: "11:30 AM - 12:15 PM", subject: "Nepali", teacher: "Mr. R. Adhikari", room: "Room 101" },
      { time: "01:00 PM - 01:45 PM", subject: "Computer Science", teacher: "Er. K. Bohara", room: "Computer Lab" },
      { time: "01:45 PM - 02:30 PM", subject: "Social Studies", teacher: "Mrs. P. Shrestha", room: "Room 101" },
    ],
    Tuesday: [
      { time: "09:00 AM - 09:45 AM", subject: "English Grammar", teacher: "Ms. S. Thapa", room: "Room 101" },
      { time: "09:45 AM - 10:30 AM", subject: "Mathematics", teacher: "Mr. B. Sharma", room: "Room 101" },
      { time: "10:45 AM - 11:30 AM", subject: "Science (Chemistry)", teacher: "Dr. K. Joshi", room: "Lab B" },
      { time: "11:30 AM - 12:15 PM", subject: "Social Studies", teacher: "Mrs. P. Shrestha", room: "Room 101" },
      { time: "01:00 PM - 01:45 PM", subject: "Nepali", teacher: "Mr. R. Adhikari", room: "Room 101" },
      { time: "01:45 PM - 02:30 PM", subject: "Physical Education", teacher: "Mr. D. Magar", room: "Sports Ground" },
    ],
    Wednesday: [
      { time: "09:00 AM - 09:45 AM", subject: "Science (Biology)", teacher: "Dr. K. Joshi", room: "Lab C" },
      { time: "09:45 AM - 10:30 AM", subject: "Mathematics", teacher: "Mr. B. Sharma", room: "Room 101" },
      { time: "10:45 AM - 11:30 AM", subject: "Computer Practical", teacher: "Er. K. Bohara", room: "Computer Lab" },
      { time: "11:30 AM - 12:15 PM", subject: "English Literature", teacher: "Ms. S. Thapa", room: "Room 101" },
      { time: "01:00 PM - 01:45 PM", subject: "Moral Science & Arts", teacher: "Mrs. M. Dahal", room: "Art Studio" },
      { time: "01:45 PM - 02:30 PM", subject: "Nepali", teacher: "Mr. R. Adhikari", room: "Room 101" },
    ],
    Thursday: [
      { time: "09:00 AM - 09:45 AM", subject: "Social Studies", teacher: "Mrs. P. Shrestha", room: "Room 101" },
      { time: "09:45 AM - 10:30 AM", subject: "Science (Physics)", teacher: "Dr. K. Joshi", room: "Lab A" },
      { time: "10:45 AM - 11:30 AM", subject: "Mathematics", teacher: "Mr. B. Sharma", room: "Room 101" },
      { time: "11:30 AM - 12:15 PM", subject: "Nepali Grammar", teacher: "Mr. R. Adhikari", room: "Room 101" },
      { time: "01:00 PM - 01:45 PM", subject: "English Writing", teacher: "Ms. S. Thapa", room: "Room 101" },
      { time: "01:45 PM - 02:30 PM", subject: "Library & Reading", teacher: "Mr. N. Giri", room: "Library Hall" },
    ],
    Friday: [
      { time: "09:00 AM - 09:45 AM", subject: "Mathematics Quiz", teacher: "Mr. B. Sharma", room: "Room 101" },
      { time: "09:45 AM - 10:30 AM", subject: "Computer Project", teacher: "Er. K. Bohara", room: "Computer Lab" },
      { time: "10:45 AM - 11:30 AM", subject: "Science Experiment", teacher: "Dr. K. Joshi", room: "Lab A" },
      { time: "11:30 AM - 12:15 PM", subject: "English Debate", teacher: "Ms. S. Thapa", room: "Auditorium" },
      { time: "01:00 PM - 02:30 PM", subject: "Club Activities & Sports", teacher: "All Faculty", room: "Campus Grounds" },
    ],
  };

  return (
    <div className="sp-page-wrapper">
      {/* Page Header */}
      <div className="sp-subpage-header">
        <div className="sp-subpage-title-wrap">
          <div className="sp-subpage-icon-badge">
            <CalendarDays size={20} />
          </div>
          <div>
            <h1>Class Timetable</h1>
            <p>Class: {s.class} • Academic Session 2025/2026</p>
          </div>
        </div>
        <div className="sp-profile-pills">
          <span className="sp-pill">6 Periods / Day</span>
          <span className="sp-pill sp-pill-success">Active</span>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: selectedDay === day ? "1px solid #09090b" : "1px solid #e4e4e7",
              background: selectedDay === day ? "#09090b" : "#ffffff",
              color: selectedDay === day ? "#ffffff" : "#52525b",
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Slots Grid */}
      <div className="sp-timetable-day-card">
        <div className="sp-timetable-day-header">
          <span>{selectedDay}'s Daily Schedule</span>
          <span style={{ fontSize: "0.75rem", color: "#71717a", fontWeight: 500 }}>
            Break: 12:15 PM - 01:00 PM (45 mins)
          </span>
        </div>

        <div className="sp-timetable-slots">
          {scheduleData[selectedDay].map((slot, index) => (
            <div key={index} className="sp-slot-card">
              <div className="sp-slot-time">
                <Clock size={12} /> {slot.time}
              </div>
              <div className="sp-slot-subject">
                {slot.subject}
              </div>
              <div className="sp-slot-teacher">
                <User size={12} /> {slot.teacher}
              </div>
              <div className="sp-slot-teacher" style={{ marginTop: "2px", fontSize: "0.7rem", color: "#a1a1aa" }}>
                <MapPin size={11} /> {slot.room}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
