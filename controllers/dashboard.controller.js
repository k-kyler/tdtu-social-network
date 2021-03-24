const User = require("../models/user.model");
const ListOfficeFaculty = require("../models/ListOfficeFaculty.model");
const Post = require("../models/post.model");
const fs = require("fs");
const multer = require("multer");
const md5 = require("md5");
const shortid = require("shortid");
const mongoose = require("mongoose");

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

    res.render("dashboards/dashboard", {
        user: user,
    });
};

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

// Post
module.exports.addNewPost = async (req, res) => {
    let { postUniqueId, profileAvatar, name, timestamp, content } = req.body;

    res.json({
        message: "You have added new post!",
    });
};

// Comment
module.exports.addNewComment = async (req, res) => {};
