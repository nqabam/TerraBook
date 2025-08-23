import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getOwnerAccommodations, registerAccommodation } from '../controllers/accommodationController.js';


const accommodationRouter = express.Router();

accommodationRouter.post('/', protect, registerAccommodation);
accommodationRouter.get('/owner', protect, getOwnerAccommodations);

export default accommodationRouter;