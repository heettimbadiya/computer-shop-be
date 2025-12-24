import mongoose from 'mongoose';

const contactInfoSchema = new mongoose.Schema({
  workerPhone: {
    type: String,
    default: '+90 551 894 00 69',
    trim: true,
  },
  instagramUrl: {
    type: String,
    default: 'https://www.instagram.com/xpanbilgisayar',
    trim: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('ContactInfo', contactInfoSchema);

