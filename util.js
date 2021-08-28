const { geocoderAPI } = require("./config/apis");

module.exports = {
    isASchool: (req, res, next) => {
        if (req.isAuthenticated() && req.user.type == "school") {
            return next();
        }
        res.json({ error: "Invalid authentication." });
    },

    isAProvider: (req, res, next) => {
        if (req.isAuthenticated() && req.user.type == "provider") {
            return next();
        }
        res.json({ error: "Invalid authentication." });
    },

    isAStudent: (req, res, next) => {
        if (req.isAuthenticated() && req.user.type == "student") {
            return next();
        }
        res.json({ error: "Invalid authentication." });
    },

    getZipCode: (latitude, longitude, next) => {
        geocoderAPI.geocode(latitude + ", " + longitude).then(response => {
            next(response[0].zipcode);
        }).catch(error => {
            console.error(error);
        })
    }
}