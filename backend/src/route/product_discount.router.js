const express = require('express');
const router = express.Router();

const {GetAllProductDiscount, CreateProductDiscount,UpdateProductDiscount,DeleteProductDiscount,GetAllProductDiscountSingle} = require('../controller/product_discount.controller');


router.get('/', GetAllProductDiscount);///  useing 
router.get('/:id', GetAllProductDiscountSingle);///  useing get invoice save cart
router.post('/', CreateProductDiscount);///  useing page Product Discount
router.put('/:id', UpdateProductDiscount);///  useing page Product Discount
router.delete('/:id', DeleteProductDiscount);///  useing page Product Discount
module.exports = router;