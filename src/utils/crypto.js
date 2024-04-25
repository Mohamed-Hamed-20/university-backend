import crypto from "crypto";

export const generateHexName = async () => {
  const randomBytes = crypto.randomBytes(32);
  const hexString = randomBytes.toString("hex");
  return { hexString };
};

// Function to encrypt data with password
export const encryptData = async ({ data, password }) => {

  try {
    // Generate key from password
    const key = crypto.scryptSync(password, "salt", 32);
    // Create cipher using key
    const cipher = crypto.createCipheriv("aes-256-cbc", key, Buffer.alloc(16));
    // Update cipher with data and encode to hex
    let encrypted = cipher.update(data, "utf8", "hex");
    // Finalize encryption
    encrypted += cipher.final("hex");
    // Return the encrypted data
    return encrypted;
  } catch (error) {
    // Handle encryption error
    throw new Error("Encryption failed", { cause: 500 });
  }
};

// Function to decrypt data with password
export const decryptData = async ({ encryptedData, password }) => {
  try {
    // Generate key from password
    const key = crypto.scryptSync(password, "salt", 32);
    // Create decipher using key
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      key,
      Buffer.alloc(16)
    );
    // Update decipher with encrypted data
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    // Finalize decryption
    decrypted += decipher.final("utf8");
    // Check if decrypted data is valid
    if (!isValidData(decrypted)) {
      throw new Error("Invalid data", { cause: 400 });
    }
    // Return the decrypted data
    return decrypted;
  } catch (error) {
    // Handle decryption error
    const errorMessage = error.message.includes("decryption failed")
      ? "Decryption failed"
      : "Invalid key";
    const statusCode = error.message.includes("decryption failed") ? 500 : 400;
    const err = new Error(errorMessage, { cause: statusCode });
    throw err;
  }
};

// Function to check if decrypted data is valid
const isValidData = (data) => {
  return !!data; // Check if data is not empty
};
