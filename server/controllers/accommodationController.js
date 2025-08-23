import Accommodation from "../models/Accommodation.js";
import User from "../models/User.js";

export const registerAccommodation = async (req, res) => {
    try {
        const { propertyType, businessName, email, phone, website, address, city, province, description, amenities, certifications, termsAccepted, privacyAccepted, marketingAccepted } = req.body;
        const owner = req.user._id;

        //Check if the user is already registered
        const existingAccommodation = await Accommodation.findOne({ owner });
        if (existingAccommodation) {
            return res.json({ success: false, message: "Accommodation Already Registered" });
        }

        await Accommodation.create({ propertyType, businessName, email, phone, owner, website, address, city, province, description, amenities, certifications, termsAccepted, privacyAccepted, marketingAccepted });
        await User.findByIdAndUpdate(owner, { role: "owner" }); //Update user role to owner
        res.json({ success: true, message: "Accommodation Registered Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to get accommodations for the current owner
export const getOwnerAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find({ owner: req.auth.userId });
    
    res.json({
      success: true,
      accommodations: accommodations
    });
  } catch (error) {
    console.error("Error fetching owner accommodations:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};