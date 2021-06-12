const express = require("express");
const router = express.Router();
const Restaurant = require("../../models/restaurants");

router.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurants) => {
      res.render("index", { restaurants });
    })
    .catch((error) => console.log(error));
});

router.get("/search", (req, res) => {
  const keyword = req.query.keyword.toLowerCase();
  if (keyword === "") {
    res.redirect("/");
  }
  return Restaurant.find()
    .lean()
    .then((restaurants) => {
      const restaurantResult = restaurants.filter(
        (ele) =>
          ele.name.toLowerCase().includes(keyword) ||
          ele.name_en.toLowerCase().includes(keyword)
      );
      res.render("index", { restaurants: restaurantResult, keyword });
    });
});

module.exports = router;
