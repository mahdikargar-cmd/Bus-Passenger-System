const express = require("express");
const DriverController = require("../controllers/DriverController");
const DriverModel = require("../models/DriversModel");
const router = express.Router();
const DriversController = new DriverController();

router.post("/registerDriver", DriversController.registerDrivers);
router.patch('/updateDriver/:id', DriversController.updateDrivers);
router.delete('/deleteDriver/:id', DriversController.deleteDrivers);
router.get('/', async (req, res) => {
    try {
        const Drivers = await DriverModel.find();
        res.status(200).json(Drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
