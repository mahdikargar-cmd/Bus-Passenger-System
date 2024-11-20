const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // پشتیبانی از متغیرهای محیطی
console.log(process.env.TEST_VARIABLE);

const bodyParser = require('body-parser');
const cors = require('cors');

// مسیرهای روتر
const userRoutes = require('./AAA/routes/userRoutes');
const coperativeRoutes = require('./routes/CoperativeRoutes');
const destinationRoutes = require('./routes/DestinationRouter');
const driverRoutes = require('./routes/DriverRoutes');
const busRoutes = require('./routes/BusRoutes');
const routeRoutes = require('./routes/RouteManagementRouter');
const busMovement = require('./routes/BusMovementManagementRouter');
const servicesRoutes = require('./routes/ServicesRouter');
const ticketRoutes = require('./routes/ticketsRoute');
const adminRoutes = require('./AAA/routes/AdminRoutes');
const seatsRoutes = require('./routes/SeatStatusRouter');
const amanatRoutes = require('./routes/AmanatRoutes');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT ; // استفاده از متغیر محیطی PORT یا 5000
        this.dbUrl = process.env.MONGO_URL; // خواندن آدرس دیتابیس از فایل .env

        this.connectToDatabase();
        this.configureMiddleware();
        this.setupRoutes();
        this.startServer();
    }

    connectToDatabase() {
        mongoose.connect(this.dbUrl)
            .then(() => console.log('MongoDB connected'))
            .catch(err => console.error('Error in MongoDB connection:', err));
    }

    configureMiddleware() {
        // تنظیم CORS برای دسترسی به فرانت‌اند روی رندر
        this.app.use(cors({
            origin: "https://bus-passenger-system.onrender.com", // آدرس فرانت‌اند
            credentials: true, // در صورت نیاز به ارسال کوکی‌ها
        }));

        this.app.use(bodyParser.json()); // پشتیبانی از JSON
    }

    setupRoutes() {
        this.app.use('/users', userRoutes);
        this.app.use('/coperative', coperativeRoutes);
        this.app.use('/destination', destinationRoutes);
        this.app.use('/driver', driverRoutes);
        this.app.use('/driverreports', driverRoutes);
        this.app.use('/bus', busRoutes);
        this.app.use('/Route', routeRoutes);
        this.app.use('/busMovement', busMovement);
        this.app.use('/services', servicesRoutes);
        this.app.use('/tickets', ticketRoutes);
        this.app.use('/admin', adminRoutes);
        this.app.use('/seats', seatsRoutes);
        this.app.use('/amanat', amanatRoutes);
    }

    startServer() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}

new Server();
