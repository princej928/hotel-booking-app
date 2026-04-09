const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Hotel = require('./models/Hotel');

const coorgHotel = {
  displayIndex: 6,
  emoji: '🍃',
  name: 'Evolve Back',
  location: 'Coorg, Karnataka',
  price: 38000,
  image: 'https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?auto=format&fit=crop&w=1200&q=80',
  gallery: [
    'https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80',
    'foo', 'bar', 'baz', 'qux'
  ],
  experienceType: 'Eco-Retreat',
  isEcoFriendly: true,
  experienceBullets: [
    'Immersive plantation nature stay',
    'Luxury eco-villas with private pools'
  ],
  activityBullets: [
    'Coffee plantation tasting',
    'Guided bird watching walk'
  ],
  tourBullets: [
    'Dubare Elephant Camp visit',
    'Abbey Falls guided trek'
  ]
};

async function addHotel() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // check if it already exists
    const exists = await Hotel.findOne({ name: 'Evolve Back' });
    if (!exists) {
      await Hotel.create(coorgHotel);
      console.log("Successfully added Evolve Back, Coorg to the Velvet Sands collection!");
    } else {
      console.log("Evolve Back is already in the database.");
    }
  } catch (err) {
    console.error("Seeding Error:", err);
  } finally {
    process.exit();
  }
}

addHotel();
