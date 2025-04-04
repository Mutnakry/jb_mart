const express = require('express');
const router = express.Router();
const { GetAllOrder,GetOrder,CreateOrderRepay} = require('../controller/order_repay.controller');
router.get('/:id', GetAllOrder);
router.get('/', GetOrder);
router.post('/', CreateOrderRepay);

module.exports = router;