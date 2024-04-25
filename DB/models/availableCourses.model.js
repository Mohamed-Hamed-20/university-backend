import { Schema, model, Types } from "mongoose";
const availableCoursesschema = new Schema(
  {
    studentId: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    Available_Courses: [
      {
        type: Types.ObjectId,
        ref: "course",
      },
    ],
  },
  { timestamps: true }
);

availableCoursesschema.index({ studentId: 1 }, { unique: true });
availableCoursesschema.index({ Available_Courses: 1 });

const availableCoursesModel = model("availableCourse", availableCoursesschema);

export default availableCoursesModel;
