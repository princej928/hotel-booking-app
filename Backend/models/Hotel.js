const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  gallery: [{ type: String }]
});

module.exports = mongoose.model('Hotel', hotelSchema);
