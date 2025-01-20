const express = require('express');
const {  getSeatStatuses, deleteSeatStatusesByService } = require('../controllers/SeatStatusController');
const SeatStatus = require("../models/SeatStatusModel");
const router = express.Router();

// به‌روزرسانی وضعیت صندلی بر اساس شماره سرویس و شماره صندلی
router.patch("/:serviceId/:seatNumber", async (req, res) => {
    const { serviceId, seatNumber } = req.params;
    const { isOccupied, ticketNumber } = req.body;

    try {
        const updatedSeat = await SeatStatus.findOneAndUpdate(
            { serviceId, seatNumber }, // فیلتر برای پیدا کردن صندلی مورد نظر
            { isOccupied, ticketNumber }, // به‌روزرسانی داده‌ها
            { new: true, upsert: true } // ایجاد صندلی جدید اگر موجود نبود
        );

        res.status(200).json({
            message: "Seat status updated successfully",
            seat: updatedSeat,
        });
    } catch (error) {
        console.error("Error updating seat status:", error);
        res.status(500).json({
            message: "Server error while updating seat status",
            error,
        });
    }
});

/*router.patch('/:serviceId/:seatNumber', updateSeatStatus);*/
router.get('/:serviceId', getSeatStatuses);
router.delete('/:serviceId', deleteSeatStatusesByService); // این مسیر تمام وضعیت‌های صندلی مربوط به یک سرویس را حذف می‌کند

module.exports = router;
