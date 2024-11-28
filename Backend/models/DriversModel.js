const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    codeMelli: {
        type: String,
        required: true,
        unique: true
    },
    numberPhone: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },

    dateOfBirth: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

const DriverModel = mongoose.model("Drivers", DriverSchema);
module.exports = DriverModel;
