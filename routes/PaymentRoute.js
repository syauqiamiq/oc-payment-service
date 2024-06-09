var express = require('express');
var router = express.Router();

const paymentController = require("../controllers/PaymentController")

/* GET users listing. */
router.get('/process', paymentController.ProcessPayment);

module.exports = router;
