const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Models
const User = require('./models/User');
const Teacher = require('./models/Teacher');
const Student = require('./models/Student');
const Notice = require('./models/Notice');
const Result = require('./models/Result');
const Attendance = require('./models/Attendance');
const Test = require('./models/Test');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// ============================================================
// STATS — Dashboard counts
// ============================================================
app.get('/api/stats', async (req, res) => {
  try {
    const [students, teachers, notices] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Notice.countDocuments(),
    ]);
    res.status(200).json({ students, teachers, classes: 6, notices });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// ============================================================
// STUDENTS
// ============================================================
app.get('/api/students', async (req, res) => {
  try {
    const { search, class: cls } = req.query;
    let query = {};
    if (cls && cls !== 'All Classes') query.class = cls;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } },
    ];
    const students = await Student.find(query).sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students' });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { studentId, name, class: cls, rollNo, guardian, phone } = req.body;
    if (!studentId || !name || !cls || !rollNo) {
      return res.status(400).json({ message: 'Student ID, Name, Class and Roll No are required' });
    }
    const exists = await Student.findOne({ studentId });
    if (exists) return res.status(400).json({ message: 'Student ID already exists' });
    const student = await Student.create({ studentId, name, class: cls, rollNo, guardian, phone });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error creating student' });
  }
});

app.get('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student' });
  }
});

// ============================================================
// TEACHERS
// ============================================================
app.get('/api/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers' });
  }
});

app.post('/api/teachers', async (req, res) => {
  try {
    const { name, email, subject } = req.body;
    if (!name || !email || !subject) return res.status(400).json({ message: 'All fields required' });
    const exists = await Teacher.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Teacher with this email already exists' });
    const teacher = await Teacher.create({ name, email, subject });
    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Error creating teacher' });
  }
});

app.put('/api/teachers/:id', async (req, res) => {
  try {
    const { name, email, subject, password, phone, assignedClass } = req.body;
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    
    if (name) teacher.name = name;
    if (email) teacher.email = email;
    if (subject) teacher.subject = subject;
    if (password !== undefined && password !== '') teacher.password = password; // Only update if a new password is provided
    if (phone !== undefined) teacher.phone = phone;
    if (assignedClass !== undefined) teacher.assignedClass = assignedClass;
    
    await teacher.save();
    res.status(200).json({ message: 'Teacher updated successfully', teacher });
  } catch (error) {
    res.status(500).json({ message: 'Error updating teacher' });
  }
});

app.get('/api/teachers/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select('-password');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher' });
  }
});

app.delete('/api/teachers/:id', async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Teacher deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting teacher' });
  }
});

// ============================================================
// RESULTS
// GET by student ID string (for student profile)
app.get('/api/results/student/:studentId', async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student results' });
  }
});
// ------------------------------------------------------------
// ============================================================
app.get('/api/results', async (req, res) => {
  try {
    const { search, class: cls } = req.query;
    let query = {};
    if (cls && cls !== 'All Classes') query.class = cls;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } },
    ];
    const results = await Result.find(query).sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching results' });
  }
});

app.post('/api/results', async (req, res) => {
  try {
    const { studentId, name, class: cls, exam, total, percentage, grade, status } = req.body;
    if (!studentId || !name || !cls || !exam || total == null || percentage == null || !grade || !status) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const result = await Result.create({ studentId, name, class: cls, exam, total, percentage, grade, status });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating result' });
  }
});

app.delete('/api/results/:id', async (req, res) => {
  try {
    await Result.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Result deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting result' });
  }
});

// ============================================================
// NOTICES
// ============================================================
app.get('/api/notices', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notices' });
  }
});

app.post('/api/notices', async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });
    const notice = await Notice.create({ title, content });
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Error creating notice' });
  }
});

app.delete('/api/notices/:id', async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Notice deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notice' });
  }
});

// ============================================================
// ATTENDANCE
// ============================================================
// GET all attendance records for one student (for student profile)
app.get('/api/attendance/student/:studentId', async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.params.studentId }).sort({ date: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student attendance' });
  }
});

app.get('/api/attendance', async (req, res) => {
  try {
    const { class: cls, date } = req.query;
    if (!cls || !date) return res.status(400).json({ message: 'Class and date are required' });
    const records = await Attendance.find({ class: cls, date });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance' });
  }
});

