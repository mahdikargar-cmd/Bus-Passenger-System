const express = require("express");
const CooperativeController = require("../controllers/AmanatController");
const AmanatModel = require("../models/AmanatModel");
const router = express.Router();
const AmanatController = new CooperativeController();

router.post("/registerAmanat", AmanatController.registerAmanat);
router.delete('/deleteAmanat/:AmanatName', AmanatController.deleteAmanat);
router.patch('/updateAmanat/:AmanatName', AmanatController.updateAmanat);
router.get('/', async (req, res) => {
    try {
        const Amanat = await AmanatModel.find();
        res.status(200).json(Amanat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
