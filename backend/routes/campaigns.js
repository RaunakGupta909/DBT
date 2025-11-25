const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');

// GET /api/campaigns - List all campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/campaigns - Create a new campaign
router.post('/', async (req, res) => {
  try {
    const { title, description, startDate, endDate, status } = req.body;
    const campaign = new Campaign({
      title,
      description,
      startDate,
      endDate,
      status: status || 'upcoming'
    });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
