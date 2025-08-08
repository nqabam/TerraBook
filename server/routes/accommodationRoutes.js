import express from "express";
import {
  registerAccommodation,
  getAllAccommodations,
  getAccommodationById
} from "../controllers/accommodationController.js";

const router = express.Router();

router.post("/", registerAccommodation);
router.get("/", getAllAccommodations);
router.get("/:id", getAccommodationById);

export default router;
