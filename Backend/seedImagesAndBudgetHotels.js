const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hotel = require('./models/Hotel');

dotenv.config();

const unsplashIds = [
  '1566073771259-6a8506099945',
  '1582719478250-c89fae42360b',
  '1520250497591-112f2f40a3f4',
  '1496417263034-38ec4f0b665a',
  '1551882547-ff40c0d12c5b',
  '1517840901100-8179e982acb7',
  '1571003123894-1f0594d2b5d9',
  '1542314831-c6a4d27ce6a2',
  '1505691938895-1758d7bef511',
  '1596394516093-501ba68a0ba6',
  '1455587734955-081b22074882',
  '1561501900-3701fa6a0864',
  '1445019980597-93fa8acb246c',
  '1587985826114-f59ef4322d84',
  '1590490360182-c33d57733427',
  '1564501049412-61c2a3083791'
];

function getImageUrl(index) {
  const id = unsplashIds[index % unsplashIds.length];
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;
}

// Generate some extra images for the gallery
function getGalleryUrls(index) {
  return [
    getImageUrl(index + 3),
    getImageUrl(index + 5),
    getImageUrl(index + 7)
  ];
}

const budgetHotels = [
  { name: 'Hotel Saravana Bhavan', location: 'Chennai, Tamil Nadu', price: 2100 },
  { name: 'Treebo Trend Residency', location: 'Pune, Maharashtra', price: 2200 },
  { name: 'FabHotel Prime Majestic', location: 'New Delhi', price: 2500 },
  { name: 'Opal Inn Suites', location: 'Bengaluru, Karnataka', price: 2350 },
  { name: 'The Golden Crest', location: 'Jaipur, Rajasthan', price: 2000 },
  { name: 'Ginger Hotel', location: 'Ahmedabad, Gujarat', price: 2400 },
  { name: 'Lemon Tree Premier', location: 'Hyderabad, Telangana', price: 2500 },
  { name: 'ibis City Centre', location: 'Kochi, Kerala', price: 2150 }
].map((hotel, i) => ({
  ...hotel,
  image: getImageUrl(i + 20), // Offset to get different images
  gallery: getGalleryUrls(i + 20)
}));

const seed = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is not defined in .env');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // 1. Backfill existing hotels with varied images
    const existingHotels = await Hotel.find({ image: { $exists: false } });
    if (existingHotels.length === 0) {
        // Also check if they just have empty string
        const emptyImageHotels = await Hotel.find({ image: '' });
        existingHotels.push(...emptyImageHotels);
    }
    
    // Also grab ones that might be completely missing the field
    const emptyFieldHotels = await Hotel.find({ image: { $exists: true, $in: ["", null] }});
    
    // We will just process all hotels to ensure they all get fresh different images
    const allHotels = await Hotel.find({});
    
    for (let i = 0; i < allHotels.length; i++) {
      const h = allHotels[i];
      h.image = getImageUrl(i);
      h.gallery = getGalleryUrls(i);
      await h.save();
    }
    console.log(`Successfully backfilled images for ${allHotels.length} existing hotels.`);

    // 2. Inject Budget Hotels
    await Hotel.insertMany(budgetHotels);
    console.log('Successfully seeded 8 budget-friendly Indian Hotels (₹2000-₹2500) with images!');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
