import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";

// دالة لإضافة أيام إلى التاريخ
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export const addtrain = {
  body: joi
    .object({
      training_name: joi
        .string()
        .min(3)
        .max(40)
        .required()
        .lowercase()
        .messages(customMessages),
      desc: joi.string().min(10).max(400).required().messages(customMessages),
      OpenForRegister: joi.boolean().optional().messages(customMessages),
      start_date: joi.date().iso().required().messages(customMessages),
      end_date: joi
        .date()
        .iso()
        .required()
        .min(
          joi.ref("start_date", { adjust: (value) => addDays(value, 3) }),
          "at least 5 days after start date"
        )
        .messages(customMessages),

      requirements: joi
        .string()
        .min(5)
        .max(300)
        .optional()
        .messages(customMessages),
      max_student: joi.number().optional().messages(customMessages),
      AllowLevel: joi
        .array()
        .items(
          joi
            .string()
            .valid("one", "two", "three", "four", "graduated")
            .lowercase()
        )
        .optional()
        .messages(customMessages),
    })
    .required(),
};

export const updatetrain = {
  body: joi
    .object({
      training_name: joi
        .string()
        .min(3)
        .max(40)
        .lowercase()
        .optional()
        .messages(customMessages),
      desc: joi.string().min(10).max(400).optional().messages(customMessages),
      OpenForRegister: joi.boolean().optional().messages(customMessages),
      start_date: joi.date().optional().messages(customMessages),
      end_date: joi
        .date()
        .iso()
        .min(
          joi.ref("start_date", { adjust: (value) => addDays(value, 5) }),
          "at least 5 days after start date"
        )
        .optional()
        .messages(customMessages),
      requirements: joi
        .string()
        .min(5)
        .max(300)
        .optional()
        .messages(customMessages),
      max_student: joi.number().optional().messages(customMessages),
      AllowLevel: joi
        .array()
        .items(
          joi
            .string()
            .valid("one", "two", "three", "four", "graduated")
            .lowercase()
        )
        .optional()
        .messages(customMessages),
    })
    .required(),
  query: joi
    .object({
      training_id: generalFields._id.required().messages(customMessages),
    })
    .required(),
};

export const deletetrain = {
  query: joi
    .object({
      training_id: generalFields._id.required().messages(customMessages),
    })
    .required(),
};

export const alltrain = {
  query: joi
    .object({
      sort: joi.string().messages(customMessages),
      select: joi.string().min(3).max(100).messages(customMessages),
      page: joi.number().min(0).max(33).messages(customMessages),
      size: joi.number().min(0).max(20).messages(customMessages),
      search: joi.string().min(0).max(100).messages(customMessages),
    })
    .required(),
};

export const AddTrainingImg = {
  body: joi
    .object({
      trainingId: generalFields._id.required().messages(customMessages),
    })
    .required(),
};

export const deleteTrainingImg = {
  body: joi
    .object({
      trainingId: generalFields._id.required().messages(customMessages),
      ImgUrls: joi
        .array()
        .items(joi.string().optional().messages(customMessages))
        .required()
        .messages(customMessages),
    })
    .required(),
};

export const TrainInfo = {
  query: joi
    .object({
      trainingId: generalFields._id.required().messages(customMessages),
    })
    .required(),
};
