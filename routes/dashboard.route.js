const express = require("express");
const controller = require("../controllers/dashboard.controller");

let router = express.Router();

router.get("/", controller.dashboard);

router.post("/info", controller.updateUserInfo);

router.get("/users", controller.users);
router.post("/users", controller.createNewStaff);

router.get("/notification", controller.notification);

router.get("/post/:postUniqueId", controller.getPost);
router.post("/post", controller.addNewPost);
router.put("/post/edit", controller.editPost);
router.delete("/post/delete/:postUniqueId", controller.deletePost);

router.put("/post", controller.addNewComment);

module.exports = router;
