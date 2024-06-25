const mongoose = require('mongoose');

const SeatStatusSchema = new mongoose.Schema({
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Services', required: true },
    seatNumber: { type: Number, required: true },
    isBooked: { type: Boolean, default: false }
});

const SeatStatus = mongoose.model("SeatStatus", SeatStatusSchema);

module.exports = SeatStatus;
