import * as authService from '../services/authService.js';
import { registerSchema, loginSchema, googleAuthSchema } from '../validators/authValidator.js';
import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/User.js';
const setCookie = (res, token) => res.cookie('refreshToken', token, { httpOnly: true, secure: process.env.COOKIE_SECURE === 'true', sameSite: process.env.COOKIE_SAME_SITE || 'lax', maxAge: 30 * 24 * 60 * 60 * 1000, path: '/api/auth' });

export const register = async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.errors[0].message });
    const { user, accessToken, refreshToken } = await authService.registerUser(parsed.data.fullname, parsed.data.email, parsed.data.password);
    setCookie(res, refreshToken);
    res.status(201).json({ user: { id: user._id, fullname: user.fullname, email: user.email, role: user.role }, accessToken });
  } catch (error) { error.message === 'User exists' ? res.status(409).json({ message: error.message }) : next(error); }
};

export const login = async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.errors[0].message });
    const { user, accessToken, refreshToken } = await authService.loginUser(parsed.data.email, parsed.data.password);
    setCookie(res, refreshToken);
    res.json({ user: { id: user._id, fullname: user.fullname, email: user.email, role: user.role }, accessToken });
  } catch (error) { error.message === 'Invalid credentials' ? res.status(401).json({ message: error.message }) : next(error); }
};

export const googleAuth = async (req, res, next) => {
  try {
    const parsed = googleAuthSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.errors[0].message });
    const { user, accessToken, refreshToken } = await authService.loginWithGoogle(parsed.data.idToken);
    setCookie(res, refreshToken);
    res.json({ user: { id: user._id, fullname: user.fullname, email: user.email, role: user.role }, accessToken });
  } catch (error) { next(error); }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'Refresh token required' });
    const { accessToken, refreshToken } = await authService.refreshUserSession(token);
    setCookie(res, refreshToken);
    res.json({ accessToken });
  } catch (error) { res.clearCookie('refreshToken', { path: '/api/auth' }); res.status(401).json({ message: 'Invalid token' }); }
};

export const logout = async (req, res) => { if (req.user) await authService.logoutUser(req.user._id); res.clearCookie('refreshToken', { path: '/api/auth' }); res.json({ message: 'Logged out' }); };

export const getSession = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.json({ authenticated: false, user: null });
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);
    if (!user) return res.json({ authenticated: false, user: null });
    res.json({ authenticated: true, user: { id: user._id, fullname: user.fullname, email: user.email, role: user.role } });
  } catch (error) { res.json({ authenticated: false, user: null }); }
};

export const getMe = async (req, res) => res.json({ user: { id: req.user._id, fullname: req.user.fullname, email: req.user.email, role: req.user.role } });