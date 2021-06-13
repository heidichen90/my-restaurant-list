const db = require("../../config/mongoose");
const Restaurant = require("../restaurants");
const restaurantList = require("../../restaurant.json");

db.on("error", () => {
  console.log("fail to connect to mongo db!");
});

db.once("open", () => {
  restaurantList.results.forEach((data) => {
    Restaurant.create({ ...data });
  });
  console.log("done");
});
