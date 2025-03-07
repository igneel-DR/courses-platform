const mongoose = require('mongoose');
const { Schema } = mongoose;

const CourseModel = new Schema({
    id: {type: String, required: true},
    titre: {type: String, required: true},
    professeur_id: {type: String, required: true},
    description: {type: String, required: true},
    prix: {type: Number, required: true},
})

const Course = mongoose.model("Course", CourseModel)
module.exports = Course
