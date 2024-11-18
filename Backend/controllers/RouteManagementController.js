const RouteModel = require('../models/RouteManagementModel');

class RouteManagementController {
    async registerRoute(req, res) {
        try {
            const newRoute = new RouteModel(req.body);
            await newRoute.save();
            res.status(201).json(newRoute);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteRoute(req, res) {
        try {
            const { id } = req.params;
            await RouteModel.findByIdAndDelete(id);
            res.status(200).json({ message: "Route deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateRoute(req, res) {
        try {
            const { id } = req.params;
            const updatedRoute = await RouteModel.findByIdAndUpdate(id, req.body, { new: true });
            res.status(200).json(updatedRoute);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = RouteManagementController;
