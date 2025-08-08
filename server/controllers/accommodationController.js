import Accommodation from "../models/Accommodation.js";

// @desc    Register new eco-friendly property
// @route   POST /api/accommodations
// @access  Public
export const registerAccommodation = async (req, res) => {
  try {
    const data = req.body;

    // Basic validation
    if (!data.termsAccepted || !data.privacyAccepted) {
      return res.status(400).json({
        success: false,
        message: "You must accept Terms & Privacy Policy"
      });
    }

    const newAccommodation = new Accommodation(data);
    await newAccommodation.save();

    res.status(201).json({
      success: true,
      message: "Accommodation registered successfully",
      accommodation: newAccommodation
    });
  } catch (error) {
    console.error("Accommodation registration error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get all accommodations
// @route   GET /api/accommodations
// @access  Public
export const getAllAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, accommodations });
  } catch (error) {
    console.error("Fetch accommodations error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get single accommodation by ID
// @route   GET /api/accommodations/:id
// @access  Public
export const getAccommodationById = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.status(200).json({ success: true, accommodation });
  } catch (error) {
    console.error("Fetch accommodation error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
