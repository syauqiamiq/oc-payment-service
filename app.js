require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require('body-parser');


const indexRouter = require("./routes/index");
const orderRouter = require("./routes/OrderRoute");
const paymentRouter = require("./routes/PaymentRoute");


const app = express();
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.use("/", indexRouter);
app.use("/order", orderRouter);
app.use("/payment", paymentRouter);

module.exports = app;
