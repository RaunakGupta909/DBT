const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: String,
  aadhaar: {type:String, unique:true},
  fatherName: String,
  fatherAadhaar: String,
  mobile: String,
  linkedWithBank: {type:Boolean, default:false},
  dbtEnabled: {type:Boolean, default:false},
  schoolId: String
});

module.exports = mongoose.model('Student', StudentSchema);
