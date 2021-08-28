const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { isAStudent } = require("../util");

router.get("/get_school", isAStudent, async (req, res) => {
    if (req.user.extra.toString().length == 0) return res.json({ school: "You are not in a school." });
    const school = await User.findById(req.user.extra);
    res.json({ school: {
        name: school.name,
        email: school.email,
        location: {
            longitude: school.location.longitude,
            latitude: school.location.latitude
        }
    }});
});

module.exports = router;