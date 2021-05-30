//require packages used in the project
const { request } = require("express");
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const port = 3000;
const restaurantList = require("./restaurant.json");

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
