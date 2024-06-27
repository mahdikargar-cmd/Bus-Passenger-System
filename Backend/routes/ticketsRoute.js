const express = require('express');
const router = express.Router();
const { createTicket } = require('../controllers/ticketController');

// Define the POST route for creating a ticket
router.post('/', createTicket);

module.exports = router;
