// backend/scripts/seedData.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Models
const User = require('../models/User');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const Table = require('../models/Table');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await MenuItem.deleteMany({});
    await Table.deleteMany({});

    // Create admin user
    const adminUser = new User({
      name: 'Amrit Raj',
      email: 'admin@temizrestaurant.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin user created');

    // Create categories
    const categories = await Category.insertMany([
      { name: 'Starters', color: 'bg-red-500', displayOrder: 1 },
      { name: 'Main Course', color: 'bg-purple-500', displayOrder: 2 },
      { name: 'Beverages', color: 'bg-pink-600', displayOrder: 3 },
      { name: 'Soups', color: 'bg-yellow-600', displayOrder: 4 },
      { name: 'Desserts', color: 'bg-blue-900', displayOrder: 5 },
      { name: 'Pizzas', color: 'bg-green-700', displayOrder: 6 }
    ]);
    console.log('Categories created');

    // Create menu items
    const menuItems = await MenuItem.insertMany([
      {
        title: 'Paneer Tikka',
        description: 'Grilled cottage cheese with spices',
        price: 250,
        category: categories[0]._id,
        preparationTime: 15,
        ingredients: ['Paneer', 'Yogurt', 'Spices', 'Bell Peppers'],
        spicyLevel: 'medium'
      },
      {
        title: 'Chicken Tikka',
        description: 'Grilled chicken chunks with Indian spices',
        price: 300,
        category: categories[0]._id,
        preparationTime: 20,
        ingredients: ['Chicken', 'Yogurt', 'Spices'],
        spicyLevel: 'medium'
      },
      {
        title: 'Butter Chicken',
        description: 'Chicken in rich tomato and butter gravy',
        price: 380,
        category: categories[1]._id,
        preparationTime: 25,
        ingredients: ['Chicken', 'Tomato', 'Butter', 'Cream', 'Spices'],
        spicyLevel: 'mild'
      },
      {
        title: 'Palak Paneer',
        description: 'Cottage cheese in spinach gravy',
        price: 320,
        category: categories[1]._id,
        preparationTime: 20,
        ingredients: ['Paneer', 'Spinach', 'Spices'],
        spicyLevel: 'mild'
      },
      {
        title: 'Coca Cola',
        description: '330ml can',
        price: 50,
        category: categories[2]._id,
        preparationTime: 2
      },
      {
        title: 'Mango Lassi',
        description: 'Refreshing yogurt drink with mango',
        price: 120,
        category: categories[2]._id,
        preparationTime: 5,
        ingredients: ['Yogurt', 'Mango', 'Sugar']
      }
    ]);
    console.log('Menu items created');

    // Create tables
    const tables = [];
    for (let i = 1; i <= 15; i++) {
      tables.push({
        number: i,
        capacity: i % 3 === 0 ? 2 : i % 3 === 1 ? 4 : 6,
        location: i <= 5 ? 'main-hall' : i <= 10 ? 'terrace' : 'private-room',
        status: 'available'
      });
    }
    await Table.insertMany(tables);
    console.log('Tables created');

    console.log('Database seeded successfully!');
    console.log('Admin Login: admin@temizrestaurant.com / admin123');
    
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

seedData();