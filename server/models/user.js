// model użytkownika
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
  username: String,
  password: String,
  name: String,
  surname: String,
  gender: String,
  dateOfBirth: Date,
  practice: Number,
  growth: Number,
  weight: Number
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', User);