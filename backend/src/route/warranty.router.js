const express = require('express');
const router = express.Router();
const { GetAllWarranty, CreateWarranty,UpdateWarranty ,DeleteWarranty} = require('../controller/warranty.controller');
router.get('/', GetAllWarranty); 
router.post('/', CreateWarranty);
// Update warranty
router.put('/:id', UpdateWarranty);
// Delete warranty
router.delete('/:id', DeleteWarranty);

module.exports = router;