import mongoose, { Schema, Types } from "mongoose";

const settingSchema = new Schema({
  deniedRoutes: [
    {
      type: String,
      required: true,
    },
  ],
  MainSemsterId: {
    type: Types.ObjectId,
    required: true,
    ref: "Semster",
  },
  MaxAllowTrainingToRegister: {
    type: Number,
    required: false,
    default: 0,
    min: 0,
    max: 10,
  },
});

settingSchema.index({ MainSemsterId: 1 });

const settingModel = mongoose.model("setting", settingSchema);

export default settingModel;
