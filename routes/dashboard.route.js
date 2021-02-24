const express = require("express");
const controller = require("../controllers/dashboard.controller");

let router = express.Router();

router.get("/", controller.dashboard);
router.get("/users", controller.users);
router.get("/info", controller.info);

module.exports = router;
