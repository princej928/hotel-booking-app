require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Hotel = require('./models/Hotel');

async function updateImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    // Update Umaid Bhawan
    await Hotel.updateOne(
      { name: 'Umaid Bhawan Palace' },
      {
        $set: {
          image: '/images/umaid-1.webp',
          gallery: [
            '/images/umaid-2.jpeg',
            '/images/umaid-3.jpeg'
          ]
        }
      }
    );

    // Update Marari Resort
    await Hotel.updateOne(
      { name: 'CGH Earth Marari Beach Resort' },
      {
        $set: {
          image: '/images/marari-1.avif',
          gallery: [
            '/images/marari-2.jpg',
            '/images/marari-3.jpeg'
          ]
        }
      }
    );

    console.log("Successfully securely injected the real uploaded images into the database!");
  } catch (err) {
    console.error("Database update error:", err);
  } finally {
    process.exit();
  }
}

updateImages();
