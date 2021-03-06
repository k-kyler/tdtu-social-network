const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    userId: String,
    name: String,
    email: String,
    password: String,
    phone: String,
    class: String,
    faculty: String,
    workplace: String,
    avatar: String,
    permission: [{ postName: String }],
    type: String,
});

let User = mongoose.model("User", userSchema, "users");

module.exports = User;
