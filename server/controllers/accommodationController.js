import Accommodation from "../models/Accommodation.js";
import User from "../models/User.js";

export const registerAccommodation = async (req, res) => {
  try {
    const {propertyType, businessName, email, phone, website, address, city, province, description, certifications, amenities, images, pricing, termsAccepted, privacyAccepted, marketingAccepted} = req.body;
    const owner = req.user._id

    //Check if user already registered
    const existingAccommodation = await Accommodation.findOne({owner})
    if (existingAccommodation) {
      return res.json({ success: false, message: "Hotel already Registered"});
    } else {
      await Accommodation.create({propertyType, businessName, email, phone, website, address, city, province, description, certifications, amenities, images, pricing, termsAccepted, privacyAccepted, marketingAccepted, owner});

      await User.findByIdAndUpdate(owner, {role: "Owner"});

      res.json({success: true, message: "Property Registered Successfully"});
    }
  } catch (error) {
    res.json({success: false, message: error.message});
  }
}