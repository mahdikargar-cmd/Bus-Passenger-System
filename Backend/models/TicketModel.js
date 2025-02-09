const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    passengerInfo: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true },
        nationalCode: { type: String, required: true },
        birthDate: { type: String, required: true },
        gender: { type: String, required: true },
    },
    seatInfo: {
        seatNumber: { type: Number, required: true },
        isOccupied: { type: Boolean, required: true },
        ticketNumber: { type: String, required: true },
    },
    serviceInfo: {
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }, // اضافه کردن serviceId
        companyName: { type: String, required: true },
        origin: { type: String, required: true },
        destination: { type: String, required: true },
        movementDate: { type: Date, required: true },
        chairCapacity: { type: Number, required: true },
        ticketPrice: { type: Number, required: true },
    },
    ticketNumber: { type: String, required: true },
    bookingDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    paymentStatus: { type: String, default: 'pending' },
    paymentDate: { type: Date },
});

const TicketModel = mongoose.model('Ticket', ticketSchema);

module.exports = TicketModel;
