import { Schema, Types, model } from "mongoose";

// subcategory model Schema
const userSchema = new Schema(
  {
    Full_Name: {
      type: String,
      required: true,
      lowecase: true,
      unique: true,
      min: 9,
      max: 66,
    },
    National_Id: {
      type: String,
      required: true,
      unique: true,
      minlength: 14,
      maxlength: 14,
    },
    Student_Code: {
      type: String,
      required: true,
      unique: true,
      minlength: 14,
      maxlength: 14,
    },

    semsterId: {
      type: Types.ObjectId,
      ref: "semster",
      required: true,
    },

    Date_of_Birth: {
      type: Date,
      required: true,
    },
    PhoneNumber: {
      type: String,
      required: true,
      min: 11,
      max: 11,
    },
    gender: {
      type: String,
      lowercase: true,
      enum: ["male", "female"],
      default: "male",
    },
    role: {
      type: String,
      enum: ["user", "admin", "instructor"],
      default: "user",
      lowercase: true,
    },
    department: {
      type: String,
      enum: ["cs", "is", "sc", "ai"],
    },
    password: {
      type: String,
      min: 8,
      max: 24,
    },

    // img: {
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
  },
  { timestamps: true }
);

const userModel = model("user", userSchema);

export default userModel;
