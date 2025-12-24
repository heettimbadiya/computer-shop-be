import Part from '../models/Part.js';
import { getCompatibleParts } from '../services/compatibilityService.js';

// Get all parts with optional filters
export const getAllParts = async (req, res) => {
  try {
    const { category, compatibleWith } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    // Show all parts (both new and second-hand) - deleted items are automatically excluded by MongoDB
    const allParts = await Part.find(query).sort({ category: 1, name: 1 });

    // If compatibleWith is provided, filter compatible parts
    if (compatibleWith) {
      try {
        const selectedParts = JSON.parse(compatibleWith);
        const compatibleParts = getCompatibleParts(
          category || 'all',
          selectedParts,
          allParts
        );
        return res.json({
          success: true,
          data: compatibleParts,
          count: compatibleParts.length,
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid compatibleWith parameter',
        });
      }
    }

    res.json({
      success: true,
      data: allParts,
      count: allParts.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching parts',
      error: error.message,
    });
  }
};

// Get single part by ID
export const getPartById = async (req, res) => {
  try {
    // Show all parts (both new and second-hand) - deleted items are automatically excluded
    const part = await Part.findById(req.params.id);
    if (!part) {
      return res.status(404).json({
        success: false,
        message: 'Part not found',
      });
    }
    res.json({
      success: true,
      data: part,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching part',
      error: error.message,
    });
  }
};

// Create new part (admin)
export const createPart = async (req, res) => {
  try {
    const part = new Part(req.body);
    await part.save();
    res.status(201).json({
      success: true,
      data: part,
      message: 'Part created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating part',
      error: error.message,
    });
  }
};

// Update part (admin)
export const updatePart = async (req, res) => {
  try {
    const part = await Part.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!part) {
      return res.status(404).json({
        success: false,
        message: 'Part not found',
      });
    }
    res.json({
      success: true,
      data: part,
      message: 'Part updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating part',
      error: error.message,
    });
  }
};

// Delete part (admin)
export const deletePart = async (req, res) => {
  try {
    const part = await Part.findByIdAndDelete(req.params.id);
    if (!part) {
      return res.status(404).json({
        success: false,
        message: 'Part not found',
      });
    }
    res.json({
      success: true,
      message: 'Part deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting part',
      error: error.message,
    });
  }
};

