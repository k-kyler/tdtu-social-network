const express = require("express");
const controller = require("../controllers/dashboard.controller");

let router = express.Router();

router.get("/", controller.dashboard);
router.post("/info", controller.updateUserInfo);
router.get("/users", controller.users);
router.post("/users", controller.createNewStaff);
router.get("/notification", controller.notification);
router.post("/post", controller.addNewPost);
router.put("/post/:postUniqueId", controller.addNewComment);

module.exports = router;
