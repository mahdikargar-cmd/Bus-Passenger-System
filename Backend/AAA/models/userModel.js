const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    family: {
        type: String
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    }
});

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;
