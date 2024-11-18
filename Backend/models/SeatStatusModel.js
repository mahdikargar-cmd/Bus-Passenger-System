const mongoose = require('mongoose');

const SeatStatusSchema = new mongoose.Schema({
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Services', required: true },
    seatNumber: { type: Number, required: true },
    isOccupied: { type: Boolean, default: false },
    ticketNumber: { type: String, default: null }
});

const SeatStatusModel = mongoose.model('SeatStatus', SeatStatusSchema);

module.exports = SeatStatusModel;
