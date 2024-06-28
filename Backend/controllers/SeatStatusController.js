const SeatStatusModel = require('../models/SeatStatusModel');

const updateSeatStatus = async (req, res) => {
    const { serviceId, seatNumber } = req.params;
    const { isOccupied, ticketNumber } = req.body;

    try {
        const seatStatus = await SeatStatusModel.findOneAndUpdate(
            { serviceId, seatNumber },
            { isOccupied, ticketNumber },
            { new: true, upsert: true } // upsert: true will create the document if it doesn't exist
        );

        res.status(200).json(seatStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSeatStatuses = async (req, res) => {
    const { serviceId } = req.params;

    try {
        const seatStatuses = await SeatStatusModel.find({ serviceId });
        res.status(200).json(seatStatuses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    updateSeatStatus,
    getSeatStatuses
};
