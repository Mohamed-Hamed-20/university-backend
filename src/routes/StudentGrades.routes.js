import { Router } from "express";
import * as sagc from "../controllers/StudentGrades/StudentGrades.js";
import * as gc from "../controllers/grates/grates.js";
import { valid } from "../middleware/validation.js";
import * as sgc from "../controllers/semsterGrate/semsterGrate.js";
import * as vSchema from "../controllers/StudentGrades/StudentGrades.vaild.js";
import { isAuth, roles } from "../middleware/auth.js";
const router = Router();

router.post(
  "/addgrate",
  isAuth([roles.instructor]),
  valid(vSchema.addgrate),
  gc.uploadgrate,
  sgc.addTosemster,
  sagc.addgrate
);



// router.put(
//   "/updatecoursegrate",
//   valid(vSchema.updatecoursegrate),
//   isAuth([roles.instructor]),
//   scgc.updatecoursegrate
// );
// router.delete(
//   "/deletecoursegrate",
//   valid(vSchema.deletecoursegrate),
//   isAuth([roles.instructor]),
//   scgc.deletecoursegrate
// );

// router.get(
//   "/Getcoursegrate",
//   isAuth([roles.admin, roles.stu]),
//   scgc.Getcoursegrate
// );
export default router;
