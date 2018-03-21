var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

// define the schema for our user model
var userSchema = mongoose.Schema({
  username: String,
  password: String
});
// create the model for users and expose it to our app
const User = module.exports = mongoose.model("User", userSchema);
module.exports = User;

module.exports.createUser = function(user, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      // Store hash in your password DB.
      user.password = hash;
      user.save(callback);
    });
  });
};
module.exports.comparePassword = function(password, hash, callback) {
  bcrypt.compare(password, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};

module.exports.getUserByUsername = function(username, callback) {
  var query = {
    username: username
  };
  User.findOne(query, callback);
};
