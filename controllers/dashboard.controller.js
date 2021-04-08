const User = require("../models/user.model");
const ListOfficeFaculty = require("../models/ListOfficeFaculty.model");
const Post = require("../models/post.model");
const fs = require("fs");
const multer = require("multer");
const md5 = require("md5");
const shortid = require("shortid");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const { v4: v4UniqueId } = require("uuid");

// Multer upload setup
const upload = multer({
    dest: "./public/uploads/",
    fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith("image/")) {
            callback(null, true); // Accept upload image
        } else {
            callback(null, false); // Reject upload file that is not an image
        }
    },
    limits: { fileSize: 5000000 }, // 5 MB limit
});

// Dashboard
module.exports.dashboard = async (req, res) => {
    let user = await User.findById(req.signedCookies.userId);
    let posts = await Post.find().sort({ number: -1 }); // Get desc posts list

    res.render("dashboards/dashboard", {
        user,
        posts,
    });
};

// Update user info
module.exports.updateUserInfo = async (req, res) => {
    //let uploader = upload.single('avatar')
    //let avatar = req.file
    /* let avatarPath = `public/uploads/${avatar.originalname}`;

    // Rename avatar in public folder
    fs.renameSync(avatar.path, avatarPath);

    // Re-path to store in db
    avatarPath = `/uploads/${avatar.originalname}`; */

    var id = req.signedCookies.userId;
    let user = await User.findById(req.signedCookies.userId);

    if (user.type == "Student") {
        var item = {
            name: req.body.userName,
            phone: req.body.userPhone,
            class: req.body.class,
            faculty: req.body.faculty,
        };
    } else {
        if (req.body.newPassword == "") {
            var item = {
                name: req.body.userName,
                phone: req.body.userPhone,
            };
        } else {
            var item = {
                name: req.body.userName,
                phone: req.body.userPhone,
                password: md5(req.body.newPassword),
            };
        }
    }
    if (md5(req.body.newPassword) == user.password) {
        res.json({
            error: "New password and current password cannot be the same",
        });
    } else {
        User.updateOne(
            { _id: mongoose.Types.ObjectId(id) },
            { $set: item },
            function (err, result) {
                if (result) {
                    res.json({
                        success: "Update user information success",
                    });
                }
                if (err) {
                    res.json({
                        error:
                            "New password and current password cannot be the same",
                    });
                }
            }
        );
    }
};

// Notification
module.exports.notification = async (req, res) => {
    let user = await User.findById(req.signedCookies.userId);

    res.render("dashboards/notification", {
        user: user,
    });
};

// Users
module.exports.users = async (req, res) => {
    let user = await User.findById(req.signedCookies.userId);
    let users = await User.find();
    let listOfficeFaculty = await ListOfficeFaculty.find();

    res.render("dashboards/users", {
        user: user,
        users: users,
        listOfficeFaculty: listOfficeFaculty,
    });
};

// Create new staff account
module.exports.createNewStaff = async (req, res) => {
    let uploader = upload.single("avatar");

    uploader(req, res, async (error) => {
        let { email, password, name, phone, workplace, permission } = req.body;
        let avatar = req.file;
        let errorMessage = "";
        let checkUser = await User.findOne({ email: req.body.email });
        let user = await User.findById(req.signedCookies.userId);
        let users = await User.find();
        let listOfficeFaculty = await ListOfficeFaculty.find();
        let avatarPath = `public/uploads/${avatar.originalname}`;

        // Rename avatar in public folder
        fs.renameSync(avatar.path, avatarPath);

        // Re-path to store in db
        avatarPath = `/uploads/${avatar.originalname}`;

        // Check if image too large
        if (error) {
            errorMessage = "Image too large";
        }

        // Check if email was used
        if (checkUser) {
            errorMessage = "Email has been used";
        }

        // Check if email is not tdtu
        if (!email.includes("@tdtu.edu.vn")) {
            errorMessage = "Email is not TDTU type";
        }

        // Display error or create new staff
        if (errorMessage) {
            res.render("dashboards/users", {
                user: user,
                users: users,
                listOfficeFaculty: listOfficeFaculty,
                errorMessage: errorMessage,
                email: email,
                password: password,
                name: name,
                phone: phone,
                workplace: workplace,
                permission: permission,
            });
        } else {
            let u = new User();
            let permissionObj;

            // Check if permission input is string (one choice) or array (multiple)
            if (typeof permission !== "string") {
                permissionObj = permission.map((p) => {
                    return {
                        postName: p,
                    };
                });
            } else {
                permissionObj = [
                    {
                        postName: permission,
                    },
                ];
            }

            // Store to db
            u.userId = shortid.generate();
            u.email = email;
            u.password = md5(password);
            u.name = name;
            u.phone = phone;
            u.workplace = workplace;
            u.permission = permissionObj;
            u.avatar = avatarPath;
            u.faculty = "";
            u.class = "";
            u.type = "Staff";
            u.save();
            res.redirect("/dashboard/users");
        }
    });
};

