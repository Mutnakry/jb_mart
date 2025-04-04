const express = require('express');
const router = express.Router();
const { GetAll,Create,Update,GetSingle,Delete ,GetAllcustomer} = require('../controller/customer.Controller');
router.get('/getcustomerdiscount', GetAll);
router.get('/', GetAllcustomer);
router.post('/', Create);
router.put('/:id', Update);
router.get('/:id', GetSingle);
router.delete('/:id',Delete)

module.exports = router;