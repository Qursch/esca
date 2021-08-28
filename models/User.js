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
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
        zip: {
            type: String,
            required: false
        },
        county: {
            type: String,
            required: false
        }
    },
    relation: {
        // Student: SCHOOL_ID
        // Provider: SCHOOL_ID
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    itemsProcessed: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Food',
        required: false
    }
}));

module.exports = User;