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

    getLocation: (latitude, longitude) => {
        return geocoderAPI.geocode(latitude + ", " + longitude);
    },

    getTotalCalories: (foodArray) => {
        let sum = 0;
        for (let i = 0; i < foodArray.length; i++) {
            let foodItem = foodArray[i];
            if ("amount" in foodItem) {
                sum += foodItem.amount;
            }
        }
        return sum;
    },
}