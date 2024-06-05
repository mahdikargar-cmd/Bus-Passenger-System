const express = require("express");
const BusManagementController = require("../controllers/BusManagementController");
const BusModel = require('../models/BusManagementModel');
const router = express.Router();

const busController = new BusManagementController();

router.post("/registerBus", (req, res) => busController.registerBus(req, res));
router.delete('/deleteBus/:id', (req, res) => busController.deleteBus(req, res));
router.patch('/updateBus/:id', (req, res) => busController.updateBus(req, res));
router.get('/', async (req, res) => {
    try {
        const buses = await BusModel.find();
        res.status(200).json(buses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
