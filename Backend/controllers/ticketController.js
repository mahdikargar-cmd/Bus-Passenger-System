const TicketModel = require('../models/TicketModel');
const SeatStatusModel = require('../models/SeatStatusModel');
const mongoose=require('mongoose')
const deleteTicketAndSeat = async (req, res) => {
    const { ticketId, serviceId, seatNumber } = req.params;

    if (!mongoose.Types.ObjectId.isValid(ticketId) || !mongoose.Types.ObjectId.isValid(serviceId)) {
        return res.status(400).json({ message: "Invalid ID(s)" });
    }

    try {
        // حذف بلیط
        const ticket = await TicketModel.findByIdAndDelete(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'بلیط پیدا نشد  ' });
        }

        // به‌روز رسانی وضعیت صندلی
        const seatStatus = await SeatStatusModel.findOneAndUpdate(
            { serviceId, seatNumber },
            { isOccupied: false, ticketNumber: null },
            { new: true }
        );

        if (!seatStatus) {
            return res.status(404).json({ message: 'Seat status not found' });
        }

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
        const ticket = new TicketModel(req.body);
        await ticket.save();
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    deleteTicketAndSeat,
    getTicketsByNumber,
    createTicket
};
