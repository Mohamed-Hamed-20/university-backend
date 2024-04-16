import crypto from "crypto";

export const generateHexName = async () => {
  const randomBytes = crypto.randomBytes(32);
  const hexString = randomBytes.toString("hex");
  return { hexString };
};
