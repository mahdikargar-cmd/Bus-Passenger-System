const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
    busName: { type: String, required: true },
    companyName: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coperative', required: true }], // آرایه از ObjectId
    routes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destinations', required: true }],
    busType: { type: String, required: true },
    facilities: { type: [String], required: true },
    capacity: { type: Number, required: true },
    driverIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// به‌روزرسانی زمان ویرایش
BusSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const BusModel = mongoose.model('BusManagement', BusSchema);

module.exports = BusModel;
