const mongoose = require('mongoose');

const DriverReportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    codeMelli: {
        type: String,
        required: true
    },
    numberPhone: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
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

const DriverReportModel = mongoose.model("DriverReport", DriverReportSchema);
module.exports = DriverReportModel;
