import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";

export const updateSetting = {
  body: joi
    .object({
      StudentLogin: joi.boolean().optional(),
      StudentRegister: joi.boolean().optional(),
      StudentViewGrates: joi.boolean().optional(),
      StudentViewAvailablecourses: joi.boolean().optional(),
      InstructorLogin: joi.boolean().optional(),
      InstructoruploadsGrates: joi.boolean().optional(),
      AdminLogin: joi.boolean().optional(),
      AdminEditStudent: joi.boolean().optional(),
      AdminEditInstructor: joi.boolean().optional(),
      AdminEditTraining: joi.boolean().optional(),
      AdminEditSemster: joi.boolean().optional(),
      AdminEditCourses: joi.boolean().optional(),
      AdminEditRegister: joi.boolean().optional(),
      MainSemsterId: generalFields._id,
    })
    .required()
    .messages(customMessages),
};
export const deleteSetting = {};
