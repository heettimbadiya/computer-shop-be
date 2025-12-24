import ContactInfo from '../models/ContactInfo.js';

// Get contact information
export const getContactInfo = async (req, res) => {
  try {
    let contactInfo = await ContactInfo.findOne();
    
    // If no contact info exists, create with default values
    if (!contactInfo) {
      contactInfo = await ContactInfo.create({
        workerPhone: '+90 551 894 00 69',
        instagramUrl: 'https://www.instagram.com/xpanbilgisayar',
      });
    }
    
    res.json({
      success: true,
      data: contactInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contact information',
      error: error.message,
    });
  }
};

// Update contact information (admin)
export const updateContactInfo = async (req, res) => {
  try {
    const { workerPhone, instagramUrl } = req.body;

    // Validate phone number format (basic validation)
    if (workerPhone && workerPhone.trim()) {
      const phoneRegex = /^\+?[\d\s\-()]+$/;
      if (!phoneRegex.test(workerPhone.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid phone number format',
        });
      }
    }

    // Validate Instagram URL format
    if (instagramUrl && instagramUrl.trim()) {
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(instagramUrl.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid URL format. Must start with http:// or https://',
        });
      }
    }

    let contactInfo = await ContactInfo.findOne();
    
    if (!contactInfo) {
      // Create if doesn't exist
      contactInfo = new ContactInfo({
        workerPhone: workerPhone?.trim() || '+90 551 894 00 69',
        instagramUrl: instagramUrl?.trim() || 'https://www.instagram.com/xpanbilgisayar',
      });
      await contactInfo.save();
    } else {
      // Update existing
      if (workerPhone !== undefined) {
        contactInfo.workerPhone = workerPhone.trim();
      }
      if (instagramUrl !== undefined) {
        contactInfo.instagramUrl = instagramUrl.trim();
      }
      await contactInfo.save();
    }

    res.json({
      success: true,
      data: contactInfo,
      message: 'Contact information updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating contact information',
      error: error.message,
    });
  }
};

