const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    name: { type: String, required: true },
    class: { type: String, required: true },
    exam: { type: String, required: true },
    total: { type: Number, required: true },
    percentage: { type: Number, required: true },
    grade: { type: String, required: true },
    status: { type: String, enum: ['Pass', 'Fail'], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Result', resultSchema);
