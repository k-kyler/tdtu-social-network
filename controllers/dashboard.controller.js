const User = require("../models/user.model");
const ListOfficeFaculty = require("../models/ListOfficeFaculty.model");
const Post = require("../models/post.model");
const Notification = require("../models/notification.model");
const fs = require("fs");
const multer = require("multer");
const md5 = require("md5");
const shortid = require("shortid");
const fetch = require("node-fetch");
const { v4: v4UniqueId } = require("uuid");
const fileType = require("file-type");

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
    let posts = await Post.find().sort({ timeSort: -1 }); // Get desc posts list by time
    let listOfficeFaculty = await ListOfficeFaculty.find();
    let notifications = await Notification.find().sort({ timeSort: -1 }); // Get desc notifications list by time
    let totalNotifPages = Math.ceil(notifications.length / 10); // Calculate the total notification pages

    res.render("dashboards/dashboard", {
        user,
        posts,
        listOfficeFaculty,
        notifications: notifications.slice(0, 10), // Get the first 10 notifications
        totalNotifPages,
    });
};

// Get user info
module.exports.getUserInfo = async (req, res) => {
    let user = await User.findById(req.signedCookies.userId);

    if (user && !user.avatar) {
        res.json({
            code: 1,
            data: {
                name: user.name,
                phone: user.phone,
                class: user.class,
                faculty: user.faculty,
                avatar: "/images/default_avatar.svg",
            },
        });
    } else if (user && user.avatar) {
        res.json({
            code: 1,
            data: {
                name: user.name,
                phone: user.phone,
                class: user.class,
                faculty: user.faculty,
                avatar: user.avatar,
            },
        });
    } else {
        res.json({
            code: 0,
            message: "No user!",
        });
    }
};

