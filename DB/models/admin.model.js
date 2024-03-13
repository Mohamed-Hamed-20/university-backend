import mongoose, { Schema, Types, model } from "mongoose";

//user model Schema
const adminSchema = new Schema(
  {
    FullName: {
      type: String,
      required: true,
      unique: true,
      min: 8,
      max: 60,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      min: 6,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    Date_of_Birth: {
      type: Date,
      required: true,
    },
    // image: {
    //   public_id: {
    //     type: String,
    //     default: "depositphotos_29387653-stock-photo-facebook-profile_npymre",
    //   },
    //   secure_url: {
    //     type: String,
    //     default:
    //       "https://res.cloudinary.com/dxjng5bfy/image/upload/v1692289127/Ecommerce/depositphotos_29387653-stock-photo-facebook-profile_npymre.jpg",
    //   },
    // },

    gender: {
      type: String,
      lowercase: true,
      enum: ["male", "female"],
      default: "male",
    },
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      required: true,
      // default: "user",
    },
    isconfrimed: {
      type: Boolean,
      default: true,
    },
    Activecode: {
      type: String,
      min: 6,
    },
  },
  { timestamps: true }
);

export const adminModel =
  mongoose.models.adminModel || model("admin", adminSchema);
