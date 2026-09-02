const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, default: "" },      // kept for backward compat
    subjects: { type: [String], default: [] },     // array for mixed tests
    testType: { type: String, default: "single" }, // 'single' | 'mixed'
    class: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    status: { type: String, default: "Upcoming" },
  },
  { timestamps: true }
);

const Test = mongoose.model("Test", testSchema);
module.exports = Test;