// Get post
module.exports.getPost = async (req, res) => {
    let { postUniqueId } = req.params;
    let post = await Post.findOne({ postUniqueId });

    if (post) {
        res.json({
            code: 1,
            data: post,
        });
    } else {
        res.json({
            code: 0,
            message: "Post is not existed!",
        });
    }
};

// Add new post
module.exports.addNewPost = async (req, res) => {
    let {
        postUniqueId,
        profileAvatar,
        name,
        timestamp,
        content,
        ownerId,
        video,
        image,
    } = req.body;
    let posts = await Post.find();

    if (
        video &&
        video.includes("https://www.youtube.com/embed/") &&
        content !== "" &&
        image
    ) {
        let post = new Post();
        let imageURL = `./public/uploads/${v4UniqueId()}.jpg`;
        let fetchResponse = await fetch(image);
        let buffer = await fetchResponse.buffer();

        post.ownerId = ownerId;
        post.postUniqueId = postUniqueId;
        post.name = name;
        post.profileAvatar = profileAvatar;
        post.timestamp = timestamp;
        post.content = content;
        post.video = video;
        post.image = imageURL.split("./public")[1];
        post.number = posts.length > 0 ? posts[posts.length - 1].number + 1 : 1;
        post.save();

        // Download file from file.io API then response back to client
        fs.writeFile(imageURL, buffer, () => {
            res.json({
                code: 1,
                message: "You have added new post",
                alertId: shortid.generate(),
                imageURL: imageURL.split("./public")[1],
            });
        });
    } else if (!video && image && content !== "") {
        let post = new Post();
        let imageURL = `./public/uploads/${v4UniqueId()}.jpg`;
        let fetchResponse = await fetch(image);
        let buffer = await fetchResponse.buffer();

        post.ownerId = ownerId;
        post.postUniqueId = postUniqueId;
        post.name = name;
        post.profileAvatar = profileAvatar;
        post.timestamp = timestamp;
        post.content = content;
        post.video = video;
        post.image = imageURL.split("./public")[1];
        post.number = posts.length > 0 ? posts[posts.length - 1].number + 1 : 1;
        post.save();

        // Download file from file.io API then response back to client
        fs.writeFile(imageURL, buffer, () => {
            res.json({
                code: 1,
                message: "You have added new post",
                alertId: shortid.generate(),
                imageURL: imageURL.split("./public")[1],
            });
        });
    } else if (!video && !image && content !== "") {
        let post = new Post();

        post.ownerId = ownerId;
        post.postUniqueId = postUniqueId;
        post.name = name;
        post.profileAvatar = profileAvatar;
        post.timestamp = timestamp;
        post.content = content;
        post.number = posts.length > 0 ? posts[posts.length - 1].number + 1 : 1;
        post.save();

        res.json({
            code: 1,
            message: "You have added new post",
            alertId: shortid.generate(),
        });
    } else if (video && !image && content !== "") {
        let post = new Post();

        post.ownerId = ownerId;
        post.postUniqueId = postUniqueId;
        post.name = name;
        post.profileAvatar = profileAvatar;
        post.timestamp = timestamp;
        post.content = content;
        post.video = video;
        post.number = posts.length > 0 ? posts[posts.length - 1].number + 1 : 1;
        post.save();

        res.json({
            code: 1,
            message: "You have added new post",
            alertId: shortid.generate(),
        });
    } else if (video && !video.includes("https://www.youtube.com/embed/")) {
        res.json({
            code: 0,
            message: "Invalid Youtube URL!",
        });
    } else if (content === "") {
        res.json({
            code: 0,
            message: "Content can not be empty!",
        });
    }
};

