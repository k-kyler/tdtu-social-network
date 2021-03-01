const User = require("../models/user.model");
const md5 = require("md5");

module.exports.login = (req, res) => {
    res.render("auth/login");
};

module.exports.postLogin = async (req, res) => {
    // Get form input data
    let email = req.body.email;
    let password = req.body.password;

    // Hashed input password
    let hashedPassword = md5(password);

    // Find user info by input email
    let user = await User.findOne({ email: email });

    // Check user info
    if (!user) {
        res.render("auth/login", {
            error: "Account does not exist",
            loginInput: req.body,
        });
        return;
    }

    // Check if email is not TDTU type
    if (!email.includes("@tdtu.edu.vn")) {
        res.render("auth/login", {
            error: "Email is not TDTU type",
            loginInput: req.body,
        });
        return;
    }

    // Check user input password
    if (user.password !== hashedPassword) {
        res.render("auth/login", {
            error: "Wrong password",
            loginInput: req.body,
        });
        return;
    }

    // If login success then generating user's cookie
    res.cookie("userId", user._id, {
        signed: true,
    });

    res.cookie("userName", user.name, {
        signed: true,
    });

    // Redirect user back to home page
    res.redirect("/");
};
