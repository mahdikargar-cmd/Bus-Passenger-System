const express = require("express");
const DriverController = require("../controllers/DriverController");
const DriverModel = require("../models/DriverReportModel");
const router = express.Router();
const DriversController = new DriverController();

router.post("/registerDriver", DriversController.registerDrivers);

router.get('/', async (req, res) => {
    try {
        const Drivers = await DriverModel.find();
        res.status(200).json(Drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
