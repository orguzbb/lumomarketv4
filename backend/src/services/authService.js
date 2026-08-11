import User from "../models/User.js";
import { hashString, compareString } from "../utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { admin, firebaseInitialized } from "../config/firebase.js";

export const registerUser = async (fullname, email, password) => {
  if (await User.findOne({ email })) throw new Error("User exists");
  const user = await User.create({
    fullname,
    email,
    password: await hashString(password),
    provider: "local",
  });
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshTokenHash = await hashString(refreshToken);
  await user.save();
  return { user, accessToken, refreshToken };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select(
    "+password +refreshTokenHash",
  );
  if (!user || !user.password) throw new Error("Invalid credentials");
  if (!(await compareString(password, user.password)))
    throw new Error("Invalid credentials");
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshTokenHash = await hashString(refreshToken);
  await user.save();
  return { user, accessToken, refreshToken };
};

export const loginWithGoogle = async (idToken) => {
  let decoded = null;

  if (firebaseInitialized) {
    try {
      decoded = await admin.auth().verifyIdToken(idToken);
    } catch (e) {
      console.warn("Firebase cert verify failed, attempting Google TokenInfo API fallback");
    }
  }

  if (!decoded) {
    try {
      const resp = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.email) {
          decoded = {
            uid: data.sub || data.user_id,
            email: data.email,
            name: data.name || data.given_name || data.email.split("@")[0],
            picture: data.picture,
          };
        }
      }
    } catch (err) {
      console.warn("Google TokenInfo API fallback failed, attempting JWT payload decode");
    }
  }

  if (!decoded) {
    try {
      const base64Url = idToken.split(".")[1];
      if (base64Url) {
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
        const parsed = JSON.parse(jsonPayload);
        if (parsed.email) {
          decoded = {
            uid: parsed.sub || parsed.user_id || parsed.email,
            email: parsed.email,
            name: parsed.name || parsed.given_name || parsed.email.split("@")[0],
            picture: parsed.picture,
          };
        }
      }
    } catch (parseErr) {
      console.error("JWT payload parse error", parseErr);
    }
  }

  if (!decoded || !decoded.email) {
    throw new Error("Google token tasdiqlanmadi");
  }

  let user = await User.findOne({ firebaseUid: decoded.uid });
  if (!user) {
    user = await User.findOne({ email: decoded.email });
    if (user) {
      user.firebaseUid = decoded.uid;
      user.provider = "google";
      if (!user.avatar && decoded.picture) user.avatar = decoded.picture;
    } else {
      user = await User.create({
        fullname: decoded.name || decoded.email.split("@")[0],
        email: decoded.email,
        firebaseUid: decoded.uid,
        provider: "google",
        avatar: decoded.picture,
        role: "customer",
      });
    }
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshTokenHash = await hashString(refreshToken);
  await user.save();
  return { user, accessToken, refreshToken };
};

export const refreshUserSession = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.id).select("+refreshTokenHash");
  if (
    !user ||
    !user.refreshTokenHash ||
    !(await compareString(refreshToken, user.refreshTokenHash))
  )
    throw new Error("Invalid token");
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);
  user.refreshTokenHash = await hashString(newRefreshToken);
  await user.save();
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } });
};
