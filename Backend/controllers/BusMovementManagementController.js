const busMovementModel = require('../models/BusMovementManagementModel');

class BusMovementController {
    async registerBusMovement(req, res) {
        try {
            const { busName, origin, destination, wedays, moveDate, moveTime } = req.body;

            if (!busName || !origin || !destination || !wedays || !moveDate || !moveTime) {
                return res.status(400).json({ message: "لطفاً تمام فیلدهای الزامی را پر کنید." });
            }

            const newBusMovement = new busMovementModel({ busName, origin, destination, wedays, moveDate, moveTime });
            await newBusMovement.save();
            res.status(201).json(newBusMovement);
        } catch (error) {
            console.error("Error registering bus movement:", error.message);
            res.status(500).json({ message: "خطا در ثبت اطلاعات مسیر." });
        }
    }


    async deleteBusMovement(req, res) {
        try {
            const { id } = req.params;
            await busMovementModel.findByIdAndDelete(id);
            res.status(200).json({ message: "Bus movement deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateBusMovement(req, res) {
        try {
            const { id } = req.params;
            console.log("Updating bus movement with id:", id, "Data:", req.body); // Log for editing
            const updatedBusMovement = await busMovementModel.findByIdAndUpdate(id, req.body, { new: true });
            res.status(200).json(updatedBusMovement);
        } catch (error) {
            console.error("Error updating bus movement:", error);
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = BusMovementController;
