import { Schema, model, Types } from "mongoose";

const trainingResultSchema = new Schema({
  studentId: {
    type: Types.ObjectId,
    ref: "Student",
    required: true,
  },
  trainingId: {
    type: Types.ObjectId,
    ref: "Training",
    required: true,
  },
  grade: {
    type: Number,
    required: true,
  },
  Status: {
    type: String,
    enum: ["pending", "uploaded", "refused", "accepted"],
  },

});

const trainingResultModel = model("trainingResult", trainingResultSchema);

export default trainingResultModel;
