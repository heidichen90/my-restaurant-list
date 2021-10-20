const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const methodOverride = require("method-override");
const routes = require("./routes");
const flash = require("connect-flash");
require("./config/mongoose");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const usePassport = require("./config/passport");

const app = express();
const port = process.env.PORT;

// express template engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// setup session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
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

//set up passport
usePassport(app);

//set up flash
app.use(flash());

//middleware to pass in flash message
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  res.locals.error_msg = req.flash("error");
  next();
});
// set up router
app.use(routes);

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
