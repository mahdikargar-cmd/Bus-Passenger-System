const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const TicketModel = require('../models/TicketModel');
const SeatStatusModel = require('../models/SeatStatusModel')
const {Types} = require("mongoose");
router.get('/number/:ticketNumber', ticketController.getTicketsByNumber);
router.delete('/number/:ticketNumber', async (req, res) => {
    const {ticketNumber} = req.params;
    try {
        await TicketModel.deleteMany({ticketNumber});
        await SeatStatusModel.deleteMany({ticketNumber});
        res.status(200).send({message: 'Tickets and seat statuses deleted successfully'});
    } catch (error) {
        res.status(500).send({message: 'Error deleting tickets and seat statuses', error});
    }
});
router.get("/reserved-seats/:serviceId", async (req, res) => {
    try {
        const { serviceId } = req.params;
        const reservedSeats = await TicketModel.find({ "serviceInfo.serviceId": serviceId }, "seatInfo.seatNumber");
        res.json(reservedSeats);
    } catch (error) {
        console.error("خطا در دریافت صندلی‌های رزرو شده:", error);
        res.status(500).json({ message: "خطای سرور" });
    }
});
// routes/ticketRoutes.js
router.post("/addTicket", async (req, res) => {
    try {
        const newTicket = new TicketModel(req.body);
        await newTicket.save();
        res.status(201).json({ message: "بلیط با موفقیت ثبت شد", ticket: newTicket });
    } catch (error) {
        console.error("خطا در ثبت بلیط:", error);
        res.status(500).json({ message: "خطای سرور" });
    }
});

router.patch("/seats/:serviceId/:seatNumber", async (req, res) => {
    try {
        const { serviceId, seatNumber } = req.params;
        const { isOccupied, ticketNumber } = req.body;

        // به‌روزرسانی وضعیت صندلی در مدل SeatStatusModel
        await SeatStatusModel.updateOne(
            { serviceId, seatNumber },
            { isOccupied, ticketNumber }
        );

        res.json({ message: "وضعیت صندلی بروزرسانی شد" });
    } catch (error) {
        console.error("خطا در بروزرسانی وضعیت صندلی:", error);
        res.status(500).json({ message: "خطای سرور" });
    }
});

module.exports = router;
