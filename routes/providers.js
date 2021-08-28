const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { isAProvider } = require("../util");

router.get("/get_school", isAProvider, async (req, res) => {
    if (req.user.extra.toString().length > 0) return res.json({ school: "You have not set a school." });
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

router.post("/set_school", isAProvider, async (req, res) => {
    const { schoolName } = req.body;
    User.findOne({ name: schoolName }).collation({ locale: 'en', strength: 1 })
        .then(school => {
            if (!school) return res.json({ error: "Invalid school." });

            req.user.extra = schoolID;
            req.user.save();
            res.json({ success: "Successfully set school." });
        })
});

module.exports = router;