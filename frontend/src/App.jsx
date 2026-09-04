import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { API } from './config';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import TeacherLayout from './components/TeacherLayout';
import Home from './pages/Home';
import About from './pages/About';
import Research from './pages/Research';
import Projects from './pages/Projects';
import Contact from './pages/Contact';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminTeachers from './pages/admin/AdminTeachers';
import AdminClasses from './pages/admin/AdminClasses';
import AdminResults from './pages/admin/AdminResults';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminNotices from './pages/admin/AdminNotices';
import AdminSettings from './pages/admin/AdminSettings';
import AdminTests from './pages/admin/AdminTests';

import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherStudents from './pages/teacher/TeacherStudents';
import TeacherTests from './pages/teacher/TeacherTests';
import TeacherAttendance from './pages/teacher/TeacherAttendance';
import TeacherResults from './pages/teacher/TeacherResults';
import TeacherNotices from './pages/teacher/TeacherNotices';
import TeacherSettings from './pages/teacher/TeacherSettings';

export default function App() {
  useEffect(() => {
    // Wake up backend in background as soon as user opens the site
    fetch(`${API}/api/ping`).catch(() => {});
  }, []);
  return (
    <Routes>
      {/* Public portfolio routes */}
      <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
      <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
      <Route path="/research" element={<><Navbar /><Research /><Footer /></>} />
      <Route path="/projects" element={<><Navbar /><Projects /><Footer /></>} />
      <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="classes" element={<AdminClasses />} />
        <Route path="results" element={<AdminResults />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="notices" element={<AdminNotices />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="tests" element={<AdminTests />} />
      </Route>

      {/* Teacher routes */}
      <Route path="/teacher" element={<TeacherLayout />}>
        <Route index element={<Navigate to="/teacher/dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="students" element={<TeacherStudents />} />
        <Route path="tests" element={<TeacherTests />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="results" element={<TeacherResults />} />
        <Route path="notices" element={<TeacherNotices />} />
        <Route path="settings" element={<TeacherSettings />} />
      </Route>
    </Routes>
  );
}
