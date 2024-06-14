import { Schema, model, Types } from "mongoose";
const trainingschema = new Schema(
  {
    training_name: {
      type: String,
      required: true,
      lowercase: true,
      min: 3,
      max: 97,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    requirements: {
      type: String,
      min: 5,
      max: 5000,
    },
    desc: {
      type: String,
      required: true,
      min: 10,
      max: 8000,
    },
    max_student: {
      type: Number,
      required: false,
    },
    OpenForRegister: {
      type: Boolean,
      default: false,
    },
    AllowLevel: {
      type: Schema.Types.Mixed,
      lowercase: true,
      default: ["two", "three", "four", "graduated"],
      enum: ["one", "two", "three", "four", "graduated"],
    },
    ImgUrls: [
      {
        type: String,
        required: false,
      },
    ],
  },
  { timestamps: true }
);

trainingschema.index({ training_name: 1 });

const trainingmodel = model("Training", trainingschema);

export default trainingmodel;
