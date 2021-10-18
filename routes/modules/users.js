const express = require("express");
const router = express.Router();

const Restaurant = require("../../models/restaurants");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (rea, res) => {
  res.send("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  res.send("register");
});

router.get("/logout", (req, res) => {
  res.send("logout");
});

module.exports = router;
