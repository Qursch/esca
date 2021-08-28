require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const mongoStore = require('connect-mongo');
const Agenda = require("agenda");
const wolframAlphaAPI = require("wolfram-alpha-api");
const waAPI = wolframAlphaAPI(process.env.WOLFRAM_ID);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'Connection error:'));
db.once("open", () => console.log("Connected to database."));


const agenda = new Agenda({ db: { address: process.env.MONGO_URI }});
require("./config/jobs")(agenda);

const app = express();
app.use(express.urlencoded({ extended: false }));

app.use(session({
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 604800000
    },
    store: mongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    secret: process.env.SESSION_SECRET
}));

require("./config/passport")();
app.use(passport.initialize());
app.use(passport.session());

// FOR DEMO VIDEO ONLY
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/login.html"));
});
app.get("/student", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/student.html"));
});


app.use("/users", require("./routes/users"));
app.use("/schools", require("./routes/schools"));
app.use("/providers", require("./routes/providers"));
app.use("/students", require("./routes/students"));

app.listen(3000, () => console.log("Server is online on http://localhost:3000"));