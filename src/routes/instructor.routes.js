import { Router } from "express";
import * as Ic from "../controllers/instructor/instructor.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/instructor/instructor.vaild.js";
import { isAuth, roles } from "../middleware/auth.js";
import { allowedExtensions, multerCloud } from "../utils/aws.s3.js";
import { routes } from "../utils/routes.path.js";
const router = Router();
const { instructor } = routes;
//login Instructor
router.post(`${instructor.login}`, valid(vSchema.login), Ic.login);

router.get(
  `${instructor.InstructorInfo}`,
  isAuth([roles.instructor]),
  Ic.Getuser
);

// =====================================================================================

//create Instructor
router.post(
  `${instructor.createInstructor}`,
  valid(vSchema.CreateInstructor),
  isAuth([roles.admin]),
  Ic.CreateInstructor
);

router.put(
  `${instructor.updateInstructor}`,
  valid(vSchema.updateInstructor),
  isAuth([roles.admin]),
  Ic.updateInstructor
);

router.delete(
  `${instructor.deleteInstructor}`,
  valid(vSchema.deleteInstructor),
  isAuth([roles.admin]),
  Ic.deleteInstructor
);

router.get(
  `${instructor.searchInstructor}`,
  valid(vSchema.searchInstructor),
  isAuth([roles.admin]),
  Ic.searchInstructor
);

// ==============================================================
// uploads images  by instructor him self EDIT_R
router.post(
  `${instructor.AddImgByInstructor}`,
  multerCloud(allowedExtensions.Image).single("instructorImage"),
  isAuth([roles.instructor]),
  Ic.AddInstructorImg
);

// uploads images  by Admin EDIT_R
router.post(
  `${instructor.AddImgByAdmin}`,
  multerCloud(allowedExtensions.Image).single("instructorImage"),
  valid(vSchema.AddInstructorImg),
  isAuth([roles.admin]),
  Ic.AddInstructorImg
);

// delete images  by instructor him self EDIT_R
router.patch(
  `${instructor.deleteImgByInstructor}`,
  isAuth([roles.instructor]),
  Ic.deleteInstructorImg
);

// delete images  by Admin EDIT_R
router.patch(
  `${instructor.deleteImgByAdmin}`,
  valid(vSchema.deleteInstructorImg),
  isAuth([roles.admin]),
  Ic.deleteInstructorImg
);


export default router;
