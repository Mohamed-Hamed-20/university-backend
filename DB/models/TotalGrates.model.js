import mongoose from "mongoose";

const TotalGratesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    totalHoursPass: {
      type: Number,
      required: true,
      max: 141,
    },
    TotalGpa: {
      type: Number,
      required: true,
      max: 4,
      min: 0,
    },
  },
  { timestamps: true }
);

const TotalGratesModel = mongoose.model("TotalGrates", TotalGratesSchema);

export default TotalGratesModel;
