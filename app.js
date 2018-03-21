var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var flash = require("connect-flash");
var morgan = require("morgan");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var multer = require("multer");
var mongo = require("mongodb");

var configDB = require("./config/database.js");

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

//require('./config/passport')(passport); // pass passport for configuration

var index = require("./routes/index");
var admin = require("./routes/admin");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//app.use(multer({dest:'./uploads'}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "thesessionsecretxyz",
    saveUninitialized: true,
    resave: true
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use("/", index);
app.use("/admin", admin);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});
app.use(function(req,res,next){
    console.log(req.user)
    next()
})
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), function() {
  console.log(`listening @ ${app.get('port')}`);
});

module.exports = app;
