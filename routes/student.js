const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { isAStudent } = require("../util");
const { maxFoodPerDay, hardFoodLimit} = require("../config/settings");

router.get("/get_school", isAStudent, async (req, res) => {
    if (req.user.relation.toString().length == 0) return res.json({ school: "You are not in a school." });
    const school = await User.findById(req.user.relation);
    res.json({ school: {
        name: school.name,
        email: school.email,
        location: {
            longitude: school.location.longitude,
            latitude: school.location.latitude
        }
    }});
});

router.post("/claim_food", isAStudent, (req, res) => {
    const { name, quantity } = req.body;
});

module.exports = router;