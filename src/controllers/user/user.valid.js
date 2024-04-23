import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";


// student Greneral fields use it
const StudentFields = {
  Full_Name:joi.string().lowercase().min(9).max(66).messages(customMessages),
  Student_Code:joi.string().pattern(/^[0-9]{15}$/).messages(),
  National_Id:joi.string().pattern(/^[0-9]{14}$/).messages(),
  Date_of_Birth:joi.date().iso().messages(customMessages),
  imgName:joi.string().min(15).max(300).messages(customMessages)
};

export const registeruser = {
  body: joi
    .object({
      Full_Name:StudentFields.Full_Name.required(),
      National_Id:StudentFields.National_Id.required(),
      Student_Code:StudentFields.Student_Code.required(),
      Date_of_Birth:StudentFields.Date_of_Birth.required(),
      PhoneNumber: generalFields.PhoneNumber.required(),
      department: generalFields.department.optional(),
      gender: generalFields.gender.optional(),
    })
    .required(),
};

export const login = {
  body: joi
    .object({
      Student_Code:StudentFields.Student_Code.required(),
      password: joi
        .string()
        .trim()
        .min(8)
        .max(24)
        .required()
        .messages(customMessages),
    })
    .required(),
};

export const updateStudent = {
  body: joi
    .object({
      Full_Name:StudentFields.Full_Name.optional(),
      National_Id:StudentFields.National_Id.optional(),
      Student_Code:StudentFields.Student_Code.optional(),
      Date_of_Birth:StudentFields.Date_of_Birth.optional(),
      PhoneNumber:generalFields.PhoneNumber.optional().messages(customMessages),
      department:generalFields.department.optional(),
      gender:generalFields.gender.optional(),
    })
    .required(),
  query: joi
    .object({
      userId: generalFields._id.required(),
    })
    .required(),
};

export const deleteStudent = {
  query: joi
    .object({
      userId: generalFields._id.required().messages(customMessages),
    })
    .required(),
};
export const searchuser = {
  query: joi
    .object({
      sort: generalFields.sort,
      select: generalFields.select,
      page: generalFields.page,
      size: generalFields.size,
      search: generalFields.search,
    })
    .required(),
};

export const AddStuImg = {
  body: joi
    .object({
      studentId: generalFields._id.required().messages(customMessages),
    })
    .required(),
};

export const deleteStuImg = {
  body: joi
    .object({
      studentId: generalFields._id.required().messages(customMessages),
      imgName:StudentFields.imgName.required(),
    })
    .required(),
};

export const StudeleteStuImg = {
  body: joi
    .object({
      imgName:StudentFields.imgName.required(),
    }).required(),
};
