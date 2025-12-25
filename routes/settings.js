import express from 'express'
import { getSettings, updateExchangeRate } from '../controllers/settingsController.js'

const router = express.Router()

// Get settings
router.get('/', getSettings)

// Update exchange rate
router.put('/exchange-rate', updateExchangeRate)

export default router

