const express = require('express');
const router = express.Router();
const { GetAll,Create,Update,GetSingle,Delete ,GetAllBrands} = require('../controller/brands.Controller');
router.get('/1', GetAll);
router.get('/', GetAllBrands);
router.post('/', Create);
router.put('/:id', Update);
router.get('/:id', GetSingle);
router.delete('/:id',Delete)

module.exports = router;