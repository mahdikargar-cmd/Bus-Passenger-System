const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    nationalCode: { type: String, required: true },
    birthDate: { type: String, required: true },
    gender: { type: String, required: true },
    seatNumber: { type: Number, required: true },
    serviceDetails: {
        CompanyName: { type: String, required: true },
        busName: { type: String, required: true },
        BusType: { type: String, required: true },
        SelectedRoute: { type: String, required: true },
        movementDate: { type: String, required: true },
        movementTime: { type: String, required: true },
        ChairCapacity: { type: Number, required: true },
        ticketPrice: { type: Number, required: true },
        ServicesOption: { type: [String], required: true }, // Changed to array of strings
    },
    createdAt: { type: Date, default: Date.now }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
