const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const methodOverride = require("method-override");
const routes = require("./routes");
require("./config/mongoose");

const usePassport = require("./config/passport");

const app = express();
const port = 3000;

// express template engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// setup session
app.use(
  session({
    secret: "ThisIsMySecret",
    resave: false,
    saveUnintialized: true,
  })
);

// setup static files
app.use(express.static("public"));

// setup body-parser
app.use(express.urlencoded({ extended: true }));

// set up method override
// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

usePassport(app);

// set up router
app.use(routes);

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
