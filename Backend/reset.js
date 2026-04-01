require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await User.deleteMany({});
  console.log('Database Users wiped. Register your admin account now!');
  process.exit();
}).catch(console.error);
