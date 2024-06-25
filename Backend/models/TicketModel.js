const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    company: { type: String, required: true },
    travelDate: { type: Date, required: true },
    travelTime: { type: String, required: true },
    busType: { type: String, required: true },
    seatCount: { type: Number, required: true },
    seatNumber: { type: Number, required: true },
    seatPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'reserved' }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
