import { Router } from "express";
import * as Ic from "../controllers/instructor/instructor.js";
import { valid } from "../middleware/validation.js";
import * as uc from "../controllers/user/user.js";
import * as vSchema from "../controllers/instructor/instructor.vaild.js";
import { isAuth, roles } from "../middleware/auth.js";
import { allowedExtensions, multerCloud } from "../utils/aws.s3.js";
import { limiter } from "../utils/apply.security.js";
import { routes } from "../utils/routes.path.js";
const router = Router();
const { instructor } = routes;
//login Instructor
router.post(
  `${instructor.login}`,
  limiter({ limit: 20, Mintute: 15 }),
  valid(vSchema.login),
  Ic.login
);

router.get(
  `${instructor.InstructorInfo}`,
  limiter({ limit: 40, Mintute: 30 }),
  isAuth([roles.instructor]),
  Ic.Getuser
);


//create Instructor
router.post(
  `${instructor.createInstructor}`,
  limiter({ limit: 100, Mintute: 60 }),
  valid(vSchema.CreateInstructor),
  isAuth([roles.admin]),
  Ic.CreateInstructor
);

router.put(
  `${instructor.updateInstructor}`,
  limiter({ limit: 100, Mintute: 60 }),
  valid(vSchema.updateInstructor),
  isAuth([roles.admin]),
  Ic.updateInstructor
);

router.delete(
  `${instructor.deleteInstructor}`,
  limiter({ limit: 100, Mintute: 60 }),
  valid(vSchema.deleteInstructor),
  isAuth([roles.admin]),
  Ic.deleteInstructor
);

router.get(
  `${instructor.searchInstructor}`,
  limiter({ limit: 60, Mintute: 60 }),
  valid(vSchema.searchInstructor),
  isAuth([roles.admin]),
  Ic.searchInstructor
);

// ==============================================================
// uploads images  by instructor him self EDIT_R
router.post(
  `${instructor.AddImgByInstructor}`,
  limiter({ limit: 60, Mintute: 60 }),
  multerCloud(allowedExtensions.Image).single("instructorImage"),
  isAuth([roles.instructor]),
  Ic.AddInstructorImg
);

// uploads images  by Admin EDIT_R
router.post(
  `${instructor.AddImgByAdmin}`,
  limiter({ limit: 60, Mintute: 60 }),
  multerCloud(allowedExtensions.Image).single("instructorImage"),
  valid(vSchema.AddInstructorImg),
  isAuth([roles.admin]),
  Ic.AddInstructorImg
);

// delete images  by instructor him self EDIT_R
router.patch(
  `${instructor.deleteImgByInstructor}`,
  limiter({ limit: 40, Mintute: 60 }),
  isAuth([roles.instructor]),
  Ic.deleteInstructorImg
);

// delete images  by Admin EDIT_R
router.patch(
  `${instructor.deleteImgByAdmin}`,
  limiter({ limit: 40, Mintute: 60 }),
  valid(vSchema.deleteInstructorImg),
  isAuth([roles.admin]),
  Ic.deleteInstructorImg
);

router.get(`${instructor.logout}`, isAuth([roles.instructor]), uc.logout);

export default router;
