import express from "express";
import {
  createOrUpdateUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  addFavorite,
  removeFavorite
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", createOrUpdateUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/:id/favorites", addFavorite);
router.delete("/:id/favorites", removeFavorite);

export default router;
