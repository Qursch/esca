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
        done(null, user.email);
    });

    passport.deserializeUser((email, done) => {
        User.findOne({ email })
            .then((error, user) => {
                done(error, user);
            });
    });
}