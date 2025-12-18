import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Part from '../models/Part.js';

dotenv.config();

const parts = [
  // CPUs
  {
    name: 'AMD Ryzen 9 5900X',
    category: 'CPU',
    price: 549,
    stock: 10,
    compatibility: {
      socket: 'AM4',
      powerConsumption: 105,
    },
    description: '12-core, 24-thread processor',
  },
  {
    name: 'Intel Core i7-13700K',
    category: 'CPU',
    price: 419,
    stock: 15,
    compatibility: {
      socket: 'LGA1700',
      powerConsumption: 125,
    },
    description: '16-core, 24-thread processor',
  },
  {
    name: 'AMD Ryzen 5 5600X',
    category: 'CPU',
    price: 299,
    stock: 20,
    compatibility: {
      socket: 'AM4',
      powerConsumption: 65,
    },
    description: '6-core, 12-thread processor',
  },
  {
    name: 'Intel Core i5-13600K',
    category: 'CPU',
    price: 319,
    stock: 18,
    compatibility: {
      socket: 'LGA1700',
      powerConsumption: 125,
    },
    description: '14-core, 20-thread processor',
  },

  // Motherboards
  {
    name: 'ASUS ROG Strix B550-F Gaming',
    category: 'Motherboard',
    price: 199,
    stock: 12,
    compatibility: {
      supportedSocket: 'AM4',
      supportedRamType: 'DDR4',
      formFactor: 'ATX',
    },
    description: 'AMD B550 ATX motherboard',
  },
  {
    name: 'MSI MAG B550M Mortar',
    category: 'Motherboard',
    price: 159,
    stock: 15,
    compatibility: {
      supportedSocket: 'AM4',
      supportedRamType: 'DDR4',
      formFactor: 'mATX',
    },
    description: 'AMD B550 mATX motherboard',
  },
  {
    name: 'ASUS ROG Strix Z790-E Gaming',
    category: 'Motherboard',
    price: 449,
    stock: 8,
    compatibility: {
      supportedSocket: 'LGA1700',
      supportedRamType: 'DDR5',
      formFactor: 'ATX',
    },
    description: 'Intel Z790 ATX motherboard',
  },
  {
    name: 'Gigabyte B760M DS3H',
    category: 'Motherboard',
    price: 129,
    stock: 20,
    compatibility: {
      supportedSocket: 'LGA1700',
      supportedRamType: 'DDR4',
      formFactor: 'mATX',
    },
    description: 'Intel B760 mATX motherboard',
  },

  // RAM
  {
    name: 'Corsair Vengeance LPX 16GB DDR4 3200MHz',
    category: 'RAM',
    price: 69,
    stock: 30,
    compatibility: {
      ddrVersion: 'DDR4',
    },
    description: '16GB (2x8GB) DDR4 memory kit',
  },
  {
    name: 'G.Skill Trident Z5 32GB DDR5 6000MHz',
    category: 'RAM',
    price: 149,
    stock: 25,
    compatibility: {
      ddrVersion: 'DDR5',
    },
    description: '32GB (2x16GB) DDR5 memory kit',
  },
  {
    name: 'Kingston Fury Beast 32GB DDR4 3200MHz',
    category: 'RAM',
    price: 99,
    stock: 28,
    compatibility: {
      ddrVersion: 'DDR4',
    },
    description: '32GB (2x16GB) DDR4 memory kit',
  },
  {
    name: 'Corsair Dominator Platinum 64GB DDR5 5600MHz',
    category: 'RAM',
    price: 299,
    stock: 15,
    compatibility: {
      ddrVersion: 'DDR5',
    },
    description: '64GB (2x32GB) DDR5 memory kit',
  },

  // Storage
  {
    name: 'Samsung 980 PRO 1TB NVMe SSD',
    category: 'Storage',
    price: 129,
    stock: 40,
    compatibility: {
      interface: 'NVMe',
    },
    description: '1TB PCIe 4.0 NVMe SSD',
  },
  {
    name: 'WD Black SN850X 2TB NVMe SSD',
    category: 'Storage',
    price: 199,
    stock: 35,
    compatibility: {
      interface: 'NVMe',
    },
    description: '2TB PCIe 4.0 NVMe SSD',
  },
  {
    name: 'Crucial MX4 1TB SATA SSD',
    category: 'Storage',
    price: 79,
    stock: 45,
    compatibility: {
      interface: 'SATA',
    },
    description: '1TB SATA 3.0 SSD',
  },
  {
    name: 'Seagate Barracuda 2TB HDD',
    category: 'Storage',
    price: 59,
    stock: 50,
    compatibility: {
      interface: 'SATA',
    },
    description: '2TB 7200RPM HDD',
  },

  // GPUs
  {
    name: 'NVIDIA GeForce RTX 4080',
    category: 'GPU',
    price: 1199,
    stock: 5,
    compatibility: {
      powerConsumption: 320,
    },
    description: '16GB GDDR6X graphics card',
  },
  {
    name: 'NVIDIA GeForce RTX 4070',
    category: 'GPU',
    price: 599,
    stock: 12,
    compatibility: {
      powerConsumption: 200,
    },
    description: '12GB GDDR6X graphics card',
  },
  {
    name: 'AMD Radeon RX 7800 XT',
    category: 'GPU',
    price: 549,
    stock: 10,
    compatibility: {
      powerConsumption: 263,
    },
    description: '16GB GDDR6 graphics card',
  },
  {
    name: 'NVIDIA GeForce RTX 4060',
    category: 'GPU',
    price: 299,
    stock: 20,
    compatibility: {
      powerConsumption: 115,
    },
    description: '8GB GDDR6 graphics card',
  },

  // Power Supplies
  {
    name: 'Corsair RM850x 850W 80+ Gold',
    category: 'Power Supply',
    price: 149,
    stock: 25,
    compatibility: {
      wattage: 850,
    },
    description: '850W fully modular PSU',
  },
  {
    name: 'Seasonic Focus GX-750 750W 80+ Gold',
    category: 'Power Supply',
    price: 119,
    stock: 30,
    compatibility: {
      wattage: 750,
    },
    description: '750W fully modular PSU',
  },
  {
    name: 'EVGA SuperNOVA 1000W 80+ Gold',
    category: 'Power Supply',
    price: 199,
    stock: 15,
    compatibility: {
      wattage: 1000,
    },
    description: '1000W fully modular PSU',
  },
  {
    name: 'Corsair CX650M 650W 80+ Bronze',
    category: 'Power Supply',
    price: 79,
    stock: 35,
    compatibility: {
      wattage: 650,
    },
    description: '650W semi-modular PSU',
  },

  // Cabinets
  {
    name: 'Fractal Design Meshify C',
    category: 'Cabinet',
    price: 99,
    stock: 20,
    compatibility: {
      supportedFormFactors: ['ATX', 'mATX', 'ITX'],
    },
    description: 'Mid-tower case with excellent airflow',
  },
  {
    name: 'NZXT H510 Flow',
    category: 'Cabinet',
    price: 89,
    stock: 25,
    compatibility: {
      supportedFormFactors: ['ATX', 'mATX', 'ITX'],
    },
    description: 'Mid-tower case with mesh front panel',
  },
  {
    name: 'Cooler Master MasterBox Q300L',
    category: 'Cabinet',
    price: 49,
    stock: 30,
    compatibility: {
      supportedFormFactors: ['mATX', 'ITX'],
    },
    description: 'Compact mATX case',
  },
  {
    name: 'Lian Li O11 Dynamic',
    category: 'Cabinet',
    price: 149,
    stock: 15,
    compatibility: {
      supportedFormFactors: ['ATX', 'mATX', 'ITX', 'E-ATX'],
    },
    description: 'Premium mid-tower case with glass panels',
  },
];

async function seedParts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing parts
    await Part.deleteMany({});
    console.log('Cleared existing parts');

    // Insert new parts
    await Part.insertMany(parts);
    console.log(`Seeded ${parts.length} parts successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding parts:', error);
    process.exit(1);
  }
}

seedParts();

