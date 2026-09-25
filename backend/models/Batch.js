const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  className: { type: String, required: true, default: 'Class 10' },
  maxStudents: { type: Number, default: 30 },
  subjects: [{ type: String }],
  assignedTeacher: { type: String, default: '' },
  fee: { type: Number, default: 0 },
  startTime: { type: String, default: '07:00 AM' },
  endTime: { type: String, default: '09:00 AM' },
  days: { type: String, default: 'Sun - Fri' },
  room: { type: String, default: 'Room 101' },
  status: { type: String, enum: ['Active', 'Upcoming', 'Completed'], default: 'Active' },
  description: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);
