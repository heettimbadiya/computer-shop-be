import Settings from '../models/Settings.js'

// Get settings
export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings()
    res.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message,
    })
  }
}

// Update exchange rate
export const updateExchangeRate = async (req, res) => {
  try {
    const { usdToTryRate } = req.body

    if (!usdToTryRate || typeof usdToTryRate !== 'number' || usdToTryRate <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exchange rate. Must be a positive number.',
      })
    }

    const settings = await Settings.getSettings()
    settings.currency.usdToTryRate = usdToTryRate
    settings.currency.lastUpdated = new Date()
    await settings.save()

    res.json({
      success: true,
      message: 'Exchange rate updated successfully',
      data: settings,
    })
  } catch (error) {
    console.error('Error updating exchange rate:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating exchange rate',
      error: error.message,
    })
  }
}

