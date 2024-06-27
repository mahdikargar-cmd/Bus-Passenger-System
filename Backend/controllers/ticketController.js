const Ticket = require('../models/TicketModel');

exports.createTicket = async (req, res) => {
    try {
        const newTicket = new Ticket(req.body);
        const savedTicket = await newTicket.save();
        res.status(201).json(savedTicket);
    } catch (error) {
        res.status(500).json({ message: 'Error creating ticket', error });
    }
};

// Other controller methods (getAllTickets, getTicketById, updateTicket, deleteTicket) can remain as they are
