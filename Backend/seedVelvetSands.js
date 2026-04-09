const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Hotel = require('./models/Hotel');

const velvetSandsData = [
  {
    displayIndex: 1,
    emoji: '🏰',
    name: 'Umaid Bhawan Palace',
    location: 'Jodhpur, Rajasthan',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7bef511?auto=format&fit=crop&w=800&q=80',
      'foo', 'bar', 'baz'
    ],
    experienceType: 'Heritage',
    isEcoFriendly: false,
    experienceBullets: [
      'Live like royalty in a real palace',
      'Vintage car rides inside palace grounds'
    ],
    activityBullets: [
      'Royal dinner with traditional Rajasthani music',
      'Palace museum tour'
    ],
    tourBullets: [
      'Mehrangarh Fort guided visit',
      'Blue City walking tour'
    ]
  },
  {
    displayIndex: 2,
    emoji: '🌊',
    name: 'CGH Earth Marari Beach Resort',
    location: 'Mararikulam, Kerala',
    price: 18500,
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89fae42360b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
      'dummy', 'dummy', 'dummy', 'dummy'
    ],
    experienceType: 'Eco-Retreat',
    isEcoFriendly: true,
    experienceBullets: [
      'Eco-friendly beachside stay',
      'Farm-to-table dining'
    ],
    activityBullets: [
      'Coconut tree climbing demo',
      'Ayurvedic spa sessions'
    ],
    tourBullets: [
      'Backwater canoe ride',
      'Village life experience tour'
    ]
  },
  {
    displayIndex: 3,
    emoji: '🏔️',
    name: 'The Himalayan',
    location: 'Manali, Himachal Pradesh',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?auto=format&fit=crop&w=800&q=80',
      'placeholder', 'placeholder', 'placeholder', 'placeholder'
    ],
    experienceType: 'Adventure',
    isEcoFriendly: false,
    experienceBullets: [
      'Stay in a castle-style hotel in snow',
      'Cozy fireplace rooms'
    ],
    activityBullets: [
      'Bonfire nights',
      'Snow trekking'
    ],
    tourBullets: [
      'Solang Valley adventure trip',
      'Rohtang Pass excursion'
    ]
  },
  {
    displayIndex: 4,
    emoji: '🌆',
    name: 'The Imperial',
    location: 'New Delhi',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1584132967334-10e028b0304a?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584132967334-10e028b0304a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      '1', '2', '3', '4'
    ],
    experienceType: 'Heritage',
    isEcoFriendly: false,
    experienceBullets: [
      'Colonial luxury stay with history',
      'Art gallery inside hotel'
    ],
    activityBullets: [
      'Fine dining experience',
      'Heritage storytelling sessions'
    ],
    tourBullets: [
      'Old Delhi food walk',
      'India Gate & Connaught Place tour'
    ]
  },
  {
    displayIndex: 5,
    emoji: '🏝️',
    name: 'Taj Exotica Resort & Spa',
    location: 'Benaulim, Goa',
    price: 31000,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1538332576228-eb5b4c4de8f5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ec8f5d0?auto=format&fit=crop&w=800&q=80',
      's', 's', 's'
    ],
    experienceType: 'Luxury',
    isEcoFriendly: false,
    experienceBullets: [
      'Private beach luxury stay',
      'Sunset dining by the sea'
    ],
    activityBullets: [
      'Water sports',
      'Yoga by the beach'
    ],
    tourBullets: [
      'Dolphin watching',
      'Old Goa church tour'
    ]
  }
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");
    
    // Purge securely first
    await Hotel.deleteMany({});
    console.log("Wiped old hotels just in case.");
    
    // Insert new Velvet Sands logic
    await Hotel.insertMany(velvetSandsData);
    console.log(`Successfully seeded ${velvetSandsData.length} Velvet Sands experiences!`);
    
  } catch (err) {
    console.error("Seeding Error:", err);
  } finally {
    process.exit();
  }
}

seedData();
