const mongoose = require('mongoose');
const moment = require('moment-jalaali');

const busMovementSchema = new mongoose.Schema({
    busName: {type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true},
    origin: {type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true},
    destination: {type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true},
    days: {type: [String], required: true},
    moveDate: { type: Date, required: true },
    moveTime: { type: Date, required: true },
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

const busMovementModel = mongoose.model("busMovement", busMovementSchema);

module.exports = busMovementModel;
