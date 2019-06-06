var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogSchema = new Schema({
  origin: { type: String, required: true },
  target: { type: String, required: true },
  targetStatus: { type: Number, required: true }
}, { timestamps: true, collection: 'logs' });

module.exports = mongoose.model('LogModel', LogSchema);