// Update user info
module.exports.updateUserInfo = async (req, res) => {
    let {
        hiddenNewAvatarURL,
        userName,
        userPhone,
        newPassword,
        studentClass,
        studentFaculty,
    } = req.body;
    let user = await User.findById(req.signedCookies.userId);

    if (!userName) {
        res.json({
            code: 0,
            message: "Name can not be empty!",
        });
    } else if (!userPhone) {
        res.json({
            code: 0,
            message: "Phone can not be empty!",
        });
    } else if (
        userPhone &&
        /(0[3|5|7|8|9])+([0-9]{8})\b/g.test(userPhone) === false
    ) {
        res.json({
            code: 0,
            message: "Invalid phone number!",
        });
    } else if (newPassword && md5(newPassword) === user.password) {
        res.json({
            code: 0,
            message: "You have just entered an old password!",
        });
    } else {
        if (!newPassword) {
            if (hiddenNewAvatarURL) {
                let fetchResponse = await fetch(hiddenNewAvatarURL);
                let buffer = await fetchResponse.buffer();
                let imageExt = await fileType.fromBuffer(buffer);
                let imageSize = Buffer.byteLength(buffer);
                let newAvatarURL = `./public/uploads/${v4UniqueId()}.${
                    imageExt.ext
                }`;

                // Check if image size is over 5 MB
                if (imageSize > 5000000) {
                    res.json({
                        code: 0,
                        message: "Image size is over 5 MB",
                    });
                }
                // Check image extension
                else if (
                    new RegExp(["png", "jpg"].join("|")).test(imageExt.ext) ===
                    false
                ) {
                    res.json({
                        code: 0,
                        message: "Not supported file",
                    });
                } else {
                    // Update user info
                    let updateInfo = await User.findOneAndUpdate(
                        { _id: req.signedCookies.userId },
                        {
                            name: userName,
                            phone: userPhone,
                            class: studentClass ? studentClass : "",
                            faculty: studentFaculty ? studentFaculty : "",
                            avatar: newAvatarURL.split("./public")[1],
                        },
                        { new: true }
                    );

                    // Update user name and avatar in all posts
                    let updateAllPosts = await Post.updateMany(
                        { ownerId: req.signedCookies.userId },
                        {
                            name: userName,
                            profileAvatar: newAvatarURL.split("./public")[1],
                        }
                    );

                    // Update user name in all notifications
                    let updateAllNotifications = await Notification.updateMany(
                        { ownerId: req.signedCookies.userId },
                        {
                            owner: userName,
                        }
                    );

                    // Update user name and avatar in all comments
                    let updateAllComments = await Post.updateMany(
                        {},
                        {
                            $set: {
                                "comment.$[id].guestName": userName,
                                "comment.$[id].guestAvatar": newAvatarURL.split(
                                    "./public"
                                )[1],
                            },
                        },
                        {
                            arrayFilters: [
                                {
                                    "id.guestId": req.signedCookies.userId,
                                },
                            ],
                        }
                    );

                    // Download file from file.io API then response back to client
                    fs.writeFile(newAvatarURL, buffer, () => {
                        res.json({
                            code: 1,
                            message: "Update information successful",
                        });
                    });
                }
            } else {
                // Update user info
                let updateInfo = await User.findOneAndUpdate(
                    { _id: req.signedCookies.userId },
                    {
                        name: userName,
                        phone: userPhone,
                        class: studentClass ? studentClass : "",
                        faculty: studentFaculty ? studentFaculty : "",
                    },
                    { new: true }
                );

                // Update user name in all posts
                let updateAllPosts = await Post.updateMany(
                    { ownerId: req.signedCookies.userId },
                    { name: userName }
                );

                // Update user name in all notifications
                let updateAllNotifications = await Notification.updateMany(
                    { ownerId: req.signedCookies.userId },
                    {
                        owner: userName,
                    }
                );

                // Update user name in all comments
                let updateAllComments = await Post.updateMany(
                    {},
                    {
                        $set: {
                            "comment.$[id].guestName": userName,
                        },
                    },
                    {
                        arrayFilters: [
                            {
                                "id.guestId": req.signedCookies.userId,
                            },
                        ],
                    }
                );

                res.json({
                    code: 1,
                    message: "Update information successful",
                });
            }
        } else if (newPassword && md5(newPassword) !== user.password) {
            if (hiddenNewAvatarURL) {
                let fetchResponse = await fetch(hiddenNewAvatarURL);
                let buffer = await fetchResponse.buffer();
                let imageExt = await fileType.fromBuffer(buffer);
                let imageSize = Buffer.byteLength(buffer);
                let newAvatarURL = `./public/uploads/${v4UniqueId()}.${
                    imageExt.ext
                }`;

                // Check if image size is over 5 MB
                if (imageSize > 5000000) {
                    res.json({
                        code: 0,
                        message: "Image size is over 5 MB",
                    });
                }
                // Check image extension
                else if (
                    new RegExp(["png", "jpg"].join("|")).test(imageExt.ext) ===
                    false
                ) {
                    res.json({
                        code: 0,
                        message: "Not supported file",
                    });
                } else {
                    // Update user info
                    let updateInfo = await User.findOneAndUpdate(
                        { _id: req.signedCookies.userId },
                        {
                            name: userName,
                            phone: userPhone,
                            class: studentClass ? studentClass : "",
                            faculty: studentFaculty ? studentFaculty : "",
                            password: md5(newPassword),
                            avatar: newAvatarURL.split("./public")[1],
                        },
                        { new: true }
                    );

                    // Update user name and avatar in all posts
                    let updateAllPosts = await Post.updateMany(
                        { ownerId: req.signedCookies.userId },
                        {
                            name: userName,
                            profileAvatar: newAvatarURL.split("./public")[1],
                        }
                    );

                    // Update user name in all notifications
                    let updateAllNotifications = await Notification.updateMany(
                        { ownerId: req.signedCookies.userId },
                        {
                            owner: userName,
                        }
                    );

                    // Update user name and avatar in all comments
                    let updateAllComments = await Post.updateMany(
                        {},
                        {
                            $set: {
                                "comment.$[id].guestName": userName,
                                "comment.$[id].guestAvatar": newAvatarURL.split(
                                    "./public"
                                )[1],
                            },
                        },
                        {
                            arrayFilters: [
                                {
                                    "id.guestId": req.signedCookies.userId,
                                },
                            ],
                        }
                    );

                    // Download file from file.io API then response back to client
                    fs.writeFile(newAvatarURL, buffer, () => {
                        res.json({
                            code: 1,
                            message: "Update information successful",
                        });
                    });
                }
            } else {
                // Update user info
                let updateInfo = await User.findOneAndUpdate(
                    { _id: req.signedCookies.userId },
                    {
                        name: userName,
                        phone: userPhone,
                        class: studentClass ? studentClass : "",
                        faculty: studentFaculty ? studentFaculty : "",
                        password: md5(newPassword),
                    },
                    { new: true }
                );

                // Update user name in all posts
                let updateAllPosts = await Post.updateMany(
                    { ownerId: req.signedCookies.userId },
                    { name: userName }
                );

                // Update user name in all notifications
                let updateAllNotifications = await Notification.updateMany(
                    { ownerId: req.signedCookies.userId },
                    {
                        owner: userName,
                    }
                );

                // Update user name in all comments
                let updateAllComments = await Post.updateMany(
                    {},
                    {
                        $set: {
                            "comment.$[id].guestName": userName,
                        },
                    },
                    {
                        arrayFilters: [
                            {
                                "id.guestId": req.signedCookies.userId,
                            },
                        ],
                    }
                );

                res.json({
                    code: 1,
                    message: "Update information successful",
                });
            }
        }
    }
};

