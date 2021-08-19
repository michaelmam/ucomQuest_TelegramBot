const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  startDescription: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
}, {
  versionKey: false,
  timestamps: true,
});

module.exports = mongoose.model('Locations', locationSchema);