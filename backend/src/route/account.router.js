const express = require('express');
const router = express.Router();
const { GetAll, Create, Update, GetSingle, Delete, GetAllData, CreateAccDetail, InputMoneyAccDetail, Update_Status,getPaymentDetail,getPaymentDetailAll } = require('../controller/account.controller');
router.get('/1', GetAll); 
router.get('/paymentdetail', getPaymentDetailAll); /// មើលលំអិត acc pay to ALL
router.get('/paymentdetail/:id', getPaymentDetail);  /// មើលលំអិត acc pay to 
router.get('/', GetAllData); /// មើលនៅក្នុង​frontend
router.post('/', Create);
router.put('/:id', Update);
router.put('/update_status/:id', Update_Status);
router.get('/:id', GetSingle);
router.delete('/:id', Delete)

router.post('/paymentdetail', CreateAccDetail); // ផ្ឬេប្រាក់
router.post('/inputmoney', InputMoneyAccDetail); // បន្ថែមប្រាក់

module.exports = router;