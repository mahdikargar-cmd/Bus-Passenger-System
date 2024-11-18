const express = require('express');
const router = express.Router();
const Bus = require('../models/BusManagementModel');

// Get all buses
router.get('/', async (req, res) => {
    try {
        const buses = await Bus.find();
        res.json(buses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new bus
router.post('/registerBus', async (req, res) => {
    const bus = new Bus(req.body);
    try {
        const newBus = await bus.save();
        res.status(201).json(newBus);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a bus
router.patch('/updateBus/:id', async (req, res) => {
    try {
        const updatedBus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBus) {
            return res.status(404).json({ message: 'Bus not found' });
        }
        res.json(updatedBus);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a bus
router.delete('/deleteBus/:id', async (req, res) => {
    try {
        const bus = await Bus.findByIdAndDelete(req.params.id);
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }
        res.json({ message: 'Bus deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
