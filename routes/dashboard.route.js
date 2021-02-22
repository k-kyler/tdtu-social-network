const express = require("express");
const controller = require("../controllers/dashboard.controller");

let router = express.Router();

router.get("/admin", controller.adminDashboard);
router.get("/faculty", controller.facultyDashboard);
router.get("/student", controller.studentDashboard);

module.exports = router;
