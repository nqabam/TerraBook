/*import User from "../models/User.js";

// Middleware to check if user is authenticated
export const protect = async (req, res, next)=>{
    const {userId} = req.auth();
    if (!userId) {
        res.json({success: false, message: "not aunthenticated"})
    } else {
        const user = await User.findById(userId);
        req.user = user;
        next();
    }
};
*/
import jwt from 'jsonwebtoken';
import user from '../models/User.js';

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }
};
