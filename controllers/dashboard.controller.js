const User = require("../models/user.model");
const ListOfficeFaculty = require("../models/ListOfficeFaculty.model");

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
    let { email, password, name, phone, workplace, permission } = req.body;
    let avatar = req.file;

    console.log(req.body);

    res.redirect("/dashboard/users");
};
