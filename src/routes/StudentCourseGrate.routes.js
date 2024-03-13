import { Router } from "express";
import * as scgc from "../controllers/StudentCourseGrate/StudentCourseGrate.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/StudentCourseGrate/StudentCourseGrate.vaild.js";
import { isAuth, roles } from "../middleware/auth.js";
const router = Router();

//login admin SuperAdmins
router.post(
  "/addcoursegrate",
    valid(vSchema.addcoursegrate),
  isAuth([roles.instructor]),
  scgc.addcoursegrate
);
router.put(
  "/updatecoursegrate",
  valid(vSchema.updatecoursegrate),
  isAuth([roles.instructor]),
  scgc.updatecoursegrate
);
router.delete(
  "/deletecoursegrate",
  valid(vSchema.deletecoursegrate),
  isAuth([roles.instructor]),
  scgc.deletecoursegrate
);

router.get(
  "/Getcoursegrate",
  isAuth([roles.admin, roles.stu]),
  scgc.Getcoursegrate
);

export default router;
