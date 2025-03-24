const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');
  } catch (err) {
    console.error('Connection error:', err.message);
    process.exit(1);
  }
};

// Sample products data (REPLACE ... WITH ACTUAL DATA)
const products = [
  {
    name: "Espresso",
    price: 3.99,
    description: "Strong and aromatic",
    category: "hot",
    image: "espresso.jpg"
  },
  {
    name: "Iced Latte",
    price: 4.99,
    description: "Refreshing cold coffee",
    category: "cold",
    image: "iced-latte.jpg"
  }
];

// Seed function
const seedProducts = async () => {
  await connectDB();
  try {
    await Product.deleteMany();
    console.log('Existing products deleted.');
    
    await Product.insertMany(products);
    console.log('Database seeded!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedProducts();