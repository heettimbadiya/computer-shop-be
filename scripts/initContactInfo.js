import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ContactInfo from '../models/ContactInfo.js';

dotenv.config();

const initContactInfo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if contact info already exists
    const existing = await ContactInfo.findOne();
    
    if (!existing) {
      // Create default contact info
      const contactInfo = new ContactInfo({
        workerPhone: '+90 551 894 00 69',
        instagramUrl: 'https://www.instagram.com/xpanbilgisayar',
      });
      
      await contactInfo.save();
      console.log('Contact information initialized successfully');
      console.log('Worker Phone:', contactInfo.workerPhone);
      console.log('Instagram URL:', contactInfo.instagramUrl);
    } else {
      console.log('Contact information already exists');
      console.log('Worker Phone:', existing.workerPhone);
      console.log('Instagram URL:', existing.instagramUrl);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error initializing contact info:', error);
    process.exit(1);
  }
};

initContactInfo();

