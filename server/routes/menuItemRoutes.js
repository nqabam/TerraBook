import express from "express"
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { createMenuItem, deleteMenuItem, getMenuItems, getOwnerMenuItems, toggleMenuItemAvailability, updateMenuItem } from "../controllers/menuItemController.js";


const menuItemRouter = express.Router();

menuItemRouter.post('/', upload.array("images", 4), protect, createMenuItem);
menuItemRouter.get('/', getMenuItems);
menuItemRouter.get('/owner', protect, getOwnerMenuItems);
menuItemRouter.post('/toggle-availability', protect, toggleMenuItemAvailability);
menuItemRouter.put('/:id', protect, updateMenuItem);
menuItemRouter.delete('/:id', protect, deleteMenuItem);

export default menuItemRouter;