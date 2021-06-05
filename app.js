//require packages used in the project
const { request } = require("express");
const restaurantList = require("./restaurant.json");
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

//set up db connection
mongoose.connect("mongodb://localhost/restaurant-list");

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

//routes setting
app.get("/", (req, res) => {
  res.render("index", { restaurants: restaurantList.results });
});

app.get("/restaurants/:id", (req, res) => {
  const restaurantId = req.params.id;
  const restaurant = restaurantList.results.find(
    (ele) => ele.id.toString() === restaurantId
  );
  res.render("show", { restaurant });
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
