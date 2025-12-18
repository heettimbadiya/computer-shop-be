import ConfigRequest from '../models/ConfigRequest.js';
import Part from '../models/Part.js';
import { validateCompatibility } from '../services/compatibilityService.js';

// Submit configuration request
export const submitConfigRequest = async (req, res) => {
  try {
    const { selectedParts, customerName, customerEmail, customerPhone } = req.body;

    if (!selectedParts || typeof selectedParts !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Selected parts are required',
      });
    }

    // Fetch all selected parts to validate
    const partIds = Object.values(selectedParts).filter(Boolean);
    const parts = await Part.find({ _id: { $in: partIds } });

    if (parts.length !== partIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more selected parts not found',
      });
    }

    // Validate compatibility
    const compatibility = validateCompatibility(selectedParts, parts);
    if (!compatibility.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Configuration has compatibility issues',
        errors: compatibility.errors,
        warnings: compatibility.warnings,
      });
    }

    // Calculate estimated price
    const estimatedPrice = parts.reduce((total, part) => total + part.price, 0);

    // Create configuration request
    const configRequest = new ConfigRequest({
      selectedParts,
      estimatedPrice,
      customerName: customerName || '',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
    });

    await configRequest.save();

    // Populate parts for response
    await configRequest.populate([
      { path: 'selectedParts.CPU' },
      { path: 'selectedParts.Motherboard' },
      { path: 'selectedParts.RAM' },
      { path: 'selectedParts.Storage' },
      { path: 'selectedParts.GPU' },
      { path: 'selectedParts.Power Supply' },
      { path: 'selectedParts.Cabinet' },
    ]);

    res.status(201).json({
      success: true,
      data: configRequest,
      message: 'Configuration request submitted successfully',
      warnings: compatibility.warnings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting configuration request',
      error: error.message,
    });
  }
};

// Get all configuration requests (admin)
export const getAllConfigRequests = async (req, res) => {
  try {
    const { status, limit, skip } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const requests = await ConfigRequest.find(query)
      .populate([
        { path: 'selectedParts.CPU' },
        { path: 'selectedParts.Motherboard' },
        { path: 'selectedParts.RAM' },
        { path: 'selectedParts.Storage' },
        { path: 'selectedParts.GPU' },
        { path: 'selectedParts.Power Supply' },
        { path: 'selectedParts.Cabinet' },
      ])
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) || 100)
      .skip(parseInt(skip) || 0);

    const total = await ConfigRequest.countDocuments(query);

    res.json({
      success: true,
      data: requests,
      count: requests.length,
      total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching configuration requests',
      error: error.message,
    });
  }
};

// Get single configuration request
export const getConfigRequestById = async (req, res) => {
  try {
    const request = await ConfigRequest.findById(req.params.id).populate([
      { path: 'selectedParts.CPU' },
      { path: 'selectedParts.Motherboard' },
      { path: 'selectedParts.RAM' },
      { path: 'selectedParts.Storage' },
      { path: 'selectedParts.GPU' },
      { path: 'selectedParts.Power Supply' },
      { path: 'selectedParts.Cabinet' },
    ]);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Configuration request not found',
      });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching configuration request',
      error: error.message,
    });
  }
};

// Update configuration request status (admin)
export const updateConfigRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'reviewed', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const request = await ConfigRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate([
      { path: 'selectedParts.CPU' },
      { path: 'selectedParts.Motherboard' },
      { path: 'selectedParts.RAM' },
      { path: 'selectedParts.Storage' },
      { path: 'selectedParts.GPU' },
      { path: 'selectedParts.Power Supply' },
      { path: 'selectedParts.Cabinet' },
    ]);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Configuration request not found',
      });
    }

    res.json({
      success: true,
      data: request,
      message: 'Status updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating status',
      error: error.message,
    });
  }
};

