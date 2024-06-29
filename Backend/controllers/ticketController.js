// controllers/ticketController.js
const Ticket = require('../models/TicketModel');
const SeatStatus = require('../models/SeatStatusModel');

exports.createTicket = async (req, res) => {
    try {
        const newTicket = new Ticket(req.body);
        const savedTicket = await newTicket.save();

        // Update seat status to occupied
        await SeatStatus.updateOne(
            { serviceId: savedTicket.serviceDetails._id, seatNumber: savedTicket.seatNumber },
            { isOccupied: true, ticketNumber: savedTicket._id },
            { upsert: true }
        );

        res.status(201).json(savedTicket);
    } catch (error) {
        res.status(500).json({ message: 'Error creating ticket', error });
    }
};

exports.cancelTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Update seat status to not occupied
        await SeatStatus.updateOne(
            { serviceId: ticket.serviceDetails._id, seatNumber: ticket.seatNumber },
            { isOccupied: false, ticketNumber: null }
        );

        // Delete the ticket
        await Ticket.findByIdAndDelete(ticketId);

        res.status(200).json({ message: 'Ticket cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling ticket', error });
    }
};

exports.getTicketsByPhone = async (req, res) => {
    try {
        const { phone } = req.params;
        const tickets = await Ticket.find({ phone });

        if (!tickets.length) {
            return res.status(404).json({ message: 'No tickets found for this phone number' });
        }

        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tickets', error });
    }
};
