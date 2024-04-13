import joi from "joi";
import { Types } from "mongoose";

// import { validate } from "joi";
const req_FE = ["body", "params", "query", "headers"];
export const valid = (schema) => {
  return (req, res, next) => {
    const Validation_error = [];
    req_FE.forEach((key) => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          validationResult.error.details.forEach((errorDetail) => {
            Validation_error.push({
              message: errorDetail.message.replace(/\"/g, ""),
              path: errorDetail?.path[0],
              label: errorDetail.context.label,
              type: errorDetail.type,
            });
          });
        }

        if (!validationResult?.error) {
          if (req[key]) {
            req[key] = validationResult.value;
          }
        }
      }
    });

    if (Validation_error.length > 0) {
      return res.status(400).json({
        message: "validation Error",
        error_Message: Validation_error,
      });
    }
    return next();
  };
};

//============================= validatioObjectId =====================
const validateObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? value
    : helper.message("Invalid {#label} ");
};

export const toLowerCase = (value, helper) => {
  if (typeof value !== "string") {
    return helper.message("Invalid {#label}: not a string");
  }
  return value.toLowerCase();
};

export const customMessages = {
  "string.base": "{#label} must be a string",
  "string.min": "{#label} must be at least {#limit} characters",
  "string.max": "{#label} must be at most {#limit} characters",
  "number.base": "{#label} must be a number",
  "number.valid": "{#label} must be one of {#valids}",
  "boolean.base": "{#label} must be a boolean True or false",
  "array.base": "{#label} must be an array",
  "array.items": "Invalid item in {#label}",
  "_id.required": "{#label} is required",
  "_id.optional": "{#label} is optional",
  "any.only": "{#label} must be {#valids}",
  "any.required": "{#label} is required",
};
//======================general Validation Fields========================
export const generalFields = {
  email: joi
    .string()
    .email({ tlds: { allow: ["com", "net", "org"] } })
    .trim()
    .messages(customMessages),

  password: joi
    .string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .trim()
    .messages({
      "string.pattern.base": "Password regex fail",
    })
    .messages(customMessages),

  _id: joi.string().trim().custom(validateObjectId).messages(customMessages),

  PhoneNumber: joi
    .string()
    .pattern(/^[0-9]{11}$/)
    .trim()
    .messages(customMessages),

  gender: joi
    .string()
    .valid("male", "female")
    .lowercase()
    .trim()
    .messages(customMessages),

  date: joi.date().iso().messages(customMessages),

  department: joi
    .string()
    .valid("cs", "is", "ai", "sc")
    .trim()
    .lowercase()
    .messages(customMessages),

  sort: joi.string().trim().optional().messages(customMessages),
  select: joi
    .string()
    .trim()
    .min(3)
    .max(100)
    .optional()
    .messages(customMessages),
  page: joi.number().min(0).max(33).optional().messages(customMessages),
  size: joi.number().min(0).max(23).optional().messages(customMessages),
  search: joi.string().trim().min(0).max(100).messages(customMessages),

  file: joi.object({
    size: joi.number(),
  }),
};

const schema = joi.object({});
