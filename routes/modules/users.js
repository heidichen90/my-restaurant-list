const express = require("express");
const router = express.Router();
const passport = require("passport");

const bcrypt = require("bcryptjs");

const Restaurant = require("../../models/restaurants");
const User = require("../../models/users");

router.get("/login", (rea, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];
  //check register form field
  if (!email || !password || !confirmPassword) {
    errors.push({ message: "Missing required field." });
  }
  if (password !== confirmPassword) {
    errors.push({ message: "Password didnt match Confirm Password." });
  }

  //check if user exist
  if (errors.length) {
    return res.render("register", {
      errors,
      name,
      email,
      password,
      confirmPassword,
    });
  } else {
    //check if user exist
    User.findOne({ email })
      .then((user) => {
        if (user) {
          errors.push({ message: "This email is registed" });
          return res.render("register", {
            errors,
            name,
            email,
            password,
            confirmPassword,
          });
        } else {
          //if user dont exist, then create user
          return bcrypt
            .genSalt(10)
            .then((salt) => bcrypt.hash(password, salt))
            .then((hash) => User.create({ name, email, password: hash }))
            .then(() => {
              res.redirect("/");
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You have successfully logged out");
  res.redirect("/");
});

module.exports = router;
