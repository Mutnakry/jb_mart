const express = require('express');
const router = express.Router();

const { OrderProduct,GetInvoice} = require('../controller/order.controller');


router.get('/invoice', GetInvoice);///  useing get invoice save cart
router.post('/', OrderProduct);///  useing page cart order


module.exports = router;