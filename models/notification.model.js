const mongoose = require("mongoose");

let notificationSchema = new mongoose.Schema({
    title: String,
    timeSort: Date,
    date: String,
    content: String,
    attachment: String,
    owner: String,
    ownerId: String,
    type: String,
});

let Notification = mongoose.model(
    "Notification",
    notificationSchema,
    "notifications"
);

module.exports = Notification;
