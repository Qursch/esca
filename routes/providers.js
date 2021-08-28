const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Food = require("../models/Food");
const { isAProvider } = require("../util");
const { wolframAPI } = require("../config/apis");

router.get("/get_school", isAProvider, async (req, res) => {
    if (req.user.relation.toString().length == 0) return res.json({ school: "You have not set a school." });
    const school = await User.findById(req.user.relation);
    res.json({
        school: {
            name: school.name,
            email: school.email,
            location: {
                longitude: school.location.longitude,
                latitude: school.location.latitude
            }
        }
    });
});

router.post("/set_school", isAProvider, async (req, res) => {
    const { schoolName } = req.body;
    User.findOne({ name: schoolName }).collation({ locale: 'en', strength: 1 })
        .then(school => {
            if (!school) return res.json({ error: "Invalid school." });

            req.user.relation = schoolID;
            req.user.save();
            res.json({ success: "Successfully set school." });
        })
});

router.get("/nearby_schools/:distance", isAProvider, (req, res) => {
    if (isNaN(req.params.distance) || ![1, 2, 3].includes(Number.parseInt(req.params.distance))) return res.json({ error: "Invalid distance." });
    wolframAPI.getSimple(`schools ${req.params.distance == 1 ? `in zip ${req.user.location.zip}` :
        req.params.distance == 2 ? `around zip ${req.user.location.zip}` :
            `in ${req.user.location.county}`
        }`)
        .then(result => {
            res.json({ url: result });
        })
        .catch(error => {
            console.error(error);
            res.json({ error: "Error when searching." })
        });
});

router.post("/add_food", isAProvider, (req, res) => {
    const { name, quantity, expiration } = req.body;
    if (name == null || quantity == null || expiration == null) return res.json({ error: "Missing inputs." });
    if ([name, quantity, expiration].includes("")) return res.json({ error: "Empty food information." });
    Food.findOne({ school: req.user.relation, name: name })
        .then((existingFood) => {
            if (existingFood == null) {
                wolframAPI.getFull({
                    input: `calories of ${name}`,
                    format: 'plaintext',
                })
                    .then((queryresult) => {
                        const calories = queryresult.pods[1].subpods[0].plaintext.split(" ")[0];
                        const newFood = new Food({
                            name,
                            quantity,
                            calories,
                            expiration,
                            school: req.user.relation,
                            providers: [req.user._id]
                        });
                        newFood.save()
                            .then(() => {
                                res.json({ success: "Successfully added food." });
                            })
                            .catch((error) => {
                                console.error(error);
                                res.json({ error: "Error adding food." });
                            });
                    })
                    .catch((error) => {
                        console.error(error);
                        res.json({ error: "Error adding food." });
                    });
            } else {
                existingFood.providers.push(req.user._id);
                existingFood.quantity = Number.parseInt(existingFood.quantity) + Number.parseInt(quantity);
                if (expiration < existingFood.expiration) {
                    existingFood.expiration = expiration;
                }
                existingFood.save()
                    .then(() => {
                        res.json({ success: "Successfully added food." });
                    })
                    .catch((error) => {
                        console.error(error);
                        res.json({ error: "Error adding food." });
                    });
            }
        });


});

module.exports = router;