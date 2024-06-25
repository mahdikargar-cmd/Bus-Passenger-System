const mongoose = require('mongoose');

const ServicesSchema = new mongoose.Schema({
    CompanyName: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    busName: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true, index: true },
    BusType: { type: String, required: true },
    SelectedRoute: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true, index: true },
    movementDate: { type: Date, required: true },
    movementTime: { type: String, required: true },
    ChairCapacity: { type: Number, required: true },
    ticketPrice: { type: String, required: true },
    ServicesOption: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ServicesOption', required: true }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const ServicesModel = mongoose.model("Services", ServicesSchema);

module.exports = ServicesModel;
