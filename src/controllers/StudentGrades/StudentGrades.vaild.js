import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addgrate = {
  body: joi
    .object({
      courseId: generalFields._id.required(),
      studentId: generalFields._id.required(),
      FinalExam: joi.number().min(0).max(50).required(),
      Oral: joi.number().min(0).max(10).required(),
      Practical: joi.number().min(0).max(20).required(),
      Midterm: joi.number().min(0).max(20).required(),
    })
    .required(),
};
export const updatecoursegrate = {};
export const deletecoursegrate = {};
export const Getcoursegrate = {};
