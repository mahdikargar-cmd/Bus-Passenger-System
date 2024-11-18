const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    password: {
        type: String
    }
});

const UserModel = mongoose.model('AdminUser', userSchema);

module.exports = UserModel;
