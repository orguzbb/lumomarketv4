import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/User.js';
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized' });
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) return res.status(401).json({ message: 'User inactive' });
    req.user = user;
    next();
  } catch (error) { return res.status(401).json({ message: 'Token failed' }); }
};
export const optionalProtect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) req.user = user;
    }
  } catch (error) {
    // Ignore invalid token for optional auth
  }
  next();
};
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  next();
};