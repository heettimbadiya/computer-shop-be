import Category from '../models/Category.js';
import Part from '../models/Part.js';

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};

// Get single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }
    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message,
    });
  }
};

// Create new category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    // Check if category already exists (case-insensitive)
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists',
      });
    }

    const category = new Category({ name: name.trim() });
    await category.save();
    
    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully',
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists',
      });
    }
    res.status(400).json({
      success: false,
      message: 'Error creating category',
      error: error.message,
    });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    // Check if another category with the same name exists (case-insensitive)
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      _id: { $ne: req.params.id }
    });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists',
      });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully',
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists',
      });
    }
    res.status(400).json({
      success: false,
      message: 'Error updating category',
      error: error.message,
    });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check if category is a default category
    if (category.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete default category',
      });
    }

    // Check if any parts are using this category
    const partsCount = await Part.countDocuments({ category: category.name });
    
    if (partsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${partsCount} part(s) are using this category.`,
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message,
    });
  }
};

