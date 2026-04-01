require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await User.updateMany({}, { isAdmin: true });
  console.log('All existing users promoted to Admin successfully!');
  process.exit();
}).catch(console.error);
