const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./AAA/routes/userRoutes');
const coperativeRoutes = require('./routes/CoperativeRoutes');
const destinationRoutes = require('./routes/DestinationRouter');
const driverRoutes = require('./routes/DriverRoutes');
const busRoutes = require('./routes/BusRoutes');

const busMovement = require('./routes/BusMovementManagementRouter');
const servicesRoutes = require('./routes/ServicesRouter');
const ticketRoutes = require('./routes/ticketsRoute');
const adminRoutes = require('./AAA/routes/AdminRoutes');
const seatsRoutes = require('./routes/SeatStatusRouter');
const amanatRoutes = require('./routes/AmanatRoutes');
const {join} = require("path");

class Server {
    constructor() {
        this.app = express();
        this.port = 5000;

        this.connectToDatabase();
        this.configureMiddleware();
        this.setupRoutes();
        this.startServer();
    }

    connectToDatabase() {   
        mongoose.connect("mongodb+srv://mahdikargar:13521380@cluster0.pw2b7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => console.log('mongodb connected'))
            .catch(err => console.error('error in mongodb:', err));
    }

    configureMiddleware() {
        this.app.use(cors({
            origin: 'https://safarinoo.onrender.com'
        }));
        this.app.use(bodyParser.json());
    }

    setupRoutes() {
        this.app.use('/users', userRoutes);
        this.app.use('/coperative', coperativeRoutes);
        this.app.use('/destination', destinationRoutes);
        this.app.use('/driver', driverRoutes);
        this.app.use('/driverreports', driverRoutes);

        this.app.use('/bus', busRoutes);
        /*
                this.app.use('/Route', routeRoutes);
        */
        this.app.use('/busMovement', busMovement);
        this.app.use('/services', servicesRoutes);
        this.app.use('/tickets', ticketRoutes);
        this.app.use('/admin', adminRoutes);
        this.app.use('/seats', seatsRoutes);
        this.app.use('/amanat', amanatRoutes);

    }

    startServer() {

// ارائه فولدر build به عنوان استاتیک
        this.app.use(express.static(join(__dirname, "client/build")));
        this.app.get("*", (req, res) => {
            res.sendFile(join(__dirname, "client/build", "index.html"));
        });
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}

new Server();
