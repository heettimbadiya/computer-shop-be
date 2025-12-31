import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';

dotenv.config();

const DEFAULT_CATEGORIES = [
  'CPU',
  'Motherboard',
  'RAM',
  'Storage',
  'GPU',
  'Power Supply',
  'Cabinet',
];

const initCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create default categories
    for (const categoryName of DEFAULT_CATEGORIES) {
      const existingCategory = await Category.findOne({ name: categoryName });
      
      if (!existingCategory) {
        const category = await Category.create({
          name: categoryName,
          isDefault: true,
        });
        console.log(`Created default category: ${category.name}`);
      } else {
        // Update existing category to mark as default if not already
        if (!existingCategory.isDefault) {
          existingCategory.isDefault = true;
          await existingCategory.save();
          console.log(`Updated category ${existingCategory.name} to default`);
        } else {
          console.log(`Category ${categoryName} already exists as default`);
        }
      }
    }

    await mongoose.connection.close();
    console.log('Categories initialization complete');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing categories:', error);
    process.exit(1);
  }
};

initCategories();

