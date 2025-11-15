const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Campaign = require('../models/Campaign');

// GET /api/admin/stats - basic stats
router.get('/stats', async (req,res)=>{
  const total = await Student.countDocuments();
  const dbtEnabled = await Student.countDocuments({dbtEnabled:true});
  res.json({totalStudents: total, dbtEnabled});
});

// CRUD for campaigns (add/edit/delete)
router.post('/campaigns', async (req,res)=>{
  const c = await Campaign.create(req.body);
  res.json(c);
});
router.put('/campaigns/:id', async (req,res)=>{
  const c = await Campaign.findByIdAndUpdate(req.params.id, req.body, {new:true});
  res.json(c);
});
router.delete('/campaigns/:id', async (req,res)=>{
  await Campaign.findByIdAndDelete(req.params.id);
  res.json({ok:true});
});

module.exports = router;
