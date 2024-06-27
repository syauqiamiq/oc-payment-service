var express = require("express");
var router = express.Router();

const paymentController = require("../controllers/PaymentController");

/* GET users listing. */
router.get("/midtrans-webhook", (req, res) => {
	return res.status(200).json({
		status: "success",
		code: 200,
		message: "Webhook is Healthy",
		data: null,
	});
});
router.post("/midtrans-webhook", paymentController.MidtransWebhook);

module.exports = router;
