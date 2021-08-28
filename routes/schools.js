const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { isASchool, getZipCode } = require("../util");
const { wolframAPI } = require("../config/apis");

router.get("/get_students", isASchool, (req, res) => {
    User.find({ extra: req.user._id })
        .then(users => {
            console.log(users)
            if(users.length == 0) return res.json({ students: "You have no students." });
            let emails = [];
            users.forEach(user => {
                emails.push({name: user.name, email: user.email});
            });
            return res.json({
                students: JSON.stringify(emails)
            });
        });
});

router.post("/add_students", isASchool, async (req, res) => {
    const { students } = req.body;
    const formattedStudents = JSON.parse(students);
    if(!Array.isArray(formattedStudents) || formattedStudents.length == 0) return res.json({ error: "Invalid student emails." });
    let failed = [];
    for (let i = 0; i < formattedStudents.length; i++) {
        let student = formattedStudents[i];
        await User.findOne({ email: student })
            .then(studentUser => {
                if (!studentUser) {
                    failed.push(student);
                } else {
                    studentUser.extra = req.user._id;
                    studentUser.save();
                }
            })
    }
    res.json({
        info: `Added ${formattedStudents.length - failed.length} student${formattedStudents.length > 1 ? "s" : ""} to your school.`,
        error: JSON.stringify(failed)
    });
});

router.get("/nearby/:place_type", isASchool, (req, res) => {
    if (!["grocery", "restaurants"].includes(req.params.place_type)) {
        req.params.place_type = Math.random() < 0.5 ? "grocery" : "restaurants";
    }
    getZipCode(req.user.location.coordinates[0], req.user.location.coordinates[1], (zipcode) => {
        wolframAPI.getSimple(`${req.params.place_type} near zipcode ${zipcode}`)
            .then(result => {
                res.json({ url: result });
            })
            .catch(error => {
                console.error(error);
                res.json({ error: "Error when searching."})
            });
    });
});

module.exports = router;