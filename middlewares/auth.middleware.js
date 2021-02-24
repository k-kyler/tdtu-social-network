const User = require("../models/user.model");

// Custom middleware to prevent user from accessing important routes if not logged in
module.exports.requireAuth = async (req, res, next) => {
    // Get user info if user has logged in by user id in cookie
    let user = await User.findById(req.signedCookies.userId);

    // Check if user has not logged in
    if (!req.signedCookies.userId) {
        res.redirect("/auth/login");
        return;
    }

    if (!user) {
        res.redirect("/auth/login");
        return;
    }

    next();
};
