const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ShapeSchema = new Schema({
  shapeType: {
    type: String,
    enum: ['circle', 'square', 'triangle']
  },
  color: {
    type: String,
    enum: ['red', 'green', 'blue']
  },
  views: {
    type: Number,
    default: 0
  },
  imageLink: {
    type: String
  }
});

// ensure unique combinations of shape and color
ShapeSchema.index({shapeType:1, color:1}, { unique: true });

module.exports = mongoose.model('Shape', ShapeSchema);