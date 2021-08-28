const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { isAProvider } = require("../util");
const { wolframAPI } = require("../config/apis");

router.get("/get_school", isAProvider, async (req, res) => {
    if (req.user.extra.toString().length == 0) return res.json({ school: "You have not set a school." });
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

router.get("/nearby_schools/:distance", (req, res) => {
    if (isNaN(req.params.distance) || ![1, 2, 3].includes(Number.parseInt(req.params.distance))) return res.json({ error: "Invalid distance." });
    wolframAPI.getSimple(`schools ${
        req.params.distance == 1 ? `in zip ${req.user.location.zip}` :
        req.params.distance == 2 ? `around zip ${req.user.location.zip}` :
        `in ${req.user.location.county}`
    }`)
        .then(result => {
            res.json({ url: result });
        })
        .catch(error => {
            console.error(error);
            res.json({ error: "Error when searching."})
        });
});

module.exports = router;