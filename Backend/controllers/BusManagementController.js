const BusModel = require('../models/BusManagementModel');

class BusManagementController {
    async registerBus(req, res) {
        try {
            const newBus = new BusModel(req.body);
            await newBus.save();
            res.status(201).json(newBus);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteBus(req, res) {
        try {
            const { id } = req.params;
            await BusModel.findByIdAndDelete(id);
            res.status(200).json({ message: "Bus deleted successfully .." });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateBus(req, res) {
        try {
            const { id } = req.params;
            const updatedBus = await BusModel.findByIdAndUpdate(id, req.body, { new: true });
            res.status(200).json(updatedBus);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = BusManagementController;
