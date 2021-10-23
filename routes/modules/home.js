const express = require("express");
const router = express.Router();
const Restaurant = require("../../models/restaurants");

router.get("/", (req, res) => {
  const userId = req.user._id;
  Restaurant.find({ userId })
    .lean()
    .then((restaurants) => {
      res.render("index", { restaurants });
    })
    .catch((error) => console.log(error));
});

router.get("/search/", (req, res) => {
  const keyword = req.query.keyword.toLowerCase();
  if (keyword === "") {
    res.redirect("/");
  }
  const userId = req.user._id;
  return Restaurant.find({ userId })
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

router.get("/search/sort/:criteria/:order", (req, res) => {
  const searchCriteria = new Object();
  searchCriteria[req.params.criteria] = req.params.order;
  const keyword = req.query.keyword.toLowerCase();
  if (keyword === "") {
    res.redirect("/");
  }
  const userId = req.user._id;
  return Restaurant.find({ userId })
    .lean()
    .sort(searchCriteria)
    .then((restaurants) => {
      const restaurantResult = restaurants.filter(
        (ele) =>
          ele.name.toLowerCase().includes(keyword) ||
          ele.name_en.toLowerCase().includes(keyword)
      );
      res.render("index", { restaurants: restaurantResult, keyword });
    });
});

router.get("/sort/:criteria/:order", (req, res) => {
  const searchCriteria = new Object();
  searchCriteria[req.params.criteria] = req.params.order;
  const userId = req.user._id;
  Restaurant.find({ userId })
    .lean()
    .sort(searchCriteria)
    .then((restaurants) => {
      res.render("index", { restaurants });
    })
    .catch((error) => console.log(error));
});

module.exports = router;
