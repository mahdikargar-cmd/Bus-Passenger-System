const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Cities: {
        type: String,
        required: true,
    }
});

const DestinationsModel = mongoose.model('Destinations', UserSchema);

module.exports = DestinationsModel;
