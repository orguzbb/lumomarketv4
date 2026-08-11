import jwt from "jsonwebtoken";
export const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
    issuer: "lumo",
    audience: "lumo-client",
  });
export const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
    issuer: "lumo",
    audience: "lumo-client",
  });
export const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
    issuer: "lumo",
    audience: "lumo-client",
  });
export const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
    issuer: "lumo",
    audience: "lumo-client",
  });
