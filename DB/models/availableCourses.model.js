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
const availableCoursesModel = model("availableCourse", availableCoursesschema);

export default availableCoursesModel;
