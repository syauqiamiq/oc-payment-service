const models = require("../models");
const { URL_COURSE_SERVICE } = process.env;

const apiAdapter = require("../helpers/ApiAdapter");
const api = apiAdapter(URL_COURSE_SERVICE);
const ProcessPayment = async (req, res) => {
  try {
    const course = await api.get(
      "/my-course?cbff009e-00bb-41a8-b2ab-7a8df729a0b3"
    );
    return res.json(course.data);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      code: 500,
      message: error.message,
    });
  }
};

module.exports = {
  ProcessPayment,
};
