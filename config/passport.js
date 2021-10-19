const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

module.exports = (app) => {
  //passport setup
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    //Local Strategy
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: "This email is not registered.",
            });
          }
          if (user.password !== password) {
            return done(null, false, {
              message: "Email or Password incorrect.",
            });
          }

          return done(null, user);
        })
        .catch((err) => done(err, false));
    })
  );

  //Session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  });
};
