const mongoose = require("mongoose");

let postSchema = new mongoose.Schema({
    ownerId: String,
    timeSort: Date,
    name: String,
    postUniqueId: String,
    timestamp: String,
    profileAvatar: String,
    content: String,
    image: String,
    video: String,
    comment: [
        {
            guestId: String,
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
