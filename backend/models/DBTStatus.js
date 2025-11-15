const mongoose = require('mongoose');

const DBTStatusSchema = new mongoose.Schema({
  aadhaar: String,
  linkedWithBank: Boolean,
  dbtEnabled: Boolean,
  lastUpdated: Date,
  amount: Number
});

module.exports = mongoose.model('DBTStatus', DBTStatusSchema);
