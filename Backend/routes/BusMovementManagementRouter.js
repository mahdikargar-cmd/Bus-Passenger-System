const express = require("express");
const BusMovementController = require("../controllers/BusMovementManagementController");
const router = express.Router();

const busMovementController = new BusMovementController();

router.post("/registerBusMovement", (req, res) => busMovementController.registerBusMovement(req, res));
router.get("/", (req, res) => busMovementController.getBusMovements(req, res));
router.delete('/deleteBusMovement/:id', (req, res) => busMovementController.deleteBusMovement(req, res));
router.patch('/updateBusMovement/:id', (req, res) => busMovementController.updateBusMovement(req, res));

module.exports = router;
