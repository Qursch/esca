const LS = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");

module.exports = () => {
    passport.use(
        new LS({usernameField: 'email'}, (email, password, done) => {
            User.findOne({ email })
                .then(existingUser => {
                    if (existingUser == null || !bcrypt.compareSync(password, existingUser.password)) return done(null, false);

                    return done(null, existingUser);
                });
        })
    );

    passport.serializeUser((user, done) => {
        console.log("B:" + user._id)
        done(null, user._id);
    });

    passport.deserializeUser((_id, done) => {
        User.findById({ _id })
            .then((user, error) => {
                done(error, user);
            });
    });
}