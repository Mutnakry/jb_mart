const express = require('express');
const router = express.Router();
const { Currency,UpdateCurrency} = require('../controller/currency.controller');

router.get('/', Currency);
router.put('/:id', UpdateCurrency);

module.exports = router;