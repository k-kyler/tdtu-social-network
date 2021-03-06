const express = require("express");
const controller = require("../controllers/dashboard.controller");

let router = express.Router();

router.get("/", controller.dashboard);
router.post("/", controller.changeUserInfo);
router.get("/users", controller.users);
router.post("/users", controller.createNewStaff);
router.get("/notification", controller.notification);

module.exports = router;