// Edit post
module.exports.editPost = async (req, res) => {
    let { timestamp, content, video, postUniqueId, image } = req.body;
    let post = await Post.findOne({ postUniqueId });

    if (
        video &&
        video.includes("https://www.youtube.com/embed/") &&
        content !== "" &&
        image &&
        image !== "No image" &&
        !image.includes("/uploads/")
    ) {
        let imageURL = `./public/uploads/${v4UniqueId()}.jpg`;
        let fetchResponse = await fetch(image);
        let buffer = await fetchResponse.buffer();

        let updatePost = await Post.findOneAndUpdate(
            { postUniqueId },
            {
                timestamp,
                content,
                video,
                image: imageURL.split("./public")[1],
            },
            {
                new: true,
            }
        );

        // Download file from file.io API then response back to client
        fs.writeFile(imageURL, buffer, () => {
            res.json({
                code: 1,
                message: "You have edited post",
                alertId: shortid.generate(),
                ownerId: post.ownerId,
                imageURL: imageURL.split("./public")[1],
            });
        });
    } else if (
        video === "No video" &&
        image &&
        image !== "No image" &&
        !image.includes("/uploads/") &&
        content !== ""
    ) {
        let imageURL = `./public/uploads/${v4UniqueId()}.jpg`;
        let fetchResponse = await fetch(image);
        let buffer = await fetchResponse.buffer();

        let updatePost = await Post.findOneAndUpdate(
            { postUniqueId },
            {
                timestamp,
                content,
                image: imageURL.split("./public")[1],
            },
            {
                new: true,
            }
        );

        // Download file from file.io API then response back to client
        fs.writeFile(imageURL, buffer, () => {
            res.json({
                code: 1,
                message: "You have edited post",
                alertId: shortid.generate(),
                ownerId: post.ownerId,
                imageURL: imageURL.split("./public")[1],
            });
        });
    } else if (video === "No video" && !image && content !== "") {
        let updatePost = await Post.findOneAndUpdate(
            { postUniqueId },
            {
                timestamp,
                content,
            },
            {
                new: true,
            }
        );

        res.json({
            code: 1,
            message: "You have edited post",
            alertId: shortid.generate(),
            ownerId: post.ownerId,
        });
    } else if (
        video &&
        video.includes("https://www.youtube.com/embed/") &&
        (!image || image.includes("/uploads/")) &&
        content !== ""
    ) {
        let updatePost = await Post.findOneAndUpdate(
            { postUniqueId },
            {
                timestamp,
                content,
                video,
            },
            {
                new: true,
            }
        );

        res.json({
            code: 1,
            message: "You have edited post",
            alertId: shortid.generate(),
            ownerId: post.ownerId,
            imageURL: image,
        });
    } else if (
        video &&
        video.includes("https://www.youtube.com/embed/") &&
        image === "No image" &&
        content !== ""
    ) {
        let updatePost = await Post.findOneAndUpdate(
            { postUniqueId },
            {
                timestamp,
                content,
                video,
                image: "",
            },
            {
                new: true,
            }
        );

        res.json({
            code: 1,
            message: "You have edited post",
            alertId: shortid.generate(),
            ownerId: post.ownerId,
        });
    } else if (video === "No video" && image === "No image" && content !== "") {
        let updatePost = await Post.findOneAndUpdate(
            { postUniqueId },
            {
                timestamp,
                content,
                video: "",
                image: "",
            },
            {
                new: true,
            }
        );

        res.json({
            code: 1,
            message: "You have edited post",
            alertId: shortid.generate(),
            ownerId: post.ownerId,
        });
    } else if (
        video === "No video" &&
        image &&
        image.includes("/uploads/") &&
        content !== ""
    ) {
        let updatePost = await Post.findOneAndUpdate(
            { postUniqueId },
            {
                timestamp,
                content,
                video: "",
            },
            {
                new: true,
            }
        );

        res.json({
            code: 1,
            message: "You have edited post",
            alertId: shortid.generate(),
            ownerId: post.ownerId,
            imageURL: image,
        });
    } else if (video && !video.includes("https://www.youtube.com/embed/")) {
        res.json({
            code: 0,
            message: "Invalid Youtube URL!",
        });
    } else if (content === "") {
        res.json({
            code: 0,
            message: "Content can not be empty!",
        });
    }
};

