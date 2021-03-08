const mongoose = require("mongoose");

let postSchema = new mongoose.Schema({
    name: String,
    timestamp: String,
    profileAvatar: String,
    content: String,
    image: String,
    video: String,
    comment: [
        {
            guestAvatar: String,
            guestComment: String,
            guestName: String,
            commentTimeStamp: String,
        },
    ],
});

let Post = mongoose.model("Post", postSchema, "posts");

module.exports = Post;
