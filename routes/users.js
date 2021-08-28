const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");
const { getZipCode, getLocation } = require("../util");

router.post("/signup", (req, res) => {
    const { name, email, password, type, locLat, locLong } = req.body;

    if (name == null || email == null || password == null || type == null || locLong == null || locLat == null) return res.json({ error: "Missing information." });
    if (!email.includes("@")) return res.json({ error: "Invalid email." });
    if (password.length < 6) return res.json({ error: "Password must be at least 6 characters." });
    if (!["student", "school", "provider"].includes(type)) return res.json({ error: "Invalid account type." });
    if (isNaN(locLat) || isNaN(locLong)) return res.json({ error: "Invalid location." });

    User.findOne({ email: email.toLowerCase() })
        .then(foundUser => {
            if (foundUser) return res.json({ error: "Email already in use." });
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const newUser = new User({
                name,
                email: email.toLowerCase(),
                password: hash,
                type,
                location: {
                    type: "Point",
                    coordinates: [
                        locLat,
                        locLong
                    ]
                }
            });
            getLocation(locLat, locLong)
                .then(response => {
                    newUser.location.zip = response[0].zipcode;
                    newUser.location.county = response[0].county + " " + response[0].state;
                }).catch(error => {
                    console.error(error);
                }).finally(() => {
                    newUser.save()
                        .then(() => res.json({ success: "Account created." }))
                        .catch((error) => {
                            console.error(error);
                            res.json({ error: "Error creating account." });
                        });
                })
        });
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (error, user, info) => {
        if (error) {
            console.error(error);
            return res.json({ error: "Error with authentication." });
        }

        if (!user) return res.json({ error: "Invalid credentials." });

        req.logIn(user, (error2) => {
            if (error2) {
                console.error(error2);
                return res.json({ error: "Error with authentication." });
            }
            res.json({ success: "Logged in." });
        });

    })(req, res, next);
});

router.post("/logout", (req, res) => {
    if(req.user != null) {
        req.logOut();
        res.json({ success: "Successfully logged out." });
    } else {
        res.json({ error: "You are not logged in." });
    }
});


module.exports = router;