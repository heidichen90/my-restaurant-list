//require packages
// const Restaurant = require("./models/restaurants");
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const routes = require("./routes");

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

//set up method override
// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

//set up router
app.use(routes);

//start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
