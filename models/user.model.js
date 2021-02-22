const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    class: String,
    faculty: String,
    avatar: String,
    type: String,
});

let User = mongoose.model("User", userSchema, "users");

module.exports = User;
