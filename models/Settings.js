import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  currency: {
    usdToTryRate: {
      type: Number,
      default: 34.5,
      min: 0.01,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
}, {
  timestamps: true,
})

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne()
  if (!settings) {
    settings = await this.create({})
  }
  return settings
}

export default mongoose.model('Settings', settingsSchema)

