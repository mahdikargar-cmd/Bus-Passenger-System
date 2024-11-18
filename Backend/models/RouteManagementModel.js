const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
    busName: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    origin: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    wedays: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

RouteSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const RouteModel = mongoose.model('Route', RouteSchema);

module.exports = RouteModel;
