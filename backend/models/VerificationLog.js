const mongoose = require('mongoose');

const VerificationLogSchema = new mongoose.Schema({
  aadhaar: String,
  checkedBy: String, // volunteer or teacher id
  role: String,
  date: Date,
  result: String
});

module.exports = mongoose.model('VerificationLog', VerificationLogSchema);
