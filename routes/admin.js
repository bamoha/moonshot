var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require("../models/user")


// passport/login.js
passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) { 
    // check in mongo if a user with username exists or not
    User.findOne({ 'username' :  username }, 
      function(err, user) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('User Not Found with username '+username);
          return done(null, false, 
                req.flash('message', 'User Not found.'));                 
        }
        // User exists but wrong password, log the error 
        if (!isValidPassword(user, password)){
          console.log('Invalid Password');
          return done(null, false, 
              req.flash('message', 'Invalid Password'));
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user);
      }
    );
}));

// show the login form
router.get('/', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') }); 
});
// =====================================
// LOGIN ===============================
// =====================================

// process the login form
router.post('/', passport.authenticate('login', {
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/admin', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

router.get('/dashboard', function(req, res) {
        res.render('admin.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });
// =====================================
    // LOGOUT ==============================
    // =====================================
router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

module.exports = router;
