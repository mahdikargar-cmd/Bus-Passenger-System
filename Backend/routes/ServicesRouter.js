const express = require("express");
const ServicesController = require("../controllers/ServicesController");
const ServicesModel = require("../models/ServicesModel");
const router = express.Router();

const servicesController = new ServicesController();

router.post("/registerService", (req, res) => servicesController.InsertServices(req, res));
router.delete('/deleteService/:id', (req, res) => servicesController.deleteServices(req, res));
router.patch('/updateService/:id', (req, res) => servicesController.updateServices(req, res));
router.get('/', async (req, res) => {
    try {
        const services = await ServicesModel.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// افزودن این مسیر برای دریافت جزئیات یک سرویس خاص
router.get('/:id', async (req, res) => {
    try {
        const service = await ServicesModel.findById(req.params.id).populate('seatStatuses');
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
