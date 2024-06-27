require("dotenv").config();
const models = require("../models");
const {
	URL_USER_SERVICE,
	URL_COURSE_SERVICE,
	MIDTRANS_CLIENT_KEY,
	MIDTRANS_SERVER_KEY,
} = process.env;
const { sha512 } = require("js-sha512");

const apiAdapter = require("../helpers/ApiAdapter");

const courseApi = apiAdapter(URL_COURSE_SERVICE);
const MidtransWebhook = async (req, res) => {
	try {
		// Body from Midtrans
		const midtransResponses = req.body;
		const {
			signature_key,
			status_code,
			order_id,
			gross_amount,
			transaction_status,
			payment_type,
			fraud_status,
		} = midtransResponses;

		const mySignatureKey = sha512(
			`${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`
		);
		// Verify Signature Key
		// if (signature_key != mySignatureKey) {
		// 	return res.status(400).json({
		// 		status: "error",
		// 		code: 400,
		// 		message: "Invalid Signature",
		// 		data: null,
		// 	});
		// }

		const orderData = await models.Order.findOne({
			where: {
				externalOrderId: order_id,
			},
		});

		if (!orderData) {
			return res.status(400).json({
				status: "error",
				code: 404,
				message: "order not found",
				data: null,
			});
		}

		if (orderData.status == "SUCCESS") {
			return res.status(400).json({
				status: "error",
				code: 405,
				message: "operation not permitted",
				data: null,
			});
		}

		console.log(
			`Transaction notification received. Order ID: ${order_id}. Transaction status: ${transaction_status}. Fraud status: ${fraud_status}`
		);

		// Sample transactionStatus handling logic
		if (transaction_status == "capture") {
			if (fraud_status == "accept") {
				// TODO set transaction status on your database to 'success'
				await models.Order.update(
					{
						status: "SUCCESS",
					},
					{
						where: {
							externalOrderId: order_id,
						},
					}
				);
				// and response with 200 OK
			}
		} else if (transaction_status == "settlement") {
			// TODO set transaction status on your database to 'success'
			await models.Order.update(
				{
					status: "SUCCESS",
				},
				{
					where: {
						externalOrderId: order_id,
					},
				}
			);
			// and response with 200 OK
		} else if (
			transaction_status == "cancel" ||
			transaction_status == "deny" ||
			transaction_status == "expire"
		) {
			// TODO set transaction status on your database to 'failure'
			await models.Order.update(
				{
					status: "FAILURE",
				},
				{
					where: {
						externalOrderId: order_id,
					},
				}
			);
			// and response with 200 OK
		} else if (transaction_status == "pending") {
			// TODO set transaction status on your database to 'pending' / waiting payment
			await models.Order.update(
				{
					status: "PENDING",
				},
				{
					where: {
						externalOrderId: order_id,
					},
				}
			);
			// and response with 200 OK
		}

		await models.PaymentLog.create({
			status: transaction_status,
			paymentType: payment_type,
			rawResponse: midtransResponses,
			orderId: orderData.id,
		});

		// if success, create access to premium class
		const finalOrderData = await models.Order.findOne({
			where: {
				externalOrderId: order_id,
			},
		});

		if (!finalOrderData) {
			return res.status(400).json({
				status: "error",
				code: 404,
				message: "order not found",
				data: null,
			});
		}
		// if success, create access to premium class
		if (finalOrderData.status == "SUCCESS") {
			try {
				await courseApi.post(`/my-course`, {
					user_id: finalOrderData.userId,
					course_id: finalOrderData.courseId,
				});
			} catch (error) {
				if (error.response && error.response.status === 404) {
					return res.status(404).json({
						status: "error",
						code: 404,
						message: "Course not found",
						data: null,
					});
				}
				return res.status(500).json({
					status: "error",
					code: 503,
					message: "Course Service Unavailable",
					data: null,
				});
			}
		}

		return res.status(200).json({
			status: "success",
			code: 200,
			message: "Success",
			data: null,
		});
	} catch (error) {
		return res.status(400).json({
			status: "error",
			code: 400,
			message: error.message,
			data: null,
		});
	}
};

module.exports = {
	MidtransWebhook,
};
