const mongoose = require("mongoose");

const Food = mongoose.model("Food", new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    expiration: {
        type: Number,
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    providers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: true
    },
    studentsClaimed: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: false
    }
}));

module.exports = Food;