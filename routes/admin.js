var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("../models/user");

var passportConfig = require("../config/passport.js");

// show the login form
router.get("/", function(req, res) {
  // render the page and pass in any flash data if it exists
  res.render("login.ejs", { message: req.flash("loginMessage") });
});

router.get("/register", function(req, res) {
  res.render("register");
});

router.post("/register", function(req, res) {
  console.log(req.body);
  var { username, password, admin } = req.body;

  var user = new User({
    username,
    password,
    admin: true
  });
  User.createUser(user, function(err, user) {
    if (err) {
      throw err;
    }
    console.log(user);
  });
  req.flash("msg", "Admin signup successful");
  res.redirect("/admin");
});

// =====================================
// LOGIN ===============================
// =====================================

passportConfig.passport();

router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/admin/dashboard",
    failureRedirect: "/admin/",
    failureFlash: true
  }),
  function(req, res) {
    res.redirect("/admin/dashboard");
  }
);

router.get("/dashboard", function(req, res) {
  res.render("admin.ejs", {
    user: req.user // get the user out of session and pass to template
  });
});
// =====================================
// LOGOUT ==============================
// =====================================
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

function isAuthenticated(req, res, next) {
  if (!req.user) {
    res.redirect("/");
  } else next();
}

module.exports = router;
