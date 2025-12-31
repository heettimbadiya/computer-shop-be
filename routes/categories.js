import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoriesController.js';

const router = express.Router();

// Get all categories
router.get('/', getAllCategories);

// Get single category by ID
router.get('/:id', getCategoryById);

// Create new category
router.post('/', createCategory);

// Update category
router.put('/:id', updateCategory);

// Delete category
router.delete('/:id', deleteCategory);

export default router;

