const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const coperativeRoutes = require('./routes/CoperativeRoutes');
const destinationRoutes = require('./routes/DestinationRouter');
const driverRoutes = require('./routes/DriverRoutes');
const busRoutes = require('./routes/BusRoutes');
const routeRoutes = require('./routes/RouteManagementRouter');
const busMovement = require('./routes/BusMovementManagementRouter');
const servicesRoutes = require('./routes/ServicesRouter');
const ticketRoutes = require('./routes/ticketRoutes'); // Add this line

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
        mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Travel", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => console.log('mongodb connected'))
            .catch(err => console.error('error in mongodb:', err));
    }

    configureMiddleware() {
        this.app.use(cors({
            origin: 'http://localhost:3000'
        }));
        this.app.use(bodyParser.json());
    }

    setupRoutes() {
        this.app.use('/users', userRoutes);
        this.app.use('/coperative', coperativeRoutes);
        this.app.use('/destination', destinationRoutes);
        this.app.use('/driver', driverRoutes);
        this.app.use('/bus', busRoutes);
        this.app.use('/Route', routeRoutes);
        this.app.use('/busMovement', busMovement);
        this.app.use('/services', servicesRoutes);
        this.app.use('/tickets', ticketRoutes); // Add this line
    }

    startServer() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}

new Server();
