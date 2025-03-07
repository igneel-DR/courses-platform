const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserModel = new Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
})

const User = mongoose.model("User", UserModel)
module.exports = User
