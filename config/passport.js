const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/users");
const bcrypt = require("bcryptjs");

module.exports = (app) => {
  //passport setup
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    //Local Strategy
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          console.log(user);
          if (!user) {
            console.log(">>");
            return done(null, false, {
              message: "This email is not registered.",
            });
          }
          return bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) {
              return done(null, false, {
                message: "Email or Password incorrect.",
              });
            }
            return done(null, user);
          });
        })
        .catch((err) => done(err, false));
    })
  );

  console.log("facebook strategy");
  //Facebook strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ["email", "displayName"],
      },
      (accessToken, refreshToken, profile, done) => {
        console.log(profile._json);
        const { email, name } = profile._json;
        User.findOne({ email }).then((user) => {
          if (user) {
            return done(null, user);
          }
          //if user dont exist, create random password and create a user in our database
          const randomPassword = Math.random().toString(36).slice(-8);
          bcrypt
            .genSalt(10)
            .then((salt) => bcrypt.hash(randomPassword, salt))
            .then((hash) => {
              User.create({
                name,
                email,
                password: hash,
              });
            })
            .then((user) => done(null, user))
            .catch((err) => done(err, false));
        });
      }
    )
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
