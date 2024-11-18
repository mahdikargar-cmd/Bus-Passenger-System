const express = require('express');
const userController = require('../controllers/AdminController');
const router = express.Router();

router.post('/registerAdmin', userController.registerAdmin);
router.post('/loginAdmin', userController.loginAdmin);

module.exports = router;
