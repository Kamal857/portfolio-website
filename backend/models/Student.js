const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, unique: true },
    name: { type: String, required: true },
    class: { type: String, required: true },
    rollNo: { type: String, required: true },
    guardian: { type: String, default: '' },
    phone: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
