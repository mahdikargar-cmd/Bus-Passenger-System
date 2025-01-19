/*
const express = require("express");
const RouteManagementController = require("../controllers/RouteManagementController");
const RouteModel = require("../models/RouteManagementModel");
const router = express.Router();

const routeController = new RouteManagementController();

router.post("/registerRoute", (req, res) => routeController.registerRoute(req, res));
router.delete('/deleteRoute/:id', (req, res) => routeController.deleteRoute(req, res));
router.patch('/updateRoute/:id', (req, res) => routeController.updateRoute(req, res));
router.get('/', async (req, res) => {
    try {
        const routes = await RouteModel.find();
        res.status(200).json(routes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
*/
