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

// Pre-save hook to validate category exists
partSchema.pre('save', async function(next) {
  if (this.isModified('category') || this.isNew) {
    try {
      const Category = mongoose.model('Category');
      const category = await Category.findOne({ name: this.category });
      if (!category) {
        return next(new Error(`Category "${this.category}" does not exist. Please create the category first.`));
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Pre-update hook for findOneAndUpdate, findByIdAndUpdate, etc.
partSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], async function(next) {
  const update = this.getUpdate();
  let categoryValue = null;
  
  if (update) {
    // Handle both direct updates and $set operator
    if (update.category) {
      categoryValue = update.category;
    } else if (update.$set && update.$set.category) {
      categoryValue = update.$set.category;
    }
  }
  
  if (categoryValue) {
    try {
      const Category = mongoose.model('Category');
      const category = await Category.findOne({ name: categoryValue });
      if (!category) {
        return next(new Error(`Category "${categoryValue}" does not exist. Please create the category first.`));
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

export default mongoose.model('Part', partSchema);

