const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
    busName: {type: String, required: true},
    companyName: {type: String, required: true},
    routes: {type: [String], required: true},
    busType: {type: String, required: true},
    facilities: {type: [String], required: true},
    capacity: {type: Number, required: true},
    driverIds: [{type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true}], // Changed to array
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

BusSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const BusModel = mongoose.model('BusManagement', BusSchema);

module.exports = BusModel;
