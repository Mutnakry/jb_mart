const express = require('express');
const router = express.Router();

const {CreatecustomerPay,UpdateCustomerPay,DeleteCustomerPay,GetPayCustomerment,GetPayCustomermentBYID} = require('../controller/customeer_payment.controller');

router.get('/:id', GetPayCustomermentBYID);///  useing get invoice save cart
router.get('/', GetPayCustomerment);///  useing get invoice save cart
router.post('/', CreatecustomerPay);///  useing page customer pay maney
router.put('/', UpdateCustomerPay);///  useing page customer pay maney
router.delete('/', DeleteCustomerPay);///  


module.exports = router;