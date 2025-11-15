const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// Dummy users storage for demo
const users = {
  'admin@example.com': {password: 'admin123', role: 'admin', id: 'admin1'}
};

// POST /api/auth/login
// body: {username, password}
// returns JWT token (demo)
router.post('/login', async (req,res)=>{
  const {username,password} = req.body;
  const u = users[username];
  if(!u || password !== u.password) return res.status(401).json({error:'Invalid credentials'});
  const token = jwt.sign({id:u.id, role:u.role}, 'demo-secret', {expiresIn:'8h'});
  res.json({token});
});

// POST /api/auth/forgot - demo sending SMS
router.post('/forgot', (req,res)=>{
  const {mobile} = req.body;
  // In real app: generate code, send SMS via provider
  console.log('Sending dummy SMS to', mobile);
  res.json({ok:true, message:'Dummy SMS sent with temporary password.'});
});

module.exports = router;
