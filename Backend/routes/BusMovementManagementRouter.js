const express = require("express");
const BusMovementController = require("../controllers/BusMovementManagementController");
const router = express.Router();
const busMovementModel=require('../models/BusMovementManagementModel')
const busMovementController = new BusMovementController();

router.post("/registerBusMovement", (req, res) => busMovementController.registerBusMovement(req, res));
router.get('/', async (req, res) => {
    try {
        const Drivers = await busMovementModel.find();
        res.status(200).json(Drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.delete('/deleteBusMovement/:id', (req, res) => busMovementController.deleteBusMovement(req, res));
router.patch('/updateBusMovement/:id', (req, res) => busMovementController.updateBusMovement(req, res));

module.exports = router;
