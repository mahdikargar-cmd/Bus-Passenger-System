const DriverModel = require('../models/DriversModel');

class DriverController {

    async registerDrivers(req, res) {
        try {
            const {name, codeMelli, numberPhone, gender, age, dateOfBirth} = req.body;
            if (!name  || !codeMelli || !numberPhone || !gender || !age || !dateOfBirth) {
                return res.status(400).json({
                    status: "fail",
                    message: "تمام مشخصات فرم را پر کنید"
                });
            }

            const exist = await DriverModel.findOne({codeMelli});
            if (exist) {
                return res.status(400).json({
                    status: "failed",
                    message: "راننده از قبل وجود دارد"
                });
            }

            const newDriver = await DriverModel.create({
                name, codeMelli, numberPhone, gender, age, dateOfBirth
            });

            res.status(201).json({
                status: "success",
                data: {
                    Driver: newDriver
                }
            });

        } catch (error) {
            res.status(400).json({
                status: "fail",
                message: error.message
            });

        }
    }

    async updateDrivers(req, res) {
        try {
            const {id} = req.params;
            const {name, codeMelli, numberPhone, gender, age, dateOfBirth} = req.body;
            if (!name  || !codeMelli || !numberPhone || !gender || !age || !dateOfBirth) {
                return res.status(400).json({
                    status: "fail",
                    message: "تمام مشخصات فرم را پر کنید"
                });
            }

            const updateDriver = await DriverModel.findByIdAndUpdate(
                id,
                { name, codeMelli, numberPhone, gender, age, dateOfBirth },
                { new: true, runValidators: true }
            );

            if (!updateDriver) {
                return res.status(404).json({
                    status: "fail",
                    message: "راننده مورد نظر یافت نشد"
                });
            }

            res.status(200).json({
                status: "success",
                data: {
                    Driver: updateDriver
                }
            });

        } catch (error) {
            res.status(400).json({
                status: "fail",
                message: error.message
            });
        }
    }

    async deleteDrivers(req, res) {
        try {
            const {id} = req.params;
            const deleteDriver = await DriverModel.findByIdAndDelete(id);
            if (!deleteDriver) {
                return res.status(400).json({
                    status: "fail",
                    message: "راننده یافت نشد"
                });
            }
            res.status(200).json({
                status: "success",
                message: "راننده با موفقیت حذف شد"
            });
        } catch (error) {
            res.status(400).json({
                status: "fail",
                message: error.message
            });
        }
    }
}

module.exports = DriverController;
