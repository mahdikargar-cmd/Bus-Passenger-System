/*
const BusMovementModel = require('../models/BusMovementManagementModel');  // اصلاح به مدل BusMovement


class RouteManagementController {
    async registerRoute(req, res) {
        try {
            const newRoute = new BusMovementModel(req.body);  // استفاده از BusMovementModel برای ذخیره
            await newRoute.save();
            res.status(201).json(newRoute);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteRoute(req, res) {
        try {
            const { id } = req.params;
            await BusMovementModel.findByIdAndDelete(id);  // حذف از مدل BusMovement
            res.status(200).json({ message: "Route deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateRoute(req, res) {
        try {
            const { id } = req.params;
            const updatedRoute = await BusMovementModel.findByIdAndUpdate(id, req.body, { new: true });
            res.status(200).json(updatedRoute);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // بارگذاری اطلاعات حرکت اتوبوس با استفاده از populate
    async getRoutes(req, res) {
        try {
            const routes = await BusMovementModel.find()
                .populate('busName', 'busName')  // بارگذاری نام اتوبوس از مدل Bus
                .populate('origin', 'name')     // بارگذاری نام مبدا از مدل City
                .populate('destination', 'name') // بارگذاری نام مقصد از مدل City
                .exec();
            res.status(200).json(routes);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = RouteManagementController;
*/
