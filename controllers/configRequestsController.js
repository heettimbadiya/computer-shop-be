import ConfigRequest from '../models/ConfigRequest.js';
import Part from '../models/Part.js';
import mongoose from 'mongoose';
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

    // Validate customer information
    if (!customerName || !customerName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Customer name is required',
      });
    }

    if (!customerEmail || !customerEmail.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Customer email is required',
      });
    }

    if (!customerPhone || !customerPhone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Customer phone is required',
      });
    }

    // Fetch all selected parts to validate - filter out null/undefined values
    const partIds = Object.values(selectedParts).filter(Boolean);
    
    if (partIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one part must be selected',
      });
    }

    // Convert string IDs to ObjectIds if needed
    const validPartIds = partIds.map(id => {
      try {
        return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
      } catch (error) {
        return null;
      }
    }).filter(Boolean);

    if (validPartIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid part IDs provided',
      });
    }

    const parts = await Part.find({ _id: { $in: validPartIds } });

    if (parts.length !== validPartIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more selected parts not found',
        details: `Expected ${validPartIds.length} parts but found ${parts.length}`,
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

    // Convert selectedParts to proper ObjectId format
    const formattedSelectedParts = {};
    for (const [category, partId] of Object.entries(selectedParts)) {
      if (partId && mongoose.Types.ObjectId.isValid(partId)) {
        formattedSelectedParts[category] = new mongoose.Types.ObjectId(partId);
      } else {
        formattedSelectedParts[category] = null;
      }
    }

    // Create configuration request
    const configRequest = new ConfigRequest({
      selectedParts: formattedSelectedParts,
      estimatedPrice,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
    });

    await configRequest.save();

    // Populate parts for response
    try {
      await configRequest.populate([
        { path: 'selectedParts.CPU', model: 'Part', options: { strictPopulate: false } },
        { path: 'selectedParts.Motherboard', model: 'Part', options: { strictPopulate: false } },
        { path: 'selectedParts.RAM', model: 'Part', options: { strictPopulate: false } },
        { path: 'selectedParts.Storage', model: 'Part', options: { strictPopulate: false } },
        { path: 'selectedParts.GPU', model: 'Part', options: { strictPopulate: false } },
        { path: 'selectedParts.Power Supply', model: 'Part', options: { strictPopulate: false } },
        { path: 'selectedParts.Cabinet', model: 'Part', options: { strictPopulate: false } },
      ]);
    } catch (populateError) {
      console.error('Error populating parts:', populateError);
      // Continue even if populate fails - the request is still saved
    }

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
        { 
          path: 'selectedParts.CPU', 
          model: 'Part',
          options: { strictPopulate: false }
        },
        { 
          path: 'selectedParts.Motherboard', 
          model: 'Part',
          options: { strictPopulate: false }
        },
        { 
          path: 'selectedParts.RAM', 
          model: 'Part',
          options: { strictPopulate: false }
        },
        { 
          path: 'selectedParts.Storage', 
          model: 'Part',
          options: { strictPopulate: false }
        },
        { 
          path: 'selectedParts.GPU', 
          model: 'Part',
          options: { strictPopulate: false }
        },
        { 
          path: 'selectedParts.Power Supply', 
          model: 'Part',
          options: { strictPopulate: false }
        },
        { 
          path: 'selectedParts.Cabinet', 
          model: 'Part',
          options: { strictPopulate: false }
        },
      ])
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) || 100)
      .skip(parseInt(skip) || 0);

    const total = await ConfigRequest.countDocuments(query);

    // Log for debugging
    console.log(`Found ${requests.length} configuration requests`);

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
      { path: 'selectedParts.CPU', model: 'Part', options: { strictPopulate: false } },
      { path: 'selectedParts.Motherboard', model: 'Part', options: { strictPopulate: false } },
      { path: 'selectedParts.RAM', model: 'Part', options: { strictPopulate: false } },
      { path: 'selectedParts.Storage', model: 'Part', options: { strictPopulate: false } },
      { path: 'selectedParts.GPU', model: 'Part', options: { strictPopulate: false } },
      { path: 'selectedParts.Power Supply', model: 'Part', options: { strictPopulate: false } },
      { path: 'selectedParts.Cabinet', model: 'Part', options: { strictPopulate: false } },
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
    );
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Configuration request not found',
      });
    }
    
    // Populate parts - use strictPopulate: false to handle 'Power Supply' field with space
    await request.populate([
      { path: 'selectedParts.CPU', model: 'Part', options: { strictPopulate: false } },
      { path: 'selectedParts.Motherboard', model: 'Part', options: { strictPopulate: false } },
      { path: 'selectedParts.RAM', model: 'Part', options: { strictPopulate: false } },
      { path: 'selectedParts.Storage', model: 'Part', options: { strictPopulate: false } },
      { path: 'selectedParts.GPU', model: 'Part', options: { strictPopulate: false } },
      { path: 'selectedParts.Power Supply', model: 'Part', options: { strictPopulate: false } },
      { path: 'selectedParts.Cabinet', model: 'Part', options: { strictPopulate: false } },
    ]);

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

