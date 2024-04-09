import { Schema, model, Types } from "mongoose";

const trainingRegisterSchema = new Schema({
  // studentId
  studentId: {
    type: Types.ObjectId,
    ref: "user",
    required: true,
  },

  trainingRegisterd: [
    {
      // Training he want to Register
      type: Types.ObjectId,
      ref: "Training",
      required: true,
    },
  ],
});

const TrainingRegisterModel = model("TrainingRegister", trainingRegisterSchema);

export default TrainingRegisterModel;
