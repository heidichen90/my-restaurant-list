//require packages used in the project
const { request } = require("express");
const restaurantList = require("./restaurant.json");
const Restaurant = require("./models/restaurants");
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

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
});

//express template engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//setup static files
app.use(express.static("public"));

//setup body-parser
app.use(express.urlencoded({ extended: true }));

//routes setting
app.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurants) => {
      res.render("index", { restaurants });
    })
    .catch((error) => console.log(error));
});

//add new restaurant page
app.get("/restaurants/new", (req, res) => {
  res.render("new");
});

app.post("/restaurants", (req, res) => {
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
app.get("/restaurants/:id", (req, res) => {
  const restaurantId = req.params.id;
  return Restaurant.findById(restaurantId)
    .lean()
    .then((restaurant) => {
      res.render("show", { restaurant });
    });
});

//edit one restaurant
app.get("/restaurants/:id/edit", (req, res) => {
  const restaurantId = req.params.id;
  return Restaurant.findById(restaurantId)
    .lean()
    .then((restaurant) => {
      res.render("edit", { restaurant });
    });
});

app.post("/restaurants/:id/edit", (req, res) => {
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

app.get("/search", (req, res) => {
  const keyword = req.query.keyword;
  const restaurants = restaurantList.results.filter(
    (ele) =>
      ele.name.toLowerCase().includes(keyword) ||
      ele.name_en.toLowerCase().includes(keyword)
  );
  res.render("index", { restaurants, keyword });
});

//start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
