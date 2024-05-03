import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    refreshTokens: [
      {
        type: String,
        required: true,
      },
    ],
    isvalid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

tokenSchema.index({ userId: 1, isvalid: 1 });

const TokenModel = mongoose.model("Token", tokenSchema);

export default TokenModel;
