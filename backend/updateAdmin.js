require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const user = await User.findOne({ role: 'admin' });
    if (user) {
      user.email = 'whowhat619@gmail.com';
      user.password = 'Admin@1234'; 
      await user.save();
      console.log('✅ Admin updated to whowhat619@gmail.com');
    } else {
      await User.create({ name: 'ByteBrainiacs Admin', email: 'whowhat619@gmail.com', password: 'Admin@1234', role: 'admin' });
      console.log('✅ Admin created!');
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
});
