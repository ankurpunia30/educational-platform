// models/courseModel.js
const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    title: String,
    content: String, // Content could be text, video links, etc.
});

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor', // Reference to an Instructor model or user
        required: true,
    },
    content: [moduleSchema], // List of modules within a course
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
