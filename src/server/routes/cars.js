const carsController = require('../controllers/cars');
const express = require('express');

const router = express.Router();

router.get('/', carsController.getCars); //getting all cars
router.post('/', carsController.createCar); //adding new cars

module.exports = router;