const mongoose = require("mongoose");

const User = mongoose.model("User", new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["student", "school", "provider"]
    }
}))

module.exports = User;