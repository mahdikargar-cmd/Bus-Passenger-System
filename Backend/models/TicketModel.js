const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    nationalCode: { type: String, required: true },
    birthDate: { type: String, required: true },
    gender: { type: String, required: true },
    seatNumber: { type: Number, required: true },
    serviceDetails: {
        ServicesOption: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ServiceOption' }],
        CompanyName: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        busName: { type: mongoose.Schema.Types.ObjectId, ref: 'BusManagement' },
        BusType: { type: String, required: true },
        SelectedRoute: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
        movementDate: { type: Date, required: true },
        movementTime: { type: String, required: true },
        ChairCapacity: { type: Number, required: true },
        ticketPrice: { type: String, required: true }
    },
    ticketNumber: { type: String, required: true }
});

const TicketModel = mongoose.model('Ticket', ticketSchema);

module.exports = TicketModel;
