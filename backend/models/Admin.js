const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  role: {type:String, default:'admin'},
  schoolId: String
});

module.exports = mongoose.model('Admin', AdminSchema);
