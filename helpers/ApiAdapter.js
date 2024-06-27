const { default: axios } = require("axios");
require("dotenv").config();

const { HTTP_TIMEOUT } = process.env;

module.exports = (baseUrl) => {
  return axios.create({
    baseURL: baseUrl,
    timeout: parseInt(HTTP_TIMEOUT),
  });
};
