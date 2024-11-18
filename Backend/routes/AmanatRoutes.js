const express = require("express");
const AmanatController = require("../controllers/AmanatController");
const AmanatModel = require("../models/AmanatModel"); // Make sure this import exists
const router = express.Router();
const amanatController = new AmanatController();

router.post("/registerAmanat", amanatController.registerAmanat);
router.delete('/deleteAmanat/:user', amanatController.deleteAmanat);
router.patch('/updateAmanat/:user', amanatController.updateAmanat);
router.get('/', async (req, res) => {
    try {
        const amanat = await AmanatModel.find();
        res.status(200).json(amanat);
    } catch (error) {
        console.error("Error fetching Amanats:", error); // Log the error for debugging
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
