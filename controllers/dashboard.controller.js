const User = require("../models/user.model");
const ListOfficeFaculty = require("../models/ListOfficeFaculty.model");
const fs = require("fs");
const multer = require("multer");
const md5 = require("md5");
const shortid = require("shortid");
const upload = multer({
    dest: "./public/uploads/",
    fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith("image/")) {
            callback(null, true); // Accept upload image
        } else callback(null, false); // Reject upload file that is not an image
    },
    limits: { fileSize: 5000000 }, // 5 MB limit
});

module.exports.dashboard = async (req, res) => {
    let user = await User.findById(req.signedCookies.userId);

    res.render("dashboards/dashboard", {
        user: user,
    });
};

module.exports.info = async (req, res) => {
    let user = await User.findById(req.signedCookies.userId);

    res.render("dashboards/info", {
        user: user,
    });
};

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
    let user = await User.findById(req.signedCookies.userId);
    let users = await User.find();
    let listOfficeFaculty = await ListOfficeFaculty.find();
    let checkUser = await User.findOne({ email: req.body.email });

    uploader(req, res, (error) => {
        let { email, password, name, phone, workplace, permission } = req.body;
        let avatar = req.file;
        let errorMessage = undefined;

        // Check if image too large
        if (error) {
            errorMessage = "Image too large";
        }

        // Check if email was used
        else if (checkUser) {
            errorMessage = "Email has been used";
        }

        // Check if email is not tdtu
        else if (!email.includes("@tdtu.edu.vn")) {
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
            let permissionObj = permission.map((p) => {
                return {
                    postName: p,
                };
            });
            let avatarPath = `public/uploads/${avatar.originalname}`;

            // Rename avatar in public folder
            fs.renameSync(avatar.path, avatarPath);

            // Re-path to store in db
            avatarPath = `/uploads/${avatar.originalname}`;

            // Store to db
            u.userId = shortid.generate();
            u.email = email;
            u.password = md5(password);
            u.name = name;
            u.phone = phone;
            u.workplace = workplace;
            u.permission = permissionObj;
            u.avatar = avatarPath;
            u.class = "";
            u.type = "Staff";
            u.save();
            res.redirect("/dashboard/users");
        }
    });
};
