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
    type: String,
    required: true,
    enum: ["failed", "passed"],
  },
});

const trainingResultModel = model("trainingResult", trainingResultSchema);

export default trainingResultModel;
