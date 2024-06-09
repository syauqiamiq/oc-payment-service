const { default: axios } = require("axios");
require("dotenv").config();

const { TIMEOUT } = process.env;

module.exports = (baseUrl) => {
  return axios.create({
    baseURL: baseUrl,
    timeout: parseInt(TIMEOUT),
  });
};