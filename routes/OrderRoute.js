var express = require("express");
var router = express.Router();

const orderController = require("../controllers/OrderController");
router.get("/", orderController.GetOrder);
router.post("/", orderController.CreateOrder);

module.exports = router;
