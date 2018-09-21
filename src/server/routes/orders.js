const ordersController = require('../controllers/orders');
const express = require('express');

const router = express.Router();

router.get('/', ordersController.getOrders); //getting all orders
router.post('/', ordersController.createOrder); //adding new order

module.exports = router;
