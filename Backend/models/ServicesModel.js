const mongoose = require('mongoose');

const ServicesSchema = new mongoose.Schema({
    CompanyName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coperative',
        required: [true, 'Cooperative name is required']
    },
    busName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusManagement',
        required: [true, 'Bus name is required']
    },
    BusType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusManagement',
        required: [true, 'Bus type is required']
    },
    SelectedRoute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'busMovement',
        required: [true, 'Route is required']
    },
    movementDate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'busMovement',
        required: [true, 'Movement date is required']
    },
    movementTime: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'busMovement',
        required: [true, 'Movement time is required']
    },
    ChairCapacity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusManagement',
        required: [true, 'Chair capacity is required']
    },
    ticketPrice: {
        type: Number,
        required: [true, 'Ticket price is required'],
        min: [0, 'Price must be non-negative']
    },
    ServicesOption: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusManagement'
    }]
}, {
    timestamps: true
});

ServicesSchema.index({ movementDate: 1, SelectedRoute: 1 });

const ServicesModel = mongoose.model("Services", ServicesSchema);

module.exports = ServicesModel;