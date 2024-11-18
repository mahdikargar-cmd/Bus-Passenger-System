const AmanatModel = require("../models/AmanatModel");

class AmanatController {
    async registerAmanat(req, res) {
        // Code for registering a new amanat (already provided)
    }

    async updateAmanat(req, res) {
        try {
            const { user } = req.params;
            const { user: newAmanat, weight, phoneNumber } = req.body;

            // Validate required fields
            if (!newAmanat || !weight || !phoneNumber) {
                return res.status(400).json({
                    status: "fail",
                    message: "نام تعاونی و وزن و شماره تعاونی اجباری است"
                });
            }

            // Find and update the amanat
            const updatedAmanat = await AmanatModel.findOneAndUpdate(
                { user },
                { user: newAmanat, weight, phoneNumber },
                { new: true, runValidators: true }
            );

            // Handle case where amanat with given user is not found
            if (!updatedAmanat) {
                return res.status(404).json({
                    status: "fail",
                    message: "امانتی با این نام تعاونی یافت نشد"
                });
            }

            res.status(200).json({
                status: "success",
                data: {
                    Amanat: updatedAmanat
                }
            });
        } catch (error) {
            res.status(400).json({
                status: "fail",
                message: error.message
            });
        }
    }

    async deleteAmanat(req, res) {
        try {
            const { user } = req.params;

            // Find and delete the amanat
            const deletedAmanat = await AmanatModel.findOneAndDelete({ user });

            // Handle case where amanat with given user is not found
            if (!deletedAmanat) {
                return res.status(404).json({
                    status: "fail",
                    message: "امانتی با این نام تعاونی یافت نشد"
                });
            }

            res.status(200).json({
                status: "success",
                message: "امانت با موفقیت حذف شد"
            });
        } catch (error) {
            res.status(400).json({
                status: "fail",
                message: error.message
            });
        }
    }
}

module.exports = AmanatController;
