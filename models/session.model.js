const mongoose = require("mongoose");

let sessionSchema = new mongoose.Schema({
    sessionId: String,
});

let Session = mongoose.model("Session", sessionSchema, "sessions");

module.exports = Session;
