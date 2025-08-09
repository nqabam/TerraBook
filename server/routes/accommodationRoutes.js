import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { registerAccommodation } from "../controllers/accommodationController.js";

const accommodationRouter = express.Router();

accommodationRouter.post('/', protect, registerAccommodation)

export default accommodationRouter;