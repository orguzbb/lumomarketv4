import bcrypt from "bcryptjs";
export const hashString = async (str) => await bcrypt.hash(str, 10);
export const compareString = async (str, hash) =>
  await bcrypt.compare(str, hash);
