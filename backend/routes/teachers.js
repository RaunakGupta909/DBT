const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const DBTStatus = require('../models/DBTStatus');

// GET /api/teachers/class-summary/:teacherId
// Returns class summary for the teacher
router.get('/class-summary/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacher = await Teacher.findOne({ teacherId });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    const summary = [];
    for (const classId of teacher.classes) {
      const students = await Student.find({ classId });
      const totalStudents = students.length;
      let dbtLinked = 0;
      let dbtEnabled = 0;
      for (const student of students) {
        const status = await DBTStatus.findOne({ aadhaar: student.aadhaar });
        if (status) {
          if (status.linkedWithBank) dbtLinked++;
          if (status.dbtEnabled) dbtEnabled++;
        }
      }
      summary.push({
        classId,
        totalStudents,
        dbtLinked,
        dbtEnabled
      });
    }
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
