const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hotel = require('./models/Hotel');

dotenv.config();

const indianHotels = [
  { name: 'The Taj Mahal Palace', location: 'Mumbai, Maharashtra', price: 25000 },
  { name: 'Oberoi Udaivilas', location: 'Udaipur, Rajasthan', price: 32000 },
  { name: 'The Leela Palace', location: 'New Delhi', price: 18000 },
  { name: 'ITC Grand Chola', location: 'Chennai, Tamil Nadu', price: 15000 },
  { name: 'Taj Lake Palace', location: 'Udaipur, Rajasthan', price: 45000 },
  { name: 'Rambagh Palace', location: 'Jaipur, Rajasthan', price: 28000 },
  { name: 'Taj Exotica Resort & Spa', location: 'Goa', price: 22000 },
  { name: 'Kumarakom Lake Resort', location: 'Kumarakom, Kerala', price: 16000 },
  { name: 'Umaid Bhawan Palace', location: 'Jodhpur, Rajasthan', price: 35000 },
  { name: 'The Oberoi Amarvilas', location: 'Agra, Uttar Pradesh', price: 38000 },
  { name: 'Evolve Back', location: 'Coorg, Karnataka', price: 19000 },
  { name: 'Ananda in the Himalayas', location: 'Rishikesh, Uttarakhand', price: 26000 },
  { name: 'Taj Falaknuma Palace', location: 'Hyderabad, Telangana', price: 24000 },
  { name: 'JW Marriott Mussoorie Walnut Grove', location: 'Mussoorie, Uttarakhand', price: 17000 },
  { name: 'Wildflower Hall', location: 'Shimla, Himachal Pradesh', price: 21000 }
];

const seedHotels = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is not defined in .env');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // Convert old $ prices (which were small numbers) to INR by scaling 
    const result = await Hotel.updateMany({ price: { $lt: 1000 } }, { $mul: { price: 85 } });
    console.log(`Updated ${result.modifiedCount} legacy hotels with INR-scaled prices.`);

    await Hotel.insertMany(indianHotels);
    console.log('Successfully seeded 15 luxurious Indian Hotels!');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedHotels();
