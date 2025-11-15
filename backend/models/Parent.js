const mongoose = require('mongoose');

const ParentSchema = new mongoose.Schema({
  name: String,
  aadhaar: {type:String, unique:true},
  mobile: String,
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

module.exports = mongoose.model('Parent', ParentSchema);
