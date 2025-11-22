const mongoose = require('mongoose');

const ScamReportSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  email: { type: String },
  suspectInfo: { type: String },
  date: { type: Date },
  description: { type: String, required: true },
  reportedAt: { type: Date, default: Date.now },
  status: { type: String, default: 'new' }
});

module.exports = mongoose.model('ScamReport', ScamReportSchema);
