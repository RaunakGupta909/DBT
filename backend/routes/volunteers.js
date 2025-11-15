const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');
const DBTStatus = require('../models/DBTStatus');
const VerificationLog = require('../models/VerificationLog');

// POST /api/volunteers/check - volunteer checks aadhaar
// body: {volunteerId, aadhaar}
router.post('/check', async (req,res)=>{
  const {volunteerId,aadhaar} = req.body;
  if(!volunteerId || !aadhaar) return res.status(400).json({error:'volunteerId and aadhaar required'});
  const vol = await Volunteer.findById(volunteerId);
  if(!vol) return res.status(404).json({error:'Volunteer not found'});
  // prevent duplicate check
  if(vol.checks.some(c=>c.aadhaar === aadhaar)){
    return res.status(400).json({error:'This Aadhaar already checked by this volunteer'});
  }
  const status = await DBTStatus.findOne({aadhaar});
  // credit volunteer
  vol.credits += 20;
  vol.checks.push({aadhaar, date: new Date()});
  await vol.save();
  // log verification
  await VerificationLog.create({aadhaar, checkedBy: volunteerId, role:'volunteer', date: new Date(), result: status ? (status.dbtEnabled? 'DBT Enabled':'Not Enabled') : 'Not Linked'});
  res.json({ok:true, status: status || {linkedWithBank:false, dbtEnabled:false}});
});

// GET /api/volunteers/:id/report - daily report (simple)
router.get('/:id/report', async (req,res)=>{
  const vol = await Volunteer.findById(req.params.id);
  if(!vol) return res.status(404).json({error:'Not found'});
  res.json({credits:vol.credits, checks: vol.checks});
});

module.exports = router;
