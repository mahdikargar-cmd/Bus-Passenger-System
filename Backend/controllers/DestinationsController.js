const DestinationsModel = require("../models/DestinationsModel");

class DestinationsController {
    async registerDestination(req, res) {
        try {
            const {Cities} = req.body;
            if (!Cities) {
                return res.status(400).json({
                    status: "fail",
                    message: "وارد کردن شهر الزامی است"
                });
            }
            const exist = await DestinationsModel.findOne({Cities});

            if (exist) {
                return res.status(400).json({
                    status: "fail",
                    message: "مسیر از قبل وجود دارد!!"
                });
            }

            const newDestination = await DestinationsModel.create({
                Cities
            });

            res.status(201).json({
                status: "success",
                data: {
                    Cities: newDestination
                }
            });
        } catch (error) {
            res.status(400).json({
                status: "fail",
                message: error.message
            });
        }
    }

    async updateDestinations(req, res) {
        try {
                const { id } = req.params;
            const { cityName } = req.body;

            if (!cityName) {
                return res.status(400).json({
                    status: "fail",
                    message: "نام شهر را وارد کنید"
                });
            }

            const updatedDestination = await DestinationsModel.findByIdAndUpdate(
                id,
                { Cities: cityName },
                { new: true, runValidators: true }
            );

            if (!updatedDestination) {
                return res.status(404).json({
                    status: "fail",
                    message: "مسیر مورد نظر یافت نشد"
                });
            }

            res.status(200).json({
                status: "success",
                data: { Cities: updatedDestination }
            });
        } catch (error) {
            res.status(400).json({
                status: "fail",
                message: error.message
            });
        }
    }

    async deleteDestination(req, res) {
        try {
            const { id } = req.params;
            const deletedDestination = await DestinationsModel.findByIdAndDelete(id);

            if (!deletedDestination) {
                return res.status(400).json({
                    status: "fail",
                    message: "مسیر مورد نظر یافت نشد"
                });
            }

            res.status(200).json({
                status: "success",
                message: "با موفقیت حذف شد"
            });
        } catch (error) {
            res.status(400).json({
                status: "fail",
                message: error.message
            });
        }
    }
}

module.exports = DestinationsController;
