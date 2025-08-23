import express from 'express';  
import { addToFavourites, getUserData } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.get('/', protect, getUserData);
userRouter.post('/wishlist', protect, addToFavourites);

export default userRouter;