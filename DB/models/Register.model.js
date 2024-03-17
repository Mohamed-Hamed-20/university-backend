import { Schema, model, Types } from "mongoose";
const Registerschema = new Schema(
  {
    studentId: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    semsterId: {
      type: Types.ObjectId,
      ref: "semster",
      required: true,
    },

    Available_Hours: {
      type: Number,
      required: true,
      min: 0,
      max: 18,
    },
    coursesRegisterd: [
      {
        type: Types.ObjectId,
        ref: "course",
        unique: true,
      },
    ],
  },
  { timestamps: true }
);
const RegisterModel = model("Register", Registerschema);

export default RegisterModel;
