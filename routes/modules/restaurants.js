const express = require("express");
const router = express.Router();
const Restaurant = require("../../models/restaurants");

//add new restaurant page
router.get("/new", (req, res) => {
  res.render("new");
});

router.post("/", (req, res) => {
  const restaurants = new Restaurant({ ...req.body });
  return restaurants
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      console.log(error);
    });
});

//show one restaurant
router.get("/:id", (req, res) => {
  const restaurantId = req.params.id;
  return Restaurant.findById(restaurantId)
    .lean()
    .then((restaurant) => {
      res.render("show", { restaurant });
    });
});

//edit one restaurant
router.get("/:id/edit", (req, res) => {
  const restaurantId = req.params.id;
  return Restaurant.findById(restaurantId)
    .lean()
    .then((restaurant) => {
      res.render("edit", { restaurant });
    });
});

router.put("/:id", (req, res) => {
  const restaurantId = req.params.id;
  return Restaurant.findById(restaurantId)
    .then((restaurant) => {
      Object.assign(restaurant, { ...req.body });
      return restaurant.save();
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      console.log(error);
    });
});

//delet one restaurant
router.delete("/:id", (req, res) => {
  const restaurantId = req.params.id;
  return Restaurant.findById(restaurantId)
    .then((restaurant) => {
      return restaurant.remove();
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
