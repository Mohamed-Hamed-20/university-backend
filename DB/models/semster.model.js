import mongoose from "mongoose";

const semsterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    // required: true,
  },
  endDate: {
    type: Date,
    // required: true,
  },
  term: {
    type: String,
    enum: ["one", "two", "summer"],
    required: true,
  },
  Max_Hours: {
    type: Number,
    required: true,
  },
});

const SemesterModel = mongoose.model("Semster", semsterSchema);

export default SemesterModel;
