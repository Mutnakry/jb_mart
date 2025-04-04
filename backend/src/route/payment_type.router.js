const express = require('express');
const router = express.Router();
const { GetAll,Create,Update,GetSingle,Delete ,GetAllData} = require('../controller/payment_type.controller');
router.get('/1', GetAll);
router.get('/', GetAllData);
router.post('/', Create);
router.put('/:id', Update);
router.get('/:id', GetSingle);
router.delete('/:id',Delete)

module.exports = router;