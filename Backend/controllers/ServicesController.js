const ServicesModel = require('../models/ServicesModel');
const mongoose = require('mongoose');

const createService = async (req, res) => {
    try {
        const {
            CompanyName,
            busName,
            BusType,
            SelectedRoute,
            movementDate,
            movementTime,
            ChairCapacity,
            ticketPrice,
            ServicesOption
        } = req.body;

        // Validate required fields
        const requiredFields = ['CompanyName', 'busName', 'BusType', 'SelectedRoute',
            'movementDate', 'movementTime', 'ChairCapacity', 'ticketPrice'];

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Missing required fields',
                fields: missingFields
            });
        }

        const newService = new ServicesModel({
            CompanyName,
            busName,
            BusType,
            SelectedRoute,
            movementDate,
            movementTime,
            ChairCapacity,
            ticketPrice: Number(ticketPrice),
            ServicesOption: ServicesOption || []
        });

        const savedService = await newService.save();

        // Populate the saved service with referenced data
        const populatedService = await ServicesModel.findById(savedService._id)
            .populate('CompanyName')
            .populate('busName')
            .populate('SelectedRoute')
            .populate('ServicesOption');

        res.status(201).json(populatedService);
    } catch (error) {
        console.error('Error creating service:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validation Error', errors });
        }

        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const updateService = async (req, res) => {
    const { id } = req.params;
    const { CompanyName, busName, BusType, SelectedRoute, movementDate, movementTime, ChairCapacity, ticketPrice, ServicesOption } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid service ID' });
        }

        const updatedService = await ServicesModel.findByIdAndUpdate(
            id,
            {
                CompanyName,
                busName,
                BusType,
                SelectedRoute,
                movementDate,
                movementTime,
                ChairCapacity,
                ticketPrice: Number(ticketPrice),
                ServicesOption: ServicesOption || [],
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedService) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.status(200).json(updatedService);
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ message: error.message });
    }
};

const deleteService = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedService = await ServicesModel.findByIdAndDelete(id);
        if (!deletedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getServiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const service = await ServicesModel.findById(id)
            .populate('CompanyName', 'CoperativeName')
            .populate('busName', 'busName')
            .populate('BusType', 'busType')
            .populate({
                path: 'SelectedRoute',
                select: 'origin destination',
                populate: [
                    { path: 'origin', select: 'Cities' },
                    { path: 'destination', select: 'Cities' }
                ]
            })
            .populate('movementDate', 'moveDate')
            .populate('movementTime', 'moveTime')
            .populate('ChairCapacity', 'capacity')
            .populate('ServicesOption', 'facilities');

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getServiceById,
    createService,
    updateService,
    deleteService
};
