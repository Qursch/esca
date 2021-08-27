require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require('connect-mongo');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'Connection error:'));
db.once("open", () => console.log("Connected to database."));

const app = express();
app.use(express.urlencoded({ extended: false }));

app.use(session({
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 604800000
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    secret: process.env.SESSION_SECRET
}));

require("./config/passport")();
app.use(passport.initialize());
app.use(passport.session());

app.use("/users", require("./routes/users"));

app.listen(3000, () => console.log("Online!"));