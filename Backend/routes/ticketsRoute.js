const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const TicketModel=require('../models/TicketModel');
const SeatStatusModel=require('../models/SeatStatusModel')
router.get('/number/:ticketNumber', ticketController.getTicketsByNumber);
router.delete('/number/:ticketNumber', async (req, res) => {
    const { ticketNumber } = req.params;
    try {
        await TicketModel.deleteMany({ ticketNumber });
        await SeatStatusModel.deleteMany({ ticketNumber });
        res.status(200).send({ message: 'Tickets and seat statuses deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting tickets and seat statuses', error });
    }
});
router.post('/addTicket', ticketController.createTicket);

module.exports = router;
