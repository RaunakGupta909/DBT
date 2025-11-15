const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const DBTStatus = require('../models/DBTStatus');

// POST /api/students/check - check DBT status by aadhaar
// body: {aadhaar}
router.post('/check', async (req,res)=>{
  const {aadhaar} = req.body;
  if(!aadhaar) return res.status(400).json({error:'aadhaar required'});
  const student = await Student.findOne({aadhaar});
  const status = await DBTStatus.findOne({aadhaar});
  // Build response
  const response = {
    student: student || null,
    linkedWithBank: status ? status.linkedWithBank : false,
    dbtEnabled: status ? status.dbtEnabled : false
  };
  res.json(response);
});

// GET /api/students/by-father/:fatherAadhaar
// returns list of students matching father's aadhaar
router.get('/by-father/:fatherAadhaar', async (req,res)=>{
  const {fatherAadhaar} = req.params;
  const students = await Student.find({fatherAadhaar});
  res.json(students);
});

module.exports = router;
