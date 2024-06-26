const express = require('express');
const { createTicket, getTicketById, updateTicket, deleteTicket } = require('../controllers/ticketController');

const router = express.Router();

router.post('/', createTicket);
router.get('/:id', getTicketById);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);

module.exports = router;
