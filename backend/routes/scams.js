const express = require('express');
const router = express.Router();
const ScamReport = require('../models/ScamReport');

// POST /api/scams/report
router.post('/report', async (req, res) => {
  try {
    const { name, phone, email, suspectInfo, date, description } = req.body || {};

    if (!description || String(description).trim().length < 5) {
      return res.status(400).json({ error: 'Description is required and should be informative.' });
    }

    const report = new ScamReport({
      name,
      phone,
      email,
      suspectInfo,
      date: date ? new Date(date) : undefined,
      description
    });

    await report.save();

    res.json({ ok: true, id: report._id });
  } catch (err) {
    console.error('Error saving scam report', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
