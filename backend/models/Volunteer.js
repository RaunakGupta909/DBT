const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
  name: String,
  aadhaar: {type:String, unique:true},
  mobile: String,
  verified: {type:Boolean, default:false},
  credits: {type:Number, default:0},
  checks: [{aadhaar:String, date:Date}]
});

module.exports = mongoose.model('Volunteer', VolunteerSchema);
