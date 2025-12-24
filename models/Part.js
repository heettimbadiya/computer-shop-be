import mongoose from 'mongoose';

const partSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['CPU', 'Motherboard', 'RAM', 'Storage', 'GPU', 'Power Supply', 'Cabinet'],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  isSecondHand: {
    type: Boolean,
    default: false,
  },
  // Compatibility rules
  compatibility: {
    // For CPU: socket type (e.g., "AM4", "LGA1700")
    socket: {
      type: String,
      default: null,
    },
    // For Motherboard: socket type it supports
    supportedSocket: {
      type: String,
      default: null,
    },
    // For RAM: DDR version (e.g., "DDR4", "DDR5")
    ddrVersion: {
      type: String,
      default: null,
    },
    // For Motherboard: supported RAM type
    supportedRamType: {
      type: String,
      default: null,
    },
    // For Motherboard: form factor (e.g., "ATX", "mATX", "ITX")
    formFactor: {
      type: String,
      default: null,
    },
    // For Cabinet: supported form factors
    supportedFormFactors: {
      type: [String],
      default: [],
    },
    // For Power Supply: wattage
    wattage: {
      type: Number,
      default: null,
    },
    // For GPU: power consumption (watts)
    powerConsumption: {
      type: Number,
      default: null,
    },
    // For Storage: interface (e.g., "SATA", "NVMe")
    interface: {
      type: String,
      default: null,
    },
  },
  imageUrl: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Part', partSchema);

