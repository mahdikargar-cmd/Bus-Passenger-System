const mongoose = require('mongoose');

const busMovementSchema = new mongoose.Schema(
    {
        busName: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
        origin: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
        destination: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
        wedays: { type: [String], required: true },
        moveDate: { type: Date, required: true },
        moveTime: { type: String, required: true }, // ساعت حرکت
    },
    { timestamps: true } // این خط زمان ایجاد و بروزرسانی را خودکار اضافه می‌کند
);

const busMovementModel = mongoose.model("busMovement", busMovementSchema);

module.exports = busMovementModel;
