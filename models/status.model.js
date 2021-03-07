const mongoose = require("mongoose");

let statusSchema = new mongoose.Schema({
    name: String,
    timestamp: String,
    profileAvatar: String,
    content: String,
    image: String,
    video: String,
});

let Status = mongoose.model("Status", statusSchema, "status");

module.exports = Status;
