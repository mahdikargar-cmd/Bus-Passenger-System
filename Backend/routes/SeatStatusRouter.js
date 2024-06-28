const express = require('express');
const { updateSeatStatus, getSeatStatuses } = require('../controllers/SeatStatusController');
const router = express.Router();

router.patch('/:serviceId/:seatNumber', updateSeatStatus);
router.get('/:serviceId', getSeatStatuses);

module.exports = router;
