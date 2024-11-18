const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  CoperativeName: {
    type: String,
    required: true,
    unique:true
  },
  CoperativeManagement: {
    type: String,
    required: true
  }



});

const CoperativeModel = mongoose.model('Coperative', UserSchema);

module.exports = CoperativeModel;