app.post('/api/attendance', async (req, res) => {
  try {
    const { records } = req.body; // Array of { studentId, studentName, class, date, status }
    if (!records || !records.length) return res.status(400).json({ message: 'No attendance records provided' });
    // Upsert each record
    const ops = records.map(r => ({
      updateOne: {
        filter: { studentId: r.studentId, date: r.date },
        update: { $set: r },
        upsert: true,
      },
    }));
    await Attendance.bulkWrite(ops);
    res.status(200).json({ message: 'Attendance saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving attendance' });
  }
});

// ============================================================
// AUTH
// ============================================================
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (user.password === password) {
      return res.status(200).json({ message: 'Login successful', username });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error during login' });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });
  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const user = await User.create({ username, password });
    return res.status(201).json({ message: 'User registered successfully', username: user.username });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Internal server error during registration' });
  }
});

// Teacher login (by email + password)
app.post('/api/teacher/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(401).json({ message: 'Invalid credentials' });
    if (!teacher.password) return res.status(401).json({ message: 'Password not set. Contact admin.' });
    if (teacher.password !== password) return res.status(401).json({ message: 'Invalid credentials' });
    return res.status(200).json({ message: 'Login successful', teacher: { _id: teacher._id, name: teacher.name, email: teacher.email, subject: teacher.subject, assignedClass: teacher.assignedClass } });
  } catch (error) {
    console.error('Teacher login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Teacher profile by email
app.get('/api/teacher/profile/:email', async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.params.email }).select('-password');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.status(200).json(teacher);
  } catch { res.status(500).json({ message: 'Error fetching teacher profile' }); }
});

app.put('/api/teacher/profile/:email', async (req, res) => {
  try {
    const { name, phone, assignedClass, password } = req.body;
    const teacher = await Teacher.findOne({ email: req.params.email });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    if (name) teacher.name = name;
    if (phone !== undefined) teacher.phone = phone;
    if (assignedClass !== undefined) teacher.assignedClass = assignedClass;
    if (password) teacher.password = password;
    await teacher.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Teacher profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// ============================================================
// TESTS
// ============================================================
app.get('/api/tests', async (req, res) => {
  try {
    const { search, class: cls, status } = req.query;
    let query = {};
    if (cls && cls !== 'All Classes') query.class = cls;
    if (status && status !== 'All') query.status = status;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
    ];
    const tests = await Test.find(query).sort({ date: 1 });
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tests' });
  }
});

app.post('/api/tests', async (req, res) => {
  try {
    const { title, testType, subject, subjects, class: cls, date, time, duration, totalMarks, status } = req.body;
    if (!title || !cls || !date || !time || !duration || totalMarks == null) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }
    if (testType === 'mixed') {
      if (!subjects || subjects.length < 2) {
        return res.status(400).json({ message: 'Mixed test requires at least 2 subjects' });
      }
    } else {
      if (!subject) return res.status(400).json({ message: 'Subject is required' });
    }
    const test = await Test.create({
      title,
      testType: testType || 'single',
      subject: testType === 'mixed' ? 'Mixed' : subject,
      subjects: testType === 'mixed' ? subjects : [subject],
      class: cls, date, time, duration,
      totalMarks: Number(totalMarks),
    });
    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: 'Error creating test' });
  }
});

app.put('/api/tests/:id', async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.status(200).json({ message: 'Test updated', test });
  } catch (error) {
    res.status(500).json({ message: 'Error updating test' });
  }
});

app.delete('/api/tests/:id', async (req, res) => {
  try {
    await Test.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Test deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting test' });
  }
});

// ============================================================
// PROFILE / SETTINGS
// ============================================================
app.get('/api/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

app.put('/api/profile/:username', async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (password) user.password = password;

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// ============================================================
// KEEP-AWAKE PING (For Render Free Tier)
// ============================================================
app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'Server is awake!' });
});

// ============================================================
// EXTERNAL HEALTH CHECK
// ============================================================
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
  
  // If SERVER_URL is defined in Render environment variables, ping it every 14 minutes
  const serverUrl = process.env.SERVER_URL;
  if (serverUrl) {
    console.log(`Self-ping mechanism started for ${serverUrl}`);
    setInterval(async () => {
      try {
        console.log('Sending keep-awake ping...');
        await fetch(`${serverUrl}/api/ping`);
      } catch (err) {
        console.error('Ping failed:', err.message);
      }
    }, 14 * 60 * 1000); // 14 minutes (Render spins down after 15 mins)
  }
});
