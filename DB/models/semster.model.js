import mongoose from "mongoose";

const semsterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      min: 4,
      max: 55,
    },
    level: {
      type: String,
      required: true,
      enum: ["one", "two", "three", "four", "graduated"],
      default: "one",
    },
    Academic_Year: {
      type: String,
      max: 14,
      min: 5,
    },
    term: {
      type: String,
      enum: ["one", "two", "Summer"],
      required: true,
    },
    // MinAvailableHours: {
    //   type: Number,
    //   required: true,
    //   max: 144,
    // },
  },
  { timestamps: true }
);

const semsterModel = mongoose.model("semster", semsterSchema);

export default semsterModel;
