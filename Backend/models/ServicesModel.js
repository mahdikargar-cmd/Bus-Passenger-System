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

// Middleware to create seat statuses based on ChairCapacity
ServicesSchema.pre('save', async function (next) {
    if (this.isNew) {
        const SeatStatus = require('./SeatStatusModel');
        const seatStatuses = [];
        for (let i = 0; i < this.ChairCapacity; i++) {
            seatStatuses.push({ serviceId: this._id, seatNumber: i + 1 });
        }
        await SeatStatus.insertMany(seatStatuses);
    }
    next();
});

const ServicesModel = mongoose.model("Services", ServicesSchema);

module.exports = ServicesModel;