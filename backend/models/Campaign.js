const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  status: String // 'current' | 'upcoming' | 'past'
});

module.exports = mongoose.model('Campaign', CampaignSchema);
