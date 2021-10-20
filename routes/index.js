const express = require("express");
const router = express.Router();

const home = require("./modules/home");
const auth = require("./modules/auth");
const restaurants = require("./modules/restaurants");
const users = require("./modules/users");

//set up authenticator middleware
const { authenticator } = require("../middleware/auth");

router.use("/restaurants", authenticator, restaurants);
router.use("/users", users);
router.use("/auth", auth);
router.use("/", authenticator, home);

module.exports = router;
