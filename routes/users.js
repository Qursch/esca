const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");

router.post("/signup", (req, res) => {
    const { email, password, type } = req.body;

    if (email == null || password == null || type == null) return res.json({ error: "Missing information." });
    if (!email.includes("@")) return res.json({ error: "Invalid email." });
    if (password.length < 6) return res.json({ error: "Password must be at least 6 characters." });
    if (!["student", "school", "provider"].includes(type)) return res.json({ error: "Invalid account type." });

    User.findOne({ email: email.toLowerCase() })
        .then(foundUser => {

            if (foundUser) return res.json({ error: "Email already in use." });

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const newUser = new User({
                email: email.toLowerCase(),
                password: hash,
                type
            });
            newUser.save()
                .then(() => res.json({ success: "Account created." }))
                .catch((error) => {
                    console.error(error);
                    res.json({ error: "Error creating account." });
                });

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


module.exports = router;