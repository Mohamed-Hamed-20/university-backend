import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

// grades Greneral fields use it
const GradesFields = {
  FinalExam: joi.number().min(0).max(50),
  Oral: joi.number().min(0).max(10),
  Practical: joi.number().min(0).max(20),
  Midterm: joi.number().min(0).max(20),
};

// add grade by admin
export const addgrate = {
  body: joi
    .object({
      courseId: generalFields._id.required(),
      semsterId: generalFields._id.required(),
      studentId: generalFields._id.required(),
      FinalExam: GradesFields.FinalExam.required(),
      Oral: GradesFields.Oral.required(),
      Practical: GradesFields.Practical.required(),
      Midterm: GradesFields.Midterm.required(),
    })
    .required(),
};

// add grade by Instructor
export const addgrateInstructor = {
  body: joi
    .object({
      courseId: generalFields._id.required(),
      studentId: generalFields._id.required(),
      FinalExam: GradesFields.FinalExam.required(),
      Oral: GradesFields.Oral.required(),
      Practical: GradesFields.Practical.required(),
      Midterm: GradesFields.Midterm.required(),
    })
    .required(),
};

// Update grade by Admin
export const updatecoursegrate = {
  body: joi
    .object({
      FinalExam: GradesFields.FinalExam.optional(),
      Oral: GradesFields.Oral.optional(),
      Practical: GradesFields.Practical.optional(),
      Midterm: GradesFields.Midterm.optional(),
    })
    .required(),
  query: joi
    .object({
      GradeId: generalFields._id.required(),
    })
    .required(),
};

// Update grade by Instructor
export const updatecoursegrateInstructor = {
  body: joi
    .object({
      FinalExam: GradesFields.FinalExam.optional(),
      Oral: GradesFields.Oral.optional(),
      Practical: GradesFields.Practical.optional(),
      Midterm: GradesFields.Midterm.optional(),
    })
    .required(),
  query: joi
    .object({
      GradeId: generalFields._id.required(),
    })
    .required(),
};

// Update grade by Instructor && admin
export const deletecoursegrate = {
  query: joi
    .object({
      GradeId: generalFields._id.required(),
    })
    .required(),
  body: joi
    .object({
      backToRegister: joi
        .string()
        .trim()
        .lowercase()
        .valid("yes", "no")
        .required(),
    })
    .required(),
};

export const studentsGratesSearch = {
  query: joi
    .object({
      sort: generalFields.sort,
      select: generalFields.select,
      page: generalFields.page,
      size: generalFields.size,
      search: generalFields.search,

      courseId: generalFields._id,
      studentId: generalFields._id,
      semsterId: generalFields._id,
    })
    .required(),
};

export const studentsGratesSearchInstructor = {
  query: joi
    .object({
      sort: generalFields.sort,
      select: generalFields.select,
      page: generalFields.page,
      size: generalFields.size,
      search: generalFields.search,

      courseId: generalFields._id.required(),
      studentId: generalFields._id,
    })
    .required(),
};

export const gradeSingleuser = {
  query: joi
    .object({
      GradeId: generalFields._id.required(),
    })
    .required(),
};

export const stugrades = {
  query: joi
    .object({
      studentId: generalFields._id.required(),
    })
    .required(),
};
