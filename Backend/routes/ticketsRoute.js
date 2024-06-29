// routes/ticketsRoute.js
const express = require('express');
const router = express.Router();
const { createTicket, cancelTicket, getTicketsByPhone } = require('../controllers/ticketController');

router.post('/', createTicket);
router.delete('/:ticketId', cancelTicket);
router.get('/phone/:phone', getTicketsByPhone);

module.exports = router;
