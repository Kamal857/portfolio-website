import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
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

export default function App() {
  return (
    <Routes>
      {/* Public portfolio routes with Navbar + Footer */}
      <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
      <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
      <Route path="/research" element={<><Navbar /><Research /><Footer /></>} />
      <Route path="/projects" element={<><Navbar /><Projects /><Footer /></>} />
      <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />

      {/* Admin routes (no Navbar/Footer, full-screen layout) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="classes" element={<AdminClasses />} />
        <Route path="results" element={<AdminResults />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="notices" element={<AdminNotices />} />
      </Route>
    </Routes>
  );
}
