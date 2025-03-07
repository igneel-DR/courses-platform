const mongoose = require('mongoose');
const { Schema } = mongoose;

const StudentModel = new Schema({
    id: {type: String, required: true},
    nom: {type: String, required: true},
    email: {type: String, required: true},
    cours: {type: [String], required: true}
})

const Student = mongoose.model("Student", StudentModel)
module.exports = Student
