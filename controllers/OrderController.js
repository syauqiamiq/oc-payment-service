require("dotenv").config();

const models = require("../models");
const {
  URL_USER_SERVICE,
  URL_COURSE_SERVICE,
  MIDTRANS_CLIENT_KEY,
  MIDTRANS_SERVER_KEY,
} = process.env;

const apiAdapter = require("../helpers/ApiAdapter");
const orderHelper = require("../helpers/OrderHelper");
const courseApi = apiAdapter(URL_COURSE_SERVICE);
const userApi = apiAdapter(URL_USER_SERVICE);
const midtransClient = require("midtrans-client");
const { orderInput } = require("../dtos/Order");

const CreateOrder = async (req, res) => {
  try {
    await orderInput.validate(req.body, { abortEarly: false });
    const { user_id, course_id } = req.body;

    // GET USER DATA
    let userData;
    try {
      userData = await userApi.get(`/user/${user_id}`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({
          status: "error",
          code: 404,
          message: "User not found",
          data: null,
        });
      }
      return res.status(500).json({
        status: "error",
        code: 503,
        message: "User Service Unavailable",
        data: null,
      });
    }
    // GET COURSE DATA
    let courseData;
    try {
      courseData = await courseApi.get(`/course/${course_id}`);
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
    // CHECK COURSE ALREADY TAKEN
    try {
      await courseApi.post(`/my-course/check`, {
        course_id,
        user_id,
      });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        return res.status(409).json({
          status: "error",
          code: 409,
          message: "Course already taken",
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
    // CHECK DUPLICATE ORDER ON THIS COURSE
    const foundPendingOrder = await models.Order.findOne({
      where: { status: "PENDING", userId: user_id, courseId: course_id },
    });
    if (foundPendingOrder !== null) {
      return res.status(409).json({
        status: "error",
        code: 409,
        message: "You have pending order for this course",
        data: null,
      });
    }
    // CHECK COURSE PRICE MUST BE NOT 0
    if (courseData.data?.data?.price === 0) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Price cannot be zero",
        data: null,
      });
    }
    // CREATE ORDER
    const createdOrder = await models.Order.create({
      userId: user_id,
      courseId: course_id,
    });

    // CREATE MIDTRANS SNAP
    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: MIDTRANS_SERVER_KEY,
      clientKey: MIDTRANS_CLIENT_KEY,
    });

    const parameter = {
      customer_details: {
        email: userData.data?.data?.email,
      },
      item_details: [
        {
          id: courseData.data?.data?.id,
          price: courseData.data?.data?.price,
          quantity: 1,
          name: courseData.data?.data?.name,
          brand: "Pandaz Technology",
        },
      ],
      transaction_details: {
        order_id: orderHelper.generateOrderId(courseData.data?.data?.id),
        gross_amount: courseData.data?.data?.price,
      },
      credit_card: {
        secure: true,
      },
    };

    const createdTransaction = await snap.createTransaction(parameter);
    await models.Order.update(
      {
        snapUrl: createdTransaction.redirect_url,
        metaData: courseData.data?.data,
      },
      {
        where: {
          id: createdOrder.id,
        },
      }
    );
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Success",
      data: createdTransaction,
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
  CreateOrder,
};
