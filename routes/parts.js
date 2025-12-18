import express from 'express';
import {
  getAllParts,
  getPartById,
  createPart,
  updatePart,
  deletePart,
} from '../controllers/partsController.js';

const router = express.Router();

router.get('/', getAllParts);
router.get('/:id', getPartById);
router.post('/', createPart);
router.put('/:id', updatePart);
router.delete('/:id', deletePart);

export default router;

