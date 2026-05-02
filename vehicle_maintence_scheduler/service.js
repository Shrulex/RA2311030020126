const axios = require("axios");
const Log = require("../logging_middleware/logger");
require("dotenv").config();

const BASE_URL = "http://20.207.122.201/evaluation-service";

const headers = {
    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
};

async function fetchVehicles() {
    await Log("backend", "info", "service", "fetch vehicles");

    const res = await axios.get(`${BASE_URL}/vehicles`, { headers });
    return res.data;
}

async function fetchDepots() {
    await Log("backend", "info", "service", "fetch depots");

    const res = await axios.get(`${BASE_URL}/depots`, { headers });
    return res.data;
}

module.exports = { fetchVehicles, fetchDepots };