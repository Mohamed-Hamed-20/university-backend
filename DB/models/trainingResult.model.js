import { Schema, model, Types } from "mongoose";

const trainingResultSchema = new Schema({
  studentId: {
    type: Types.ObjectId,
    ref: "user",
    required: true,
  },
  trainingId: {
    type: Types.ObjectId,
    ref: "Training",
    required: true,
  },
  grade: {
    type: Number,
    required: false,
    min: 0,
    max: 100,
  },
  Status: {
    type: String,
    enum: ["pending", "uploaded", "refused", "accepted"],
  },
  semsterId: {
    type: Types.ObjectId,
    required: true,
    ref: "Semster",
  },
});

const trainingResultModel = model("trainingResult", trainingResultSchema);

export default trainingResultModel;
