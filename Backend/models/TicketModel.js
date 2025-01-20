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
        CompanyName: {
            CoperativeName: { type: String, required: true },
        },
        SelectedRoute: {
            origin: { Cities: { type: String, required: true } },
            destination: { Cities: { type: String, required: true } },
        },
        movementDate: {
            moveDate: { type: Date, required: true },
        },
        ChairCapacity: { capacity: { type: Number, required: true } },
        ticketPrice: { type: String, required: true },
    },
    ticketNumber: { type: String, required: true },
    bookingDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    paymentStatus: { type: String, default: 'pending' },
    paymentDate: { type: Date },
});

const TicketModel = mongoose.model('Ticket', ticketSchema);

module.exports = TicketModel;
