const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  aadhaar: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  schoolName: { type: String, required: true },
  scheme: { type: String, required: true },
  issueType: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'In Progress', 'Resolved', 'Closed'] },
  resolutionNotes: { type: String },
  raisedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
  district: { type: String }, // To filter by DEO's district
});

module.exports = mongoose.model('Issue', IssueSchema);
