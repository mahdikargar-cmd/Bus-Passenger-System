const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const API_URL = process.env.REACT_APP_API_URL;

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;
