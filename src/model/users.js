var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  uuid: String,
  email: String,
  pwd: String
}, {collection: 'users'});

module.exports = mongoose.model('UserModel', UserSchema);
