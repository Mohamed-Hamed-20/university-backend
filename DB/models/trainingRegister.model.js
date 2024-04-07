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
      trainingId: {
        type: Types.ObjectId,
        ref: "Training",
      },
      // status about training he wanted
      Status: {
        type: String,
        enum: ["pending", "refused", "accepted"],
      },
    },
  ],
});

const TrainingRegisterModel = model("TrainingRegister", trainingRegisterSchema);

export default TrainingRegisterModel;
