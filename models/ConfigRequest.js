import mongoose from 'mongoose';

const configRequestSchema = new mongoose.Schema({
  selectedParts: {
    CPU: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Part',
      default: null,
    },
    Motherboard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Part',
      default: null,
    },
    RAM: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Part',
      default: null,
    },
    Storage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Part',
      default: null,
    },
    GPU: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Part',
      default: null,
    },
    'Power Supply': {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Part',
      default: null,
    },
    Cabinet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Part',
      default: null,
    },
  },
  estimatedPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  customerName: {
    type: String,
    default: '',
  },
  customerEmail: {
    type: String,
    default: '',
  },
  customerPhone: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'completed'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

export default mongoose.model('ConfigRequest', configRequestSchema);

