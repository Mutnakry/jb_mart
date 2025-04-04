const express = require('express');
const router = express.Router();
const { GetAll,Create,Update,GetSingle,Delete ,GetAllsupplier} = require('../controller/supplier.Controller');
router.get('/1', GetAll);
router.get('/', GetAllsupplier);
router.post('/', Create);
router.put('/:id', Update);
router.get('/:id', GetSingle);
router.delete('/:id',Delete)

module.exports = router;