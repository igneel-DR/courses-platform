
const mongoose = require('mongoose');
const { Schema } = mongoose;

const TeacherModel = new Schema({
    id: {type: String, required: true},
    nom: {type: String, required: true},
    bio: {type: String, required: true},
    cours: {type: [String], required: true}
})

const Teacher = mongoose.model("Teacher", TeacherModel)
module.exports = Teacher;