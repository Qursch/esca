const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI(process.env.WOLFRAM_ID);

const NodeGeocoder = require("node-geocoder");
const geocoder = NodeGeocoder({
    provider: "opencage",
    apiKey: process.env.OPENCAGE_KEY
});

module.exports = {
    wolframAPI: waApi,
    geocoderAPI: geocoder
};