const express = require("express");
const {
    getAllServices, getServiceById, createService, updateService, deleteService
} = require("../controllers/ServicesController");
const ServicesModel = require("../models/ServicesModel");
const router = express.Router();

router.post("/registerService", createService);
router.delete('/deleteService/:id', deleteService);
router.patch('/updateService/:id', updateService);
router.get('/', async (req, res) => {
    try {
        const ServiceModel = await ServicesModel.find();
        res.status(200).json(ServiceModel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
