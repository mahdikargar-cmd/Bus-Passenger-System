const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    family: { type: String },
    phoneNumber: { type: String, required: true, unique: true },
    tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }]
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
