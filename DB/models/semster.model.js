import mongoose from "mongoose";

const semsterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  year: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  term: {
    type: String,
    enum: ["one", "two", "summer"],
    required: true,
    lowercase: true,
  },
  Max_Hours: {
    type: Number,
    required: true,
  },
});

semsterSchema.index({ year: 1 });
const SemesterModel = mongoose.model("Semster", semsterSchema);

export default SemesterModel;
