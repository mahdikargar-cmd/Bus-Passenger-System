const express = require('express');
const router = express.Router();
const SeatStatus = require('../models/SeatStatusModel');
const Service = require('../models/ServicesModel');

// Endpoint to get seat statuses for a service
router.get('/get/:serviceId', async (req, res) => {
    try {
        const service = await Service.findById(req.params.serviceId).populate('seatStatuses');
        if (!service) return res.status(404).json({ message: 'Service not found' });
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Endpoint to book seats for a service
router.post('/:serviceId/book', async (req, res) => {
    const { seats } = req.body;
    try {
        await SeatStatus.updateMany(
            { serviceId: req.params.serviceId, seatNumber: { $in: seats } },
            { $set: { isBooked: true } }
        );
        res.status(200).json({ message: 'Seats booked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
