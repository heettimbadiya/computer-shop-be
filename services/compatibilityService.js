/**
 * Compatibility validation service
 * Ensures selected parts are compatible with each other
 */

export const validateCompatibility = (selectedParts, allParts) => {
  const errors = [];
  const warnings = [];

  // Helper to get part by ID
  const getPart = (partId) => {
    if (!partId) return null;
    return allParts.find(p => p._id.toString() === partId.toString());
  };

  const cpu = getPart(selectedParts.CPU);
  const motherboard = getPart(selectedParts.Motherboard);
  const ram = getPart(selectedParts.RAM);
  const storage = getPart(selectedParts.Storage);
  const gpu = getPart(selectedParts.GPU);
  const powerSupply = getPart(selectedParts['Power Supply']);
  const cabinet = getPart(selectedParts.Cabinet);

  // CPU and Motherboard compatibility
  if (cpu && motherboard) {
    if (cpu.compatibility?.socket && motherboard.compatibility?.supportedSocket) {
      if (cpu.compatibility.socket !== motherboard.compatibility.supportedSocket) {
        errors.push('CPU socket type does not match motherboard supported socket');
      }
    }
  }

  // RAM and Motherboard compatibility
  if (ram && motherboard) {
    if (ram.compatibility?.ddrVersion && motherboard.compatibility?.supportedRamType) {
      if (ram.compatibility.ddrVersion !== motherboard.compatibility.supportedRamType) {
        errors.push('RAM type does not match motherboard supported RAM type');
      }
    }
  }

  // Motherboard and Cabinet compatibility
  if (motherboard && cabinet) {
    if (motherboard.compatibility?.formFactor && cabinet.compatibility?.supportedFormFactors) {
      if (!cabinet.compatibility.supportedFormFactors.includes(motherboard.compatibility.formFactor)) {
        errors.push('Motherboard form factor is not supported by the selected cabinet');
      }
    }
  }

  // Power Supply wattage check
  if (powerSupply) {
    let totalPowerNeeded = 0;
    
    if (cpu && cpu.compatibility?.powerConsumption) {
      totalPowerNeeded += cpu.compatibility.powerConsumption;
    }
    if (gpu && gpu.compatibility?.powerConsumption) {
      totalPowerNeeded += gpu.compatibility.powerConsumption;
    }
    // Add base system power (motherboard, RAM, storage, etc.) - estimate 100W
    totalPowerNeeded += 100;

    if (powerSupply.compatibility?.wattage) {
      if (powerSupply.compatibility.wattage < totalPowerNeeded) {
        warnings.push(`Power supply wattage (${powerSupply.compatibility.wattage}W) may be insufficient for the selected components (estimated ${totalPowerNeeded}W needed)`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

export const getCompatibleParts = (category, selectedParts, allParts) => {
  if (!selectedParts || Object.keys(selectedParts).length === 0) {
    // If no parts selected, return all parts in this category (including second-hand)
    // Show all items regardless of stock (stock check will be done in frontend for selection)
    return allParts.filter(part => 
      part.category === category
    );
  }

  const compatibleParts = allParts.filter(part => {
    if (part.category !== category) {
      return false;
    }

    // Get selected parts
    const cpu = allParts.find(p => p._id.toString() === selectedParts.CPU?.toString());
    const motherboard = allParts.find(p => p._id.toString() === selectedParts.Motherboard?.toString());
    const ram = allParts.find(p => p._id.toString() === selectedParts.RAM?.toString());
    const cabinet = allParts.find(p => p._id.toString() === selectedParts.Cabinet?.toString());
    const powerSupply = allParts.find(p => p._id.toString() === selectedParts['Power Supply']?.toString());

    // Filter based on category
    switch (category) {
      case 'CPU':
        // If motherboard is selected, CPU must match socket
        if (motherboard && part.compatibility?.socket && motherboard.compatibility?.supportedSocket) {
          return part.compatibility.socket === motherboard.compatibility.supportedSocket;
        }
        return true;

      case 'Motherboard':
        // Must match CPU socket if CPU is selected
        if (cpu && part.compatibility?.supportedSocket && cpu.compatibility?.socket) {
          if (part.compatibility.supportedSocket !== cpu.compatibility.socket) {
            return false;
          }
        }
        // Must match RAM type if RAM is selected
        if (ram && part.compatibility?.supportedRamType && ram.compatibility?.ddrVersion) {
          if (part.compatibility.supportedRamType !== ram.compatibility.ddrVersion) {
            return false;
          }
        }
        // Must fit in cabinet if cabinet is selected
        if (cabinet && part.compatibility?.formFactor && cabinet.compatibility?.supportedFormFactors) {
          if (!cabinet.compatibility.supportedFormFactors.includes(part.compatibility.formFactor)) {
            return false;
          }
        }
        return true;

      case 'RAM':
        // Must match motherboard RAM type if motherboard is selected
        if (motherboard && part.compatibility?.ddrVersion && motherboard.compatibility?.supportedRamType) {
          return part.compatibility.ddrVersion === motherboard.compatibility.supportedRamType;
        }
        return true;

      case 'Cabinet':
        // Must support motherboard form factor if motherboard is selected
        if (motherboard && part.compatibility?.supportedFormFactors && motherboard.compatibility?.formFactor) {
          return part.compatibility.supportedFormFactors.includes(motherboard.compatibility.formFactor);
        }
        return true;

      case 'Power Supply':
        // Check if wattage is sufficient for selected components
        if (cpu || selectedParts.GPU) {
          let totalPower = 100; // Base system
          if (cpu && cpu.compatibility?.powerConsumption) {
            totalPower += cpu.compatibility.powerConsumption;
          }
          const selectedGpu = allParts.find(p => p._id.toString() === selectedParts.GPU?.toString());
          if (selectedGpu && selectedGpu.compatibility?.powerConsumption) {
            totalPower += selectedGpu.compatibility.powerConsumption;
          }
          if (part.compatibility?.wattage) {
            return part.compatibility.wattage >= totalPower;
          }
        }
        return true;

      case 'GPU':
        // Check if power supply is sufficient
        if (powerSupply && part.compatibility?.powerConsumption && powerSupply.compatibility?.wattage) {
          let totalPower = 100; // Base system
          const selectedCpu = allParts.find(p => p._id.toString() === selectedParts.CPU?.toString());
          if (selectedCpu && selectedCpu.compatibility?.powerConsumption) {
            totalPower += selectedCpu.compatibility.powerConsumption;
          }
          totalPower += part.compatibility.powerConsumption;
          return powerSupply.compatibility.wattage >= totalPower;
        }
        return true;

      case 'Storage':
        // Storage is generally compatible, but could check interface if needed
        return true;

      default:
        return true;
    }
  });

  return compatibleParts;
};

