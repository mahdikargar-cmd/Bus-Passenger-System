const ServicesModel = require('../models/ServicesModel');

// Get all services
const getAllServices = async (req, res) => {
    try {
        const services = await ServicesModel.find()
            .populate('CompanyName')
            .populate('busName')
            .populate('SelectedRoute')
            .populate('ServicesOption');
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get service by ID
const getServiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const service = await ServicesModel.findById(id)
            .populate('CompanyName')
            .populate('busName')
            .populate('SelectedRoute')
            .populate('ServicesOption');
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new service
const createService = async (req, res) => {
    const { CompanyName, busName, BusType, SelectedRoute, moveDate, moveTime, ChairCapacity, ticketPrice, ServicesOption } = req.body;
    try {
        const newService = new ServicesModel({
            CompanyName,
            busName,
            BusType,
            SelectedRoute,
            moveDate,
            moveTime,
            ChairCapacity,
            ticketPrice,
            ServicesOption
        });
        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a service
const updateService = async (req, res) => {
    const { id } = req.params;
    const { CompanyName, busName, BusType, SelectedRoute, moveDate, moveTime, ChairCapacity, ticketPrice, ServicesOption } = req.body;
    try {
        const updatedService = await ServicesModel.findByIdAndUpdate(
            id,
            {
                CompanyName,
                busName,
                BusType,
                SelectedRoute,
                moveDate,
                moveTime,
                ChairCapacity,
                ticketPrice,
                ServicesOption,
                updatedAt: Date.now()
            },
            { new: true }
        );
        if (!updatedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(updatedService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a service
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

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};
