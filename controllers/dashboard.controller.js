const User = require("../models/user.model");

module.exports.adminDashboard = (req, res) => {
    res.render("dashboards/adminDashboard");
};

module.exports.facultyDashboard = (req, res) => {
    res.render("dashboards/facultyDashboard");
};

module.exports.studentDashboard = (req, res) => {
    res.render("dashboards/studentDashboard");
};
