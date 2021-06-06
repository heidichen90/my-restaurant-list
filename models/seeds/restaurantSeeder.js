const mongoose = require("mongoose");
const Restaurant = require("../restaurants");
const restaurantList = require("../../restaurant.json");

//set up db connection
mongoose.connect("mongodb://localhost/restaurant-list", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

//get db connection detail
const db = mongoose.connection;

db.on("error", () => {
  console.log("fail to connect to mongo db!");
});

db.once("open", () => {
  console.log("connected to mongo db!");
  restaurantList.results.forEach((data) => {
    Restaurant.create({ ...data });
  });
  console.log("done");
});
