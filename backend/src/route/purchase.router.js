const express = require('express');
const router = express.Router();

const { CreatePurchase,GetAllPuchase,UpdatePurchase,GetPurchaseUpdateByID,GetSingle,UpdatePurchaseStatus,GetAllPuchaseDetail,GetSinglePuchase,GetAllDetailPurchase,DeletePurchase} = require('../controller/puchase.controller');


router.get('/puchase', GetAllDetailPurchase); ///  useing page  puchase Lishe Detail
router.post('/', CreatePurchase);
router.get('/', GetAllPuchase);
router.get('/purchasedetail', GetAllPuchaseDetail);
router.put('/:id', UpdatePurchase);
router.put('/status/:id', UpdatePurchaseStatus);
router.get('/:id', GetSingle);
router.get('/purchaseid/:id', GetPurchaseUpdateByID);
router.delete('/:id', DeletePurchase);

router.get('/puchase/:id', GetSinglePuchase); // using page update purchase


module.exports = router;