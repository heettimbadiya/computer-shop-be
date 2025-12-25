import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Settings from '../models/Settings.js'

dotenv.config()

const initSettings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    // Check if settings already exist
    let settings = await Settings.findOne()
    
    if (!settings) {
      // Create default settings
      settings = await Settings.create({
        currency: {
          usdToTryRate: 34.5,
          lastUpdated: new Date(),
        },
      })
      console.log('Default settings created:', settings)
    } else {
      console.log('Settings already exist:', settings)
    }

    await mongoose.connection.close()
    console.log('Settings initialization complete')
    process.exit(0)
  } catch (error) {
    console.error('Error initializing settings:', error)
    process.exit(1)
  }
}

initSettings()

