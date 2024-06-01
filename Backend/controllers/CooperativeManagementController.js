const CooperativeModel = require("../models/Cooperative_Management_Model");

class CooperativeController {
  async registerCoperative(req, res) {
    try {
      const { CoperativeName, CoperativeManagement } = req.body;
      if (!CoperativeName || !CoperativeManagement) {
        return res.status(400).json({
          status: "fail",
          message: "نام تعاونی و مدیر تعاونی الزامی است"
        });
      }
      const exist = await CooperativeModel.findOne({ CoperativeName });

      if (exist) {
        return res.status(400).json({
          status: "fail",
          message: "نام تعاونی قبلا ثبت شده است"
        });
      }

      const newCoperative = await CooperativeModel.create({
        CoperativeName,
        CoperativeManagement
      });

      res.status(201).json({
        status: "success",
        data: {
          Coperative: newCoperative
        }
      });
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: error.message
      });
    }
  }

  async updateCoperative(req, res) {
    try {
      const { CoperativeName } = req.params;
      const { CoperativeName: newCoperativeName, CoperativeManagement } = req.body;

      if (!newCoperativeName || !CoperativeManagement) {
        return res.status(400).json({
          status: "fail",
          message: "نام تعاونی و مدیر تعاونی الزامی است"
        });
      }

      const updatedCoperative = await CooperativeModel.findOneAndUpdate(
          { CoperativeName },
          {
            CoperativeName: newCoperativeName,
            CoperativeManagement
          },
          { new: true, runValidators: true }
      );

      if (!updatedCoperative) {
        return res.status(404).json({
          status: "fail",
          message: "تعاونی مورد نظر یافت نشد"
        });
      }

      res.status(200).json({
        status: "success",
        data: {
          Coperative: updatedCoperative
        }
      });
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: error.message
      });
    }
  }

  async deleteCoperative(req, res) {
    try {
      const { CoperativeName } = req.params;
      const deletedCoperative = await CooperativeModel.findOneAndDelete({ CoperativeName });

      if (!deletedCoperative) {
        return res.status(400).json({
          status: "fail",
          message: "تعاونی مورد نظر یافت نشد"
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

module.exports = CooperativeController;
