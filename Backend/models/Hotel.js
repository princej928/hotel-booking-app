// hotel schema of like how the hotel part looks like 
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
  displayIndex: { type: Number, default: 1 },
  emoji: { type: String, default: '🏨' },
  experienceBullets: [{ type: String }],
  activityBullets: [{ type: String }],
  tourBullets: [{ type: String }]
});

module.exports = mongoose.model('Hotel', hotelSchema);
