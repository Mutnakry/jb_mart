const express = require('express');
const router = express.Router();
const { PurchaseDetailAll,OrderDetailAll,OrderReturn,Supplier,InvoiceGroupCustomer,InvoiceStockProduct,InvoiceQTYSale,Sum_PurchaseDetail,InvoiceCost,SaleProduct_Dolla_InDay,SumTotalSale_USD_KHR_THB_inMonth,CountProductQTYSale,CountCustomer,OrderSum,Check_NoteQTY} = require('../controller/invoice.cotroller');

router.get('/purchase', PurchaseDetailAll); // // sum purchase Detail 
router.get('/supplier', Supplier); // // sum purchase Detail 
router.get('/in_groupCus', InvoiceGroupCustomer); // // sum purchase Detail 
router.get('/in_stockproduct', InvoiceStockProduct); // // sum product stock
router.get('/orderQTY', InvoiceQTYSale); // // sum product stock
router.get('/InvoiceCost', InvoiceCost); // // sum product stock



router.get('/sum_purchase', Sum_PurchaseDetail);  


router.get('/orderdetail', OrderDetailAll);  /////  useing purchase_detail
router.get('/orderreturn', OrderReturn);  /////  useing purchase_detail

module.exports = router;