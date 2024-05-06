import jwt from "jsonwebtoken";
import TokenModel from "../../DB/models/token.model.js";

export const storeRefreshToken = async (refreshToken, userId, next) => {
  try {
    // Find the refresh token using userId
    let token = await TokenModel.findOne({ userId: userId, isvalid: true })
      .lean()
      .select("_id userId isvalid refreshTokens");

    // If refresh token found
    if (token) {
      // Ensure not exceeding the maximum limit of refresh tokens
      if (token?.refreshTokens?.length >= 4) {
        // Remove the oldest refresh token if the maximum limit is exceeded
        token.refreshTokens.shift();
      }

      // Add the new refresh token
      token?.refreshTokens?.push(refreshToken);
    } else {
      // If refresh token not found, create a new document
      token = {
        userId: userId,
        refreshTokens: [refreshToken],
        isValid: true,
      };
      const result = await TokenModel.create(token);
      // Check if save successful
      if (!result) {
        throw new Error("Failed to store refresh token");
      }
      return true;
    }

    // Save the changes
    const result = await TokenModel.findByIdAndUpdate(
      token._id,
      {
        refreshTokens: token.refreshTokens,
      },
      { new: true }
    );

    // Check if save successful
    if (!result) {
      throw new Error("Failed to store refresh token");
    }

    return true;
  } catch (error) {
    // Throw an exception in case of failure
    throw new Error(error.message);
  }
};

export const verifyToken = ({
  token,
  signature = process.env.DEFAULT_SIGNATURE,
} = {}) => {
  try {
    // check if the payload is empty object
    if (!token) {
      throw new Error("Error in verify Token Not found");
    }
    const data = jwt.verify(token, signature);
    if (!data) {
      throw new Error("Error in verify Token");
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const generateToken = async ({
  payload = {},
  signature = process.env.DEFAULT_SIGNATURE,
  expiresIn = "1d",
} = {}) => {
  try {
    // check if the payload is empty object
    if (!Object.keys(payload).length) {
      throw new Error("can't generate token without payload");
    }
    const token = jwt.sign(payload, signature, { expiresIn });
    if (!token) {
      throw new Error("Faild to geneerate token");
    }
    return token;
  } catch (error) {
    throw new Error("wtf is happended");
  }
};
