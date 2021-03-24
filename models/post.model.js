const mongoose = require("mongoose");

let postSchema = new mongoose.Schema({
    name: String,
    postUniqueId: String,
    timestamp: String,
    profileAvatar: String,
    content: String,
    image: String,
    video: String,
    comment: [
        {
            commentUniqueId: String,
            guestAvatar: String,
            guestComment: String,
            guestName: String,
            commentTimeStamp: String,
        },
    ],
});

let Post = mongoose.model("Post", postSchema, "posts");

module.exports = Post;
