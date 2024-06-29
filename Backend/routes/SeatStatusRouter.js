const express = require('express');
const { updateSeatStatus, getSeatStatuses, deleteSeatStatusesByService } = require('../controllers/SeatStatusController');
const router = express.Router();

router.patch('/:serviceId/:seatNumber', updateSeatStatus);
router.get('/:serviceId', getSeatStatuses);
router.delete('/:serviceId', deleteSeatStatusesByService); // این مسیر تمام وضعیت‌های صندلی مربوط به یک سرویس را حذف می‌کند

module.exports = router;
