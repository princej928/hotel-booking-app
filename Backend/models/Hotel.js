const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  gallery: [{ type: String }],
  // Velvet Sands specific experiential fields
  experienceType: { 
    type: String, 
    enum: ['Heritage', 'Adventure', 'Eco-Retreat', 'Luxury', 'Wellness', 'Standard'],
    default: 'Standard' 
  },
  isEcoFriendly: { type: Boolean, default: false },
  curatedExperiences: [{ type: String }]
});

module.exports = mongoose.model('Hotel', hotelSchema);
