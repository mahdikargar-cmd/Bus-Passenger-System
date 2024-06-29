const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    weight: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}


});

const CoperativeModel = mongoose.model('Amanat', UserSchema);

module.exports = CoperativeModel;
