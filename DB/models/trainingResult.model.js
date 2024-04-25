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
    lowercase: true,
    enum: ["failed", "passed"],
  },
});

trainingResultSchema.index({ studentId: 1 });
trainingResultSchema.index({ trainingId: 1 });

const trainingResultModel = model("trainingResult", trainingResultSchema);

export default trainingResultModel;