// Get user's wall
module.exports.getUserWall = async (req, res) => {
    let { id } = req.params;
    let user = await User.findById(req.signedCookies.userId);
    let posts = await Post.find().sort({ timeSort: -1 }); // Get desc posts list by time
    let listOfficeFaculty = await ListOfficeFaculty.find();
    let notifications = await Notification.find().sort({ timeSort: -1 }); // Get desc notifications list by time
    let totalNotifPages = Math.ceil(notifications.length / 10); // Calculate the total notification pages

    res.render("dashboards/wall", {
        user,
        posts,
        listOfficeFaculty,
        notifications: notifications.slice(0, 10), // Get the first 10 notifications
        totalNotifPages,
    });
};

// Notification
module.exports.notification = async (req, res) => {
    let user = await User.findById(req.signedCookies.userId);
    let notifications = await Notification.find();

    res.render("dashboards/notification", {
        user: user,
        notifications,
    });
};

// Get notification by id
module.exports.getNotification = async (req, res) => {
    let { id } = req.params;
    let notification = await Notification.findById(id);

    if (notification) {
        res.json({
            code: 1,
            data: notification,
        });
    } else {
        res.json({
            code: 0,
            message: "No notification!",
        });
    }
};

// Notification list filter and pagination
module.exports.notifPagination = async (req, res) => {
    let { name, page } = req.params;

    if (name === "all") {
        let notifications = await Notification.find().sort({ timeSort: -1 });

        if (notifications) {
            let totalNotifPages = Math.ceil(notifications.length / 10); // Calculate the total notification pages
            let perPage = 10;
            let start = (page - 1) * perPage;
            let end = start + perPage;

            res.json({
                code: 1,
                data: notifications.slice(start, end),
                totalNotifPages,
            });
        } else {
            res.json({
                code: 0,
                message: "No notifications found!",
            });
        }
    } else if (name !== "all") {
        let notificationsByType = await Notification.find({ type: name }).sort({
            timeSort: -1,
        });

        if (notificationsByType) {
            let totalNotifPages = Math.ceil(notificationsByType.length / 10); // Calculate the total notification pages
            let perPage = 10;
            let start = (page - 1) * perPage;
            let end = start + perPage;

            res.json({
                code: 1,
                data: notificationsByType.slice(start, end),
                totalNotifPages,
            });
        } else {
            res.json({
                code: 0,
                message: "No notifications found!",
            });
        }
    }
};

