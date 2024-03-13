import { Router } from "express";
import * as Ic from "../controllers/instructor/instructor.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/instructor/instructor.vaild.js";
import { isAuth, roles } from "../middleware/auth.js";
const router = Router();

//login Instructor
router.post("/login", valid(vSchema.login), Ic.login);

router.get(
  "/getinfo",
  // valid(vSchema.Getstudent),
  isAuth([roles.instructor]),
  Ic.Getuser
);

// =====================================================================================

//create Instructor
router.post(
  "/create",
  valid(vSchema.CreateInstructor),
  isAuth([roles.admin]),
  Ic.CreateInstructor
);

router.put(
  "/update",
  valid(vSchema.updateInstructor),
  isAuth([roles.admin]),
  Ic.updateInstructor
);

router.delete(
  "/delete",
  valid(vSchema.deleteInstructor),
  isAuth([roles.admin]),
  Ic.deleteInstructor
);

router.get(
  "/search",
  valid(vSchema.searchInstructor),
  isAuth([roles.admin]),
  Ic.searchInstructor
);

export default router;
