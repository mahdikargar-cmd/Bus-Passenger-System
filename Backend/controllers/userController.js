const UserModel = require("../models/userModel");

class UserController {
  async registerUser(req, res) {
    try {
      const { name, family, email, password } = req.body;
      const exist = await UserModel.findOne({ email });

      const newUser = await UserModel.create({ name, family, email, password });
      res.status(201).json({
        status: "success",
        data: {
          user: newUser
        }
      });
      if (exist) {
        return res.status(400).json({
          status: "fail",
          message: "ایمیل قبلا ثبت نام شده است لطفا وارد شوید"
        });
      }
    } catch (err) {
      res.status(400).json({
        status: "fail",
        message: err.message
      });
    }
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });

      if (!user || user.password !== password) {
        return res.status(401).json({
          status: "fail",
          message: "نام کاربری یا رمز عبور اشتباه است"
        });
      }

      res.status(200).json({
        status: "success",
        message: "کاربر با موفقیت وارد شد",
        data: {
          user
        }
      });
    } catch (err) {
      res.status(400).json({
        status: "fail",
        message: err.message
      });
    }
  }
}

module.exports = new UserController();
