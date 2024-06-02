const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const coperativeRoutes = require('./routes/CoperativeRoutes');
const destinationRoutes=require('./routes/DestinationRouter');
class Server {
    constructor() {
        this.app = express();
        this.port =  5000;

        this.connectToDatabase();
        this.configureMiddleware();
        this.setupRoutes();
        this.startServer();
    }

    connectToDatabase() {
        mongoose.connect("mongodb://127.0.0.1:27017/Travel", {
            useNewUrlParser: true,
            useCreateIndex: true,
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
        this.app.use('/destination',destinationRoutes);
    }

    startServer() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
        this.app.use((req, res, next) => {
            console.log(req.body);
            next();
        });
    }
}

new Server();
