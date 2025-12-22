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
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=500&fit=crop',
    compatibility: {
      socket: 'AM4',
      powerConsumption: 105,
    },
    description: 'The AMD Ryzen 9 5900X is a high-performance 12-core, 24-thread processor built on the Zen 3 architecture. With a base clock of 3.7GHz and boost clock up to 4.8GHz, this CPU delivers exceptional performance for gaming, content creation, and productivity tasks. Features PCIe 4.0 support and unlocked multiplier for overclocking.',
  },
  {
    name: 'Intel Core i7-13700K',
    category: 'CPU',
    price: 419,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=500&fit=crop',
    compatibility: {
      socket: 'LGA1700',
      powerConsumption: 125,
    },
    description: 'The Intel Core i7-13700K is a powerful 16-core processor (8 P-cores + 8 E-cores) with 24 threads. Built on Intel\'s 13th generation Raptor Lake architecture, it features a base clock of 3.4GHz and boost clock up to 5.4GHz. Perfect for high-end gaming and demanding workloads with excellent single and multi-threaded performance.',
  },
  {
    name: 'AMD Ryzen 5 5600X',
    category: 'CPU',
    price: 299,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=500&fit=crop',
    compatibility: {
      socket: 'AM4',
      powerConsumption: 65,
    },
    description: 'The AMD Ryzen 5 5600X is an excellent mid-range 6-core, 12-thread processor. With a base clock of 3.7GHz and boost up to 4.6GHz, it offers outstanding gaming performance and efficiency. Features PCIe 4.0 support and comes with a Wraith Stealth cooler. Great value for gamers and content creators.',
  },
  {
    name: 'Intel Core i5-13600K',
    category: 'CPU',
    price: 319,
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=500&fit=crop',
    compatibility: {
      socket: 'LGA1700',
      powerConsumption: 125,
    },
    description: 'The Intel Core i5-13600K features 14 cores (6 P-cores + 8 E-cores) and 20 threads. With a base clock of 3.5GHz and boost up to 5.1GHz, this processor delivers exceptional performance for gaming and productivity. Supports DDR4 and DDR5 memory, making it a versatile choice for budget-conscious builders.',
  },

  // Motherboards
  {
    name: 'ASUS ROG Strix B550-F Gaming',
    category: 'Motherboard',
    price: 199,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=500&h=500&fit=crop',
    compatibility: {
      supportedSocket: 'AM4',
      supportedRamType: 'DDR4',
      formFactor: 'ATX',
    },
    description: 'The ASUS ROG Strix B550-F Gaming is a premium ATX motherboard designed for AMD Ryzen processors. Features PCIe 4.0 support, dual M.2 slots, USB 3.2 Gen 2, and comprehensive cooling solutions. Includes Aura Sync RGB lighting and SupremeFX audio for an immersive gaming experience.',
  },
  {
    name: 'MSI MAG B550M Mortar',
    category: 'Motherboard',
    price: 159,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=500&h=500&fit=crop',
    compatibility: {
      supportedSocket: 'AM4',
      supportedRamType: 'DDR4',
      formFactor: 'mATX',
    },
    description: 'The MSI MAG B550M Mortar is a compact micro-ATX motherboard perfect for smaller builds. Features PCIe 4.0, dual M.2 slots, and excellent VRM cooling. Supports up to 128GB DDR4 memory and includes Mystic Light RGB for customization. Great balance of features and value.',
  },
  {
    name: 'ASUS ROG Strix Z790-E Gaming',
    category: 'Motherboard',
    price: 449,
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=500&h=500&fit=crop',
    compatibility: {
      supportedSocket: 'LGA1700',
      supportedRamType: 'DDR5',
      formFactor: 'ATX',
    },
    description: 'The ASUS ROG Strix Z790-E Gaming is a flagship ATX motherboard for Intel 13th gen processors. Features PCIe 5.0 support, DDR5 memory, five M.2 slots, and premium audio. Includes comprehensive cooling, Wi-Fi 6E, and extensive RGB lighting. Built for enthusiasts and overclockers.',
  },
  {
    name: 'Gigabyte B760M DS3H',
    category: 'Motherboard',
    price: 129,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=500&h=500&fit=crop',
    compatibility: {
      supportedSocket: 'LGA1700',
      supportedRamType: 'DDR4',
      formFactor: 'mATX',
    },
    description: 'The Gigabyte B760M DS3H is an affordable micro-ATX motherboard for Intel 12th and 13th gen processors. Features PCIe 4.0, dual M.2 slots, and DDR4 support. Perfect for budget builds while maintaining essential features and reliable performance.',
  },

  // RAM
  {
    name: 'Corsair Vengeance LPX 16GB DDR4 3200MHz',
    category: 'RAM',
    price: 69,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=500&fit=crop',
    compatibility: {
      ddrVersion: 'DDR4',
    },
    description: 'Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz memory kit. Low-profile design ensures compatibility with large CPU coolers. Features XMP 2.0 support for easy overclocking and aluminum heat spreader for efficient cooling. Perfect for gaming and general computing.',
  },
  {
    name: 'G.Skill Trident Z5 32GB DDR5 6000MHz',
    category: 'RAM',
    price: 149,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=500&fit=crop',
    compatibility: {
      ddrVersion: 'DDR5',
    },
    description: 'G.Skill Trident Z5 32GB (2x16GB) DDR5 6000MHz memory kit. High-performance DDR5 memory with stunning RGB lighting. Features XMP 3.0 support and premium aluminum heat spreader. Optimized for Intel 12th and 13th gen processors. Ideal for gaming and content creation.',
  },
  {
    name: 'Kingston Fury Beast 32GB DDR4 3200MHz',
    category: 'RAM',
    price: 99,
    stock: 28,
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=500&fit=crop',
    compatibility: {
      ddrVersion: 'DDR4',
    },
    description: 'Kingston Fury Beast 32GB (2x16GB) DDR4 3200MHz memory kit. Aggressive heat spreader design with optional RGB lighting. Plug and play at 3200MHz with automatic overclocking. Compatible with Intel and AMD platforms. Great for gaming and multitasking.',
  },
  {
    name: 'Corsair Dominator Platinum 64GB DDR5 5600MHz',
    category: 'RAM',
    price: 299,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=500&fit=crop',
    compatibility: {
      ddrVersion: 'DDR5',
    },
    description: 'Corsair Dominator Platinum 64GB (2x32GB) DDR5 5600MHz memory kit. Premium memory with DHX cooling technology and customizable RGB lighting via iCUE. Features XMP 3.0 and optimized for high-performance systems. Perfect for professional workstations and enthusiasts.',
  },

  // Storage
  {
    name: 'Samsung 980 PRO 1TB NVMe SSD',
    category: 'Storage',
    price: 129,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop',
    compatibility: {
      interface: 'NVMe',
    },
    description: 'Samsung 980 PRO 1TB PCIe 4.0 NVMe M.2 SSD. Delivers read speeds up to 7,000 MB/s and write speeds up to 5,000 MB/s. Features Samsung\'s V-NAND technology and advanced controller. Perfect for gaming, content creation, and professional workloads. Includes 5-year warranty.',
  },
  {
    name: 'WD Black SN850X 2TB NVMe SSD',
    category: 'Storage',
    price: 199,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop',
    compatibility: {
      interface: 'NVMe',
    },
    description: 'WD Black SN850X 2TB PCIe 4.0 NVMe M.2 SSD. High-performance storage with read speeds up to 7,300 MB/s and write speeds up to 6,300 MB/s. Features advanced thermal management and optional RGB lighting. Ideal for gamers and content creators who need fast, reliable storage.',
  },
  {
    name: 'Crucial MX4 1TB SATA SSD',
    category: 'Storage',
    price: 79,
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop',
    compatibility: {
      interface: 'SATA',
    },
    description: 'Crucial MX4 1TB SATA 3.0 2.5-inch SSD. Reliable and affordable storage solution with read speeds up to 560 MB/s and write speeds up to 510 MB/s. Features Micron 3D NAND technology and AES 256-bit encryption. Great for upgrading older systems or as secondary storage.',
  },
  {
    name: 'Seagate Barracuda 2TB HDD',
    category: 'Storage',
    price: 59,
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop',
    compatibility: {
      interface: 'SATA',
    },
    description: 'Seagate Barracuda 2TB 7200RPM 3.5-inch HDD. High-capacity storage solution perfect for data archiving, media storage, and backup. Features 256MB cache and SATA 6Gb/s interface. Reliable and cost-effective option for bulk storage needs.',
  },

  // GPUs
  {
    name: 'NVIDIA GeForce RTX 4080',
    category: 'GPU',
    price: 1199,
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=500&fit=crop',
    compatibility: {
      powerConsumption: 320,
    },
    description: 'NVIDIA GeForce RTX 4080 with 16GB GDDR6X memory. Built on Ada Lovelace architecture with 9,728 CUDA cores. Features DLSS 3, ray tracing, and AI-powered performance. Delivers exceptional 4K gaming performance and is perfect for content creation and professional workloads. Requires 750W+ PSU.',
  },
  {
    name: 'NVIDIA GeForce RTX 4070',
    category: 'GPU',
    price: 599,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=500&fit=crop',
    compatibility: {
      powerConsumption: 200,
    },
    description: 'NVIDIA GeForce RTX 4070 with 12GB GDDR6X memory. Features 5,888 CUDA cores and DLSS 3 support. Excellent 1440p gaming performance with ray tracing capabilities. Efficient power consumption makes it ideal for mid-range builds. Requires 650W+ PSU.',
  },
  {
    name: 'AMD Radeon RX 7800 XT',
    category: 'GPU',
    price: 549,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=500&fit=crop',
    compatibility: {
      powerConsumption: 263,
    },
    description: 'AMD Radeon RX 7800 XT with 16GB GDDR6 memory. Built on RDNA 3 architecture with 3,840 stream processors. Features FidelityFX Super Resolution and excellent 1440p/4K gaming performance. Great value for high-end gaming. Requires 700W+ PSU.',
  },
  {
    name: 'NVIDIA GeForce RTX 4060',
    category: 'GPU',
    price: 299,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=500&fit=crop',
    compatibility: {
      powerConsumption: 115,
    },
    description: 'NVIDIA GeForce RTX 4060 with 8GB GDDR6 memory. Features 3,072 CUDA cores and DLSS 3 support. Perfect for 1080p and 1440p gaming with excellent efficiency. Low power consumption makes it ideal for budget builds. Requires 550W+ PSU.',
  },

  // Power Supplies
  {
    name: 'Corsair RM850x 850W 80+ Gold',
    category: 'Power Supply',
    price: 149,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500&h=500&fit=crop',
    compatibility: {
      wattage: 850,
    },
    description: 'Corsair RM850x 850W 80+ Gold fully modular power supply. Features zero RPM fan mode for silent operation, 100% Japanese capacitors, and 10-year warranty. Perfect for high-end gaming rigs with RTX 4080 or similar GPUs. Fully modular cables for clean cable management.',
  },
  {
    name: 'Seasonic Focus GX-750 750W 80+ Gold',
    category: 'Power Supply',
    price: 119,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500&h=500&fit=crop',
    compatibility: {
      wattage: 750,
    },
    description: 'Seasonic Focus GX-750 750W 80+ Gold fully modular power supply. Premium build quality with hybrid fan control and 10-year warranty. Features 100% Japanese capacitors and excellent voltage regulation. Ideal for mid to high-end systems with RTX 4070 or similar GPUs.',
  },
  {
    name: 'EVGA SuperNOVA 1000W 80+ Gold',
    category: 'Power Supply',
    price: 199,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500&h=500&fit=crop',
    compatibility: {
      wattage: 1000,
    },
    description: 'EVGA SuperNOVA 1000W 80+ Gold fully modular power supply. High-capacity PSU perfect for multi-GPU setups, extreme overclocking, and high-end workstations. Features ECO mode, 100% Japanese capacitors, and 10-year warranty. Supports the most demanding systems.',
  },
  {
    name: 'Corsair CX650M 650W 80+ Bronze',
    category: 'Power Supply',
    price: 79,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500&h=500&fit=crop',
    compatibility: {
      wattage: 650,
    },
    description: 'Corsair CX650M 650W 80+ Bronze semi-modular power supply. Great value option for budget and mid-range builds. Features semi-modular design for easier cable management, 5-year warranty, and reliable performance. Perfect for systems with RTX 4060 or similar GPUs.',
  },

  // Cabinets
  {
    name: 'Fractal Design Meshify C',
    category: 'Cabinet',
    price: 99,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
    compatibility: {
      supportedFormFactors: ['ATX', 'mATX', 'ITX'],
    },
    description: 'Fractal Design Meshify C mid-tower case with excellent airflow. Features a mesh front panel for optimal cooling, tempered glass side panel, and support for up to 6 fans. Spacious interior accommodates long GPUs and tall CPU coolers. Clean, minimalist design with great cable management options.',
  },
  {
    name: 'NZXT H510 Flow',
    category: 'Cabinet',
    price: 89,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
    compatibility: {
      supportedFormFactors: ['ATX', 'mATX', 'ITX'],
    },
    description: 'NZXT H510 Flow mid-tower case with mesh front panel for improved airflow. Features tempered glass side panel, integrated RGB lighting, and excellent cable management. Supports up to 280mm radiators and includes two pre-installed fans. Modern design with premium build quality.',
  },
  {
    name: 'Cooler Master MasterBox Q300L',
    category: 'Cabinet',
    price: 49,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
    compatibility: {
      supportedFormFactors: ['mATX', 'ITX'],
    },
    description: 'Cooler Master MasterBox Q300L compact micro-ATX case. Perfect for small form factor builds without sacrificing features. Features magnetic dust filters, acrylic side panel, and support for full-size GPUs. Great value option for budget builds with excellent airflow.',
  },
  {
    name: 'Lian Li O11 Dynamic',
    category: 'Cabinet',
    price: 149,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
    compatibility: {
      supportedFormFactors: ['ATX', 'mATX', 'ITX', 'E-ATX'],
    },
    description: 'Lian Li O11 Dynamic premium mid-tower case with dual tempered glass panels. Designed for water cooling enthusiasts with support for multiple radiators. Features excellent airflow, spacious interior, and stunning aesthetics. Perfect for showcasing high-end components and custom loops.',
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

