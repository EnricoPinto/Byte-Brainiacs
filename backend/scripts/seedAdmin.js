require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const PreviousParticipant = require('../models/PreviousParticipant');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create admin
    const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existing) {
      await User.create({
        name: process.env.ADMIN_NAME || 'ByteBrainiacs Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
      });
      console.log(`✅ Admin created: ${process.env.ADMIN_EMAIL} / ${process.env.ADMIN_PASSWORD}`);
    } else {
      console.log('ℹ️  Admin already exists.');
    }

    // Seed previous participants
    const count = await PreviousParticipant.countDocuments();
    if (count === 0) {
      await PreviousParticipant.insertMany([
        {
          year: 2024,
          teamName: 'NeuralNinjas',
          participantNames: ['Arjun Mehta', 'Priya Sharma', 'Rohit Verma'],
          college: 'Narsee Monjee College of Commerce and Economics',
          achievement: 'Winner',
          projectTitle: 'AI-Based Crop Disease Detection',
        },
        {
          year: 2024,
          teamName: 'ByteForce',
          participantNames: ['Sneha Patil', 'Karan Joshi', 'Aakash Singh'],
          college: 'Thakur College of Science and Commerce',
          achievement: 'Runner-Up',
          projectTitle: 'Sentiment Analysis for Market Prediction',
        },
        {
          year: 2024,
          teamName: 'DataDynamos',
          participantNames: ['Ishaan Gupta', 'Tanvi Shah', 'Mihir Rao'],
          college: 'SIES College of Arts, Science and Commerce',
          achievement: 'Participant',
          projectTitle: 'Smart Traffic Management using CV',
        },
        {
          year: 2023,
          teamName: 'AlgoAlpha',
          participantNames: ['Nisha Kumar', 'Dev Malhotra', 'Pooja Nair'],
          college: 'Mithibai College of Arts',
          achievement: 'Winner',
          projectTitle: 'NLP-based Resume Screener',
        },
        {
          year: 2023,
          teamName: 'CodeCraft',
          participantNames: ['Riya Desai', 'Vikram Pillai', 'Ananya Iyer'],
          college: 'Jai Hind College',
          achievement: 'Runner-Up',
          projectTitle: 'Fraud Detection System using ML',
        },
      ]);
      console.log('✅ Previous participants seeded.');
    }

    console.log('🌱 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
