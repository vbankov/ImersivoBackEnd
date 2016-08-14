const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StatsSchema = new Schema({
  colorSorts: {
    type: Number,
    default: 0
  },
  shapeSorts: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Stats', StatsSchema);