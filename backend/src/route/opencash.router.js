const express = require('express');
const router = express.Router();
const { Create, Update, GetAllData,SumClostProductID,ClostreportID,CustomerReturmID, GetAllClostStockProduct, GetAll, GetAllClostCost, SumClostCost, SumClostProduct, CustomerReturm, CustomerReturmProduct, SumCustomerReturmProduct, Clostreport ,GetAllClostStockProductID,GetAllClostCostID,SumClostCostID} = require('../controller/opencash.controller');

router.get('/active', GetAllData);
router.post('/', Create);
router.put('/close/:id', Update);
router.get('/all', GetAll);

router.get('/product', GetAllClostStockProduct);
router.get('/cost', GetAllClostCost);
router.get('/sumconst', SumClostCost);
router.get('/sumProduct', SumClostProduct);
router.get('/customer_return', CustomerReturm);
router.get('/customer_ReturnProduct', CustomerReturmProduct);
router.get('/Sumcustomer_ReturnProduct', SumCustomerReturmProduct);
router.get('/clostreport', Clostreport);

router.get('/product/:id', GetAllClostStockProductID);
router.get('/cost/:id', GetAllClostCostID);
router.get('/sumconst/:id', SumClostCostID);
router.get('/sumProduct/:id', SumClostProductID);
router.get('/customer_return/:id', CustomerReturmID);
router.get('/clostreport/:id', ClostreportID);




module.exports = router;