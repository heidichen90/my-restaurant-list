module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("warning_msg", "Please login before you proceed.");
    res.redirect("/users/login");
  },
};
