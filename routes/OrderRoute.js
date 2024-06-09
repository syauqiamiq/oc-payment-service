var express = require("express");
var router = express.Router();

const orderController = require("../controllers/OrderController");

/* GET users listing. */
router.post("/", orderController.CreateOrder);

module.exports = router;
