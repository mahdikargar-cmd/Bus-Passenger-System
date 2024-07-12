const express = require("express");
const Service=require('../models/ServicesModel')
const {
    getServiceById,
    createService,
    updateService,
    deleteService
} = require("../controllers/ServicesController");
const ServicesModel = require("../models/ServicesModel");
const router = express.Router();
const RouteModel = require('../models/RouteManagementModel');
const CityModel = require('../models/DestinationsModel');

router.post("/registerService", createService);
router.patch('/updateService/:id', async (req, res) => {
    try {
        const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedService) {
            return res.status(404).send("Service not found");
        }
        res.status(200).send(updatedService);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete('/deleteService/:id', async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);
        if (!deletedService) {
            return res.status(404).send("Service not found");
        }
        res.status(200).send("Service deleted");
    } catch (err) {
        res.status(500).send(err);
    }
});
router.get('/:id', getServiceById);
router.get('/services', async (req, res) => {
    try {
        const { origin, destination } = req.query;
        let filter = {};

        if (origin && destination) {
            const originCity = await CityModel.findOne({ Cities: origin });
            const destinationCity = await CityModel.findOne({ Cities: destination });
            if (originCity && destinationCity) {
                const route = await RouteModel.findOne({ origin: originCity._id, destination: destinationCity._id });
                if (route) {
                    filter.SelectedRoute = route._id;
                }
            }
        }

        const services = await ServicesModel.find(filter)
            .populate('CompanyName')
            .populate('busName')
            .populate('SelectedRoute')
            .populate('ServicesOption');

        res.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).send('Server Error');
    }
});
router.get('/', async (req, res) => {
    try {
        const ServiceModel = await ServicesModel.find();
        res.status(200).json(ServiceModel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
