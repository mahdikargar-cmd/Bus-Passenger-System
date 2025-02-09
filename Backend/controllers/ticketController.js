const TicketModel = require('../models/TicketModel');
const SeatStatusModel = require('../models/SeatStatusModel');
const mongoose=require('mongoose')
const deleteTicketAndSeat = async (req, res) => {
    const { ticketId, serviceId, seatNumber } = req.params;

    if (!mongoose.Types.ObjectId.isValid(ticketId) || !mongoose.Types.ObjectId.isValid(serviceId)) {
        return res.status(400).json({ message: "Invalid ID(s)" });
    }

    try {
        const ticket = await TicketModel.findByIdAndDelete(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'بلیط پیدا نشد' });
        }

        await SeatStatusModel.findOneAndUpdate(
            { serviceId, seatNumber },
            { isOccupied: false, ticketNumber: null },
            { new: true }
        );

        res.status(200).json({ message: 'بلیط با موفقیت لغو شد' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTicketsByNumber = async (req, res) => {
    const { ticketNumber } = req.params;

    try {
        const ticket = await TicketModel.findOne({ ticketNumber }).populate('serviceDetails');
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTicket = async (req, res) => {
    try {
        const {
            passengerInfo,
            seatInfo,
            serviceInfo,
            ticketNumber,
            bookingDate,
            totalPrice,
            paymentStatus,
            paymentDate,
        } = req.body;

        if (!passengerInfo || !seatInfo || !serviceInfo || !ticketNumber || !bookingDate || !totalPrice) {
            return res.status(400).json({ message: 'برخی از فیلدهای ضروری خالی است' });
        }

        const ticket = new TicketModel({
            passengerInfo,
            seatInfo,
            serviceInfo: {
                serviceId: new mongoose.Types.ObjectId(serviceInfo.serviceId), // مقدار serviceId اضافه شد
                companyName: serviceInfo.CompanyName.CoperativeName,
                origin: serviceInfo.SelectedRoute.origin.Cities,
                destination: serviceInfo.SelectedRoute.destination.Cities,
                movementDate: serviceInfo.movementDate.moveDate,
                chairCapacity: serviceInfo.ChairCapacity.capacity,
                ticketPrice: serviceInfo.ticketPrice,
            },
            ticketNumber,
            bookingDate,
            totalPrice,
            paymentStatus: paymentStatus || 'pending',
            paymentDate,
        });

        await ticket.save();
        res.status(201).json({ message: 'بلیط با موفقیت ذخیره شد', ticket });
    } catch (error) {
        console.error('خطا در ذخیره بلیط:', error);
        res.status(500).json({ message: 'خطا در ذخیره اطلاعات بلیط', error });
    }
};

module.exports = {
    deleteTicketAndSeat,
    getTicketsByNumber,
    createTicket
};
