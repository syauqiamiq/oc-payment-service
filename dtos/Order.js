const yup = require("yup");

const orderInput = yup.object().shape({
  course_id: yup.string().required(),
  user_id: yup.string().required(),
});

module.exports = {
  orderInput,
};
