const express = require("express");
const DestinationsController = require("../controllers/DestinationsController");
const DestinationModel = require("../models/DestinationsModel");
const router = express.Router();
const cooperativeController = new DestinationsController();

router.post("/registerDestination", cooperativeController.registerDestination);
router.patch('/updateDestination/:id', cooperativeController.updateDestinations);
router.delete('/deleteDestination/:id', cooperativeController.deleteDestination);
router.get('/', async (req, res) => {
    try {
        const Destinations = await DestinationModel.find();
        res.status(200).json(Destinations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
