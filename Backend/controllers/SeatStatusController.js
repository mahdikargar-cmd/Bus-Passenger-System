const SeatStatusModel = require('../models/SeatStatusModel');
const mongoose = require("mongoose");

const updateSeatStatus = async (req, res) => {
    const { serviceId, seatNumber } = req.params;
    const { isOccupied, ticketNumber } = req.body;

    if (! mongoose.Types.ObjectId.isValid(serviceId)) {
        return res.status(400).json({ message: "Invalid service ID" });
    }

    try {
        const seatStatus = await SeatStatusModel.findOneAndUpdate(
            { serviceId, seatNumber },
            { isOccupied, ticketNumber },
            { new: true, upsert: true }
        );

        res.status(200).json(seatStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSeatStatuses = async (req, res) => {
    const { serviceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        return res.status(400).json({ message: "Invalid service ID" });
    }

    try {
        const seatStatuses = await SeatStatusModel.find({ serviceId });
        res.status(200).json(seatStatuses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSeatStatusesByService = async (req, res) => {
    const { serviceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        return res.status(400).json({ message: "Invalid service ID" });
    }

    try {
        const result = await SeatStatusModel.deleteMany({ serviceId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No seat statuses found for the given service ID' });
        }
        res.status(200).json({ message: 'Seat statuses deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    updateSeatStatus,
    getSeatStatuses,
    deleteSeatStatusesByService
};
