const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  teacherId: String,
  classes: [String],
  schoolId: String
});

module.exports = mongoose.model('Teacher', TeacherSchema);
