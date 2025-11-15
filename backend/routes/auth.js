const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Student = require('../models/Student');
const Parent = require('../models/Parent');

// POST /api/auth/register
// Accepts: {username, password, role, name, aadhaar, fatherName, fatherAadhaar, schoolId}
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ username, passwordHash: hash, role: role || 'student' });

    // If registration included student/parent details, create corresponding records
    if (req.body.role === 'student'){
      const { name, aadhaar, fatherName, fatherAadhaar, schoolId, mobile } = req.body;
      await Student.create({ name: name || username, aadhaar: aadhaar || username, fatherName: fatherName || '', fatherAadhaar: fatherAadhaar || '', mobile: mobile || '', schoolId: schoolId || '' });
    }
    if (req.body.role === 'parent'){
      const { name, aadhaar, mobile, childAadhaar } = req.body;
      await Parent.create({ name: name || username, aadhaar: aadhaar || username, mobile: mobile || '', children: childAadhaar ? [] : [] });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'demo-secret', { expiresIn: '8h' });
    res.json({ ok: true, token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'demo-secret', { expiresIn: '8h' });
    res.json({ ok: true, token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/forgot - demo sending SMS
router.post('/forgot', (req,res)=>{
  const {mobile} = req.body;
  console.log('Sending dummy SMS to', mobile);
  res.json({ok:true, message:'Dummy SMS sent with temporary password.'});
});

module.exports = router;