// Delete post
module.exports.deletePost = async (req, res) => {
    let { postUniqueId } = req.params;
    let post = await Post.findOne({ postUniqueId });
    let deletePost = await Post.deleteOne({ postUniqueId });

    res.json({
        code: 1,
        message: "Delete post successful",
        alertId: shortid.generate(),
        ownerId: post.ownerId,
    });
};

// Get comment
module.exports.getComment = async (req, res) => {
    let { commentUniqueId, postUniqueId } = req.params;
    let post = await Post.findOne({ postUniqueId });
    let comments = post.comment;
    let commentQuery = "";

    for (let comment of comments) {
        if (comment.commentUniqueId === commentUniqueId) {
            commentQuery = comment;
        }
    }

    if (commentQuery !== "") {
        res.json({
            code: 1,
            data: commentQuery,
        });
    } else {
        res.json({
            code: 0,
            message: "Comment is not existed!",
        });
    }
};

// Add new comment
module.exports.addNewComment = async (req, res) => {
    let post = await Post.findOne({ postUniqueId: req.body.postUniqueId });

    if (req.body.guestComment) {
        let updatePostWithComment = await Post.findOneAndUpdate(
            { postUniqueId: req.body.postUniqueId },
            {
                comment: [...post.comment, req.body],
            },
            {
                new: true,
            }
        );

        res.json({
            code: 1,
            message: "You have added new comment",
        });
    } else {
        res.json({
            code: 0,
            message: "Comment can not be empty!",
        });
    }
};

// Edit comment
module.exports.editComment = async (req, res) => {
    let {
        postUniqueId,
        commentUniqueId,
        commentTimeStamp,
        guestComment,
    } = req.body;
    let post = await Post.findOne({ postUniqueId });

    if (guestComment) {
        let comments = post.comment;
        let commentIndex = comments.findIndex(
            (comment) => comment.commentUniqueId === commentUniqueId
        );

        let updateComment = await Post.findOneAndUpdate(
            {
                postUniqueId: req.body.postUniqueId,
                comment: { $elemMatch: { commentUniqueId } },
            },
            {
                $set: {
                    "comment.$.guestComment": guestComment,
                    "comment.$.commentTimeStamp": commentTimeStamp,
                },
            },
            {
                new: true,
            }
        );

        res.json({
            code: 1,
            guestId: comments[commentIndex].guestId,
            message: "You have edited comment",
            alertId: shortid.generate(),
        });
    } else {
        res.json({
            code: 0,
            message: "Comment can not be empty!",
        });
    }
};

// Delete comment
module.exports.deleteComment = async (req, res) => {
    let { postUniqueId, commentUniqueId } = req.params;
    let post = await Post.findOne({ postUniqueId });
    let comments = post.comment;
    let commentIndex = comments.findIndex(
        (comment) => comment.commentUniqueId === commentUniqueId
    );
    let guestId = comments[commentIndex].guestId;

    let deleteComment = Post.updateOne(
        {
            postUniqueId,
        },
        {
            $pullAll: {
                comment: [comments[commentIndex]],
            },
        }
    );

    deleteComment.exec();

    res.json({
        code: 1,
        message: "Delete comment successful",
        alertId: shortid.generate(),
        guestId,
    });
};
