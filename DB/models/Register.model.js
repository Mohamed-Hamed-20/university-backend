import { Schema, model, Types } from "mongoose";
const Registerschema = new Schema(
  {
    studentId: {
      type: Types.ObjectId,
      ref: "user",
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
      },
    ],
  },
  { timestamps: true }
);

Registerschema.index({ studentId: 1 });
Registerschema.index({ coursesRegisterd: 1 });

const RegisterModel = model("Register", Registerschema);

export default RegisterModel;
