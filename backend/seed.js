// Run with: node seed.js
// Populates sample menu items and one admin user for testing.
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');

dotenv.config();

const sampleItems = [
  {
    name: 'Margherita Pizza',
    description: 'Classic cheese and tomato pizza',
    price: 249,
    category: 'Pizza',
    image: '',
  },
  {
    name: 'Farmhouse Pizza',
    description: 'Loaded with veggies and cheese',
    price: 299,
    category: 'Pizza',
    image: '',
  },
  {
    name: 'Veg Burger',
    description: 'Crispy patty with lettuce and mayo',
    price: 129,
    category: 'Burger',
    image: '',
  },
  {
    name: 'Chicken Burger',
    description: 'Grilled chicken patty with special sauce',
    price: 159,
    category: 'Burger',
    image: '',
  },
  {
    name: 'Coke',
    description: '500ml chilled soft drink',
    price: 49,
    category: 'Drinks',
    image: '',
  },
  {
    name: 'Chocolate Shake',
    description: 'Thick chocolate milkshake',
    price: 99,
    category: 'Drinks',
    image: '',
  },
];

const seed = async () => {
  await connectDB();

  await MenuItem.deleteMany();
  await MenuItem.insertMany(sampleItems);
  console.log('Sample menu items added');

  const adminExists = await User.findOne({ email: 'admin@foodapp.com' });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@foodapp.com',
      password: hashedPassword,
      role: 'admin',
    });
    console.log('Admin user created: admin@foodapp.com / admin123');
  } else {
    console.log('Admin user already exists');
  }

  console.log('Seeding complete');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
