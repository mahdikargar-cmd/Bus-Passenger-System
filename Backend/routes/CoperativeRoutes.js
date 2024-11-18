const express = require("express");
const CooperativeController = require("../controllers/CooperativeManagementController");
const CooperativeModel = require("../models/Cooperative_Management_Model");
const router = express.Router();
const cooperativeController = new CooperativeController();

router.post("/registercoperative", cooperativeController.registerCoperative);
router.delete('/deletecoperative/:CoperativeName', cooperativeController.deleteCoperative);
router.patch('/updatecoperative/:CoperativeName', cooperativeController.updateCoperative);
router.get('/', async (req, res) => {
    try {
        const cooperatives = await CooperativeModel.find();
        res.status(200).json(cooperatives);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