// Add new notification
module.exports.addNewNotification = async (req, res) => {
    let {
        notificationTitle,
        notificationContent,
        notificationType,
        notificationAttachment,
        notificationDate,
    } = req.body;
    let user = await User.findById(req.signedCookies.userId);

    if (
        notificationTitle &&
        notificationContent &&
        notificationType &&
        notificationDate &&
        !notificationAttachment
    ) {
        // Case for no attachment...........
        let notification = new Notification();

        // Add new notification details to db
        notification.ownerId = req.signedCookies.userId;
        notification.owner = user.name;
        notification.title = notificationTitle;
        notification.type = notificationType;
        notification.attachment = notificationAttachment;
        notification.content = notificationContent;
        notification.date = notificationDate;
        notification.timeSort = new Date().toISOString();
        notification.save();

        res.json({
            code: 1,
            ownerId: req.signedCookies.userId,
            message:
                "You have received new notification. <a href='/dashboard'>Refresh</a>",
            alertId: shortid.generate(),
        });
    } else if (
        notificationTitle &&
        notificationContent &&
        notificationType &&
        notificationDate &&
        notificationAttachment
    ) {
        let notification = new Notification();
        let fetchResponse = await fetch(notificationAttachment);
        let buffer = await fetchResponse.buffer();
        let attachmentExt = await fileType.fromBuffer(buffer);
        let attachmentSize = Buffer.byteLength(buffer);
        let attachmentDest = `./public/uploads/${v4UniqueId()}.${
            attachmentExt.ext
        }`;

        // Check file extension
        if (
            new RegExp(
                ["zip", "rar", "xlsx", "png", "jpg", "pdf", "docx"].join("|")
            ).test(attachmentExt.ext) === false
        ) {
            res.json({
                code: 0,
                message: "Your type of attachment is not supported",
            });
        }
        // Limit file size is 30 MB
        else if (attachmentSize > 30000000) {
            res.json({
                code: 0,
                message: "Your attachment is over 30 MB",
            });
        } else {
            // Add new notification details to db
            notification.ownerId = req.signedCookies.userId;
            notification.owner = user.name;
            notification.title = notificationTitle;
            notification.type = notificationType;
            notification.attachment = attachmentDest.split("./public")[1];
            notification.content = notificationContent;
            notification.date = notificationDate;
            notification.timeSort = new Date().toISOString();
            notification.save();

            // Download file from file.io API then response back to client
            fs.writeFile(attachmentDest, buffer, () => {
                res.json({
                    code: 1,
                    ownerId: req.signedCookies.userId,
                    message:
                        "You have received new notification. <a href='/dashboard'>Refresh</a>",
                    alertId: shortid.generate(),
                });
            });
        }
    } else if (!notificationTitle) {
        res.json({
            code: 0,
            message: "Title is required!",
        });
    } else if (!notificationContent) {
        res.json({
            code: 0,
            message: "Content is required!",
        });
    } else if (!notificationType) {
        res.json({
            code: 0,
            message: "Notification type is required!",
        });
    } else if (!notificationDate) {
        res.json({
            code: 0,
            message: "Notification date is required!",
        });
    }
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
        let avatarPath = `public/uploads/${
            avatar.originalname
        }-${v4UniqueId()}`;

        // Rename avatar in public folder
        fs.renameSync(avatar.path, avatarPath);

        // Re-path to store in db
        avatarPath = avatarPath.split("public")[1];

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
        let fetchResponse = await fetch(image);
        let buffer = await fetchResponse.buffer();
        let imageExt = await fileType.fromBuffer(buffer);
        let imageSize = Buffer.byteLength(buffer);
        let imageURL = `./public/uploads/${v4UniqueId()}.${imageExt.ext}`;

        // Check if image size is over 10 MB
        if (imageSize > 10000000) {
            res.json({
                code: 0,
                message: "Image size is over 10 MB",
                alertId: shortid.generate(),
            });
        }
        // Check image extension
        else if (
            new RegExp(["png", "jpg", "gif"].join("|")).test(imageExt.ext) ===
            false
        ) {
            res.json({
                code: 0,
                message: "Not supported file",
                alertId: shortid.generate(),
            });
        } else {
            post.ownerId = ownerId;
            post.postUniqueId = postUniqueId;
            post.name = name;
            post.profileAvatar = profileAvatar;
            post.timestamp = timestamp;
            post.content = content;
            post.video = video;
            post.image = imageURL.split("./public")[1];
            post.timeSort = new Date().toISOString();
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
        }
    } else if (!video && image && content !== "") {
        let post = new Post();
        let fetchResponse = await fetch(image);
        let buffer = await fetchResponse.buffer();
        let imageExt = await fileType.fromBuffer(buffer);
        let imageSize = Buffer.byteLength(buffer);
        let imageURL = `./public/uploads/${v4UniqueId()}.${imageExt.ext}`;

        // Check if image size is over 10 MB
        if (imageSize > 10000000) {
            res.json({
                code: 0,
                message: "Image size is over 10 MB",
                alertId: shortid.generate(),
            });
        }
        // Check image extension
        else if (
            new RegExp(["png", "jpg", "gif"].join("|")).test(imageExt.ext) ===
            false
        ) {
            res.json({
                code: 0,
                message: "Not supported file",
                alertId: shortid.generate(),
            });
        } else {
            post.ownerId = ownerId;
            post.postUniqueId = postUniqueId;
            post.name = name;
            post.profileAvatar = profileAvatar;
            post.timestamp = timestamp;
            post.content = content;
            post.video = video;
            post.image = imageURL.split("./public")[1];
            post.timeSort = new Date().toISOString();
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
        }
    } else if (!video && !image && content !== "") {
        let post = new Post();

        post.ownerId = ownerId;
        post.postUniqueId = postUniqueId;
        post.name = name;
        post.profileAvatar = profileAvatar;
        post.timestamp = timestamp;
        post.content = content;
        post.timeSort = new Date().toISOString();
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
        post.timeSort = new Date().toISOString();
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
        let fetchResponse = await fetch(image);
        let buffer = await fetchResponse.buffer();
        let imageExt = await fileType.fromBuffer(buffer);
        let imageSize = Buffer.byteLength(buffer);
        let imageURL = `./public/uploads/${v4UniqueId()}.${imageExt.ext}`;

        // Check if image size is over 10 MB
        if (imageSize > 10000000) {
            res.json({
                code: 0,
                message: "Image size is over 10 MB",
                ownerId: post.ownerId,
                alertId: shortid.generate(),
                image: post.image,
            });
        }
        // Check image extension
        else if (
            new RegExp(["png", "jpg", "gif"].join("|")).test(imageExt.ext) ===
            false
        ) {
            res.json({
                code: 0,
                message: "Not supported file",
                ownerId: post.ownerId,
                alertId: shortid.generate(),
                image: post.image,
            });
        } else {
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
        }
    } else if (
        video === "No video" &&
        image &&
        image !== "No image" &&
        !image.includes("/uploads/") &&
        content !== ""
    ) {
        let fetchResponse = await fetch(image);
        let buffer = await fetchResponse.buffer();
        let imageExt = await fileType.fromBuffer(buffer);
        let imageSize = Buffer.byteLength(buffer);
        let imageURL = `./public/uploads/${v4UniqueId()}.${imageExt.ext}`;

        // Check if image size is over 10 MB
        if (imageSize > 10000000) {
            res.json({
                code: 0,
                message: "Image size is over 10 MB",
                ownerId: post.ownerId,
                alertId: shortid.generate(),
                image: post.image,
            });
        }
        // Check image extension
        else if (
            new RegExp(["png", "jpg", "gif"].join("|")).test(imageExt.ext) ===
            false
        ) {
            res.json({
                code: 0,
                message: "Not supported file",
                ownerId: post.ownerId,
                alertId: shortid.generate(),
                image: post.image,
            });
        } else {
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
        }
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
