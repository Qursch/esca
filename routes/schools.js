const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { isASchool, getZipCode } = require("../util");
const { wolframAPI } = require("../config/apis");

router.get("/get_providers", isASchool, (req, res) => {
    User.find({ relation: req.user._id, type: "provider" })
        .then(users => {
            if (users.length == 0) return res.json({ students: "You have no providers." });
            let providers = [];
            users.forEach(user => {
                providers.push({ name: user.name, email: user.email });
            });
            return res.json({
                students: JSON.stringify(providers)
            });
        });
});

router.get("/get_students", isASchool, (req, res) => {
    User.find({ relation: req.user._id, type: "student" })
        .then(users => {
            if (users.length == 0) return res.json({ students: "You have no students." });
            let students = [];
            users.forEach(user => {
                students.push({ name: user.name, email: user.email });
            });
            return res.json({
                students: JSON.stringify(students)
            });
        });
});

router.post("/add_students", isASchool, async (req, res) => {
    const { students } = req.body;
    const formattedStudents = JSON.parse(students);
    if (!Array.isArray(formattedStudents) || formattedStudents.length == 0) return res.json({ error: "Invalid student emails." });
    let failed = [];
    for (let i = 0; i < formattedStudents.length; i++) {
        let student = formattedStudents[i];
        await User.findOne({ email: student })
            .then(studentUser => {
                if (!studentUser) {
                    failed.push(student);
                } else {
                    studentUser.relation = req.user._id;
                    studentUser.save();
                }
            });
    }
    res.json({
        info: `Added ${formattedStudents.length - failed.length} student${formattedStudents.length > 1 ? "s" : ""} to your school.`,
        error: JSON.stringify(failed)
    });
});

router.get("/nearby/:place_type/:distance", isASchool, (req, res) => {
    if (!["grocery", "restaurants"].includes(req.params.place_type)) return res.json({ error: "Invalid place type." });
    if (isNaN(req.params.distance) || ![1, 2].includes(req.params.distance)) return res.json({ error: "Invalid distance." });
    let input = `${req.params.place_type} ${
        req.params.distance == 1 ? `near zip ${req.user.location.zip}` :
        `in ${req.user.location.county}`
    }`;
    wolframAPI.getSimple(input)
        .then(result => {
            res.json({ url: result });
        })
        .catch(error => {
            console.error(error);
            res.json({ error: "Error when searching." })
        });
});

router.get("/available_food", isASchool, (req, res) => {
    Food.find({ school: req.user._id })
        .then(foodArray => {
            if (foodArray.length == 0) return res.json({ food: "You have no food to provide." });
            let formattedFood = [];
            foodArray.forEach(food => {
                formattedFood.push({ name: food.name, quantity: food.quantity, calories: food.calories, expiration: food.expiration });
            });
            return res.json({
                students: JSON.stringify(providers)
            });
        });
});

module.exports = router;