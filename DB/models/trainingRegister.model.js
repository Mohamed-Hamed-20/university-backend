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

trainingRegisterSchema.index({ trainingRegisterd: 1 });
trainingRegisterSchema.index({ studentId: 1 });

const TrainingRegisterModel = model("TrainingRegister", trainingRegisterSchema);

export default TrainingRegisterModel;
