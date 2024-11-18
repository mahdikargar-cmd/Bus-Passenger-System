const mongoose = require('mongoose');

const AmanatSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    }
});

const Amanat = mongoose.model('Amanat', AmanatSchema);

module.exports = Amanat;
