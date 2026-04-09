const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' }); // Ensure dotenv is pointing correctly depending on where it's executed
const Hotel = require('../models/Hotel');

async function purgeDatabase() {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error("MONGO_URI not found in environment variables");
    }
    
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoURI);
    
    console.log("Purging all legacy hotels...");
    const result = await Hotel.deleteMany({});
    
    console.log(`Successfully deleted ${result.deletedCount} legacy generic hotels.`);
    console.log("Database slate is wiped clean for Velvet Sands immersive experiences!");
  } catch (error) {
    console.error("Purge Error:", error);
  } finally {
    process.exit(0);
  }
}

purgeDatabase();
