const UserModel = require('../models/AdminModel');

class UserController {
    async registerAdmin(req, res) {
        try {
            const { user,password } = req.body;
            const exist = await UserModel.findOne({ user });

            if (exist) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'نام کربری قبلا ثبت نام شده است لطفا وارد شوید'
                });
            }

            const newUser = await UserModel.create({ user,password });
            res.status(201).json({
                status: 'success',
                data: {
                    user: newUser
                }
            });
        } catch (err) {
            res.status(400).json({
                status: 'fail',
                message: err.message
            });
        }
    }

    async loginAdmin(req, res) {
        try {
            const { user, password } = req.body;
            const admin = await UserModel.findOne({ password });

            if (!admin|| admin.password !== password) {
                return res.status(401).json({
                    status: 'fail',
                    message: 'نام کاربری یا رمز عبور اشتباه است'
                });
            }

            res.status(200).json({
                status: 'success',
                message: 'کاربر با موفقیت وارد شد',
                data: {
                    user
                }
            });
        } catch (err) {
            res.status(400).json({
                status: 'fail',
                message: err.message
            });
        }
    }
}

module.exports = new UserController();
