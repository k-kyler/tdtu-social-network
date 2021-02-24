const User = require("../models/user.model");

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

    res.render("dashboards/users", {
        user: user,
    });
};
