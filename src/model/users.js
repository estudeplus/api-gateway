var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  uuid: String,
  email: String,
  pwd: String
});

module.exports = mongoose.model('UserModel', UserSchema);
