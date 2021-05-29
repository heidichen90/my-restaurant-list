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

// app.get("/movies/:movie_id", (req, res) => {
//   const targetMovie = movieList.results.find(
//     (movie) => movie.id.toString() === req.params.movie_id
//   );
//   res.render("show", { movie: targetMovie });
// });

// app.get("/search", (req, res) => {
//   const keyword = req.query.keyword;
//   movies = movieList.results.filter((movie) =>
//     movie.title.toLowerCase().includes(keyword.toLowerCase())
//   );
//   res.render("index", { movies, keyword });
// });

//start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
