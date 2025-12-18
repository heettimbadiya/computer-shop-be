import express from 'express';
import {
  submitConfigRequest,
  getAllConfigRequests,
  getConfigRequestById,
  updateConfigRequestStatus,
} from '../controllers/configRequestsController.js';

const router = express.Router();

router.post('/', submitConfigRequest);
router.get('/', getAllConfigRequests);
router.get('/:id', getConfigRequestById);
router.put('/:id/status', updateConfigRequestStatus);

export default router;

