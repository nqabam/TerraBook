import User from "../models/User.js";

// @desc    Create or update a user (for Clerk sync or registration)
export const createOrUpdateUser = async (req, res) => {
  try {
    const { _id, email, username, role, image, bio } = req.body;

    if (!_id || !email || !username) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findByIdAndUpdate(
      _id,
      { email, username, role, image, bio },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(user);
  } catch (error) {
    console.error("Error creating/updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a user's profile
export const updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add a favorite item
export const addFavorite = async (req, res) => {
  try {
    const { itemId, itemType } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent duplicates
    const alreadyFavorite = user.favorites.some(
      (fav) =>
        fav.itemId.toString() === itemId && fav.itemType === itemType
    );

    if (alreadyFavorite) {
      return res.status(400).json({ message: "Item already in favorites" });
    }

    user.favorites.push({ itemId, itemType });
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Remove a favorite item
export const removeFavorite = async (req, res) => {
  try {
    const { itemId } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.favorites = user.favorites.filter(
      (fav) => fav.itemId.toString() !== itemId
    );
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ message: "Server error" });
  }
};
