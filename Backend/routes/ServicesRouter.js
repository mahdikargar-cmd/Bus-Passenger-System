const express = require("express");
const mongoose = require('mongoose'); // Add mongoose import
const {
    getServiceById,
    createService,
    updateService,
    deleteService
} = require("../controllers/ServicesController");
const ServicesModel = require("../models/ServicesModel");
const RouteModel = require('../models/BusMovementManagementModel');
const CityModel = require('../models/DestinationsModel');
const moment = require('moment-jalaali');
const router = express.Router();

router.post("/registerService", createService);

router.patch('/updateService/:id', updateService); // Use the imported update function

router.delete('/deleteService/:id', deleteService); // Use the imported delete function

router.get('/:id', getServiceById);

router.get('/services', async (req, res) => {
    try {
        const { origin, destination, date } = req.query;
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

        if (date) {
            const convertedDate = moment(date, 'jYYYY-jMM-jDD').toDate();
            filter.movementDate = {
                $gte: convertedDate,
                $lt: moment(convertedDate).add(1, 'day').toDate()
            };
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
        const services = await ServicesModel.find()
            .populate('ChairCapacity', 'capacity') // فقط مقدار capacity را بیاور
            .populate('CompanyName', 'CoperativeName')
            .populate('busName', 'busName')
            .populate('BusType', 'busType')
            .populate('SelectedRoute', 'origin destination')
            .populate('movementDate', 'moveDate')
            .populate('movementTime', 'moveTime')
            .populate('ServicesOption', 'facilities');
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;