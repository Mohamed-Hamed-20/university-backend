import { Router } from "express";
import * as sagc from "../controllers/StudentGrades/StudentGrades.js";
import * as gc from "../controllers/grates/grates.js";
import { valid } from "../middleware/validation.js";
import * as sgc from "../controllers/semsterGrate/semsterGrate.js";
import * as vSchema from "../controllers/StudentGrades/StudentGrades.vaild.js";
import { isAuth, roles } from "../middleware/auth.js";
const router = Router();

// رفع الدرجة
router.post(
  "/addgrate",
  valid(vSchema.addgrate),
  isAuth([roles.instructor]),
  gc.uploadgrate,
  sgc.addTosemster
);

// تحديث الدرجة
router.put(
  "/updategrate",
  valid(vSchema.updatecoursegrate),
  isAuth([roles.instructor, roles.admin]),
  gc.updategrate,
  sgc.updateSemsterGrate
);

// حذف درجة مادة ولكن قبل حزفها يرجعها الى ال جدول المواد المسجلة ام لا
router.delete(
  "/deletecoursegrate",
  valid(vSchema.deletecoursegrate),
  isAuth([roles.instructor, roles.admin]),
  gc.deletecoursegrate,
  sgc.deleteSemsterGrate
);

router.get(
  "/studentsGratesSearch",
  valid(vSchema.studentsGratesSearch),
  isAuth([roles.admin, roles.instructor]),
  gc.studentsGratesSearch
);

router.get(
  "/gradeSingleuser",
  valid(vSchema.gradeSingleuser),
  isAuth([roles.instructor, roles.admin]),
  gc.gradeSingleuser
);

// صحيفة الطالب التفصيلية
router.get(
  "/stugrades",
  valid(vSchema.stugrades),
  isAuth([roles.stu, roles.admin]),
  gc.stugrades
);
// router.get(
//   "/Allgrades",
//   valid(vSchema.Allgrades),
//   isAuth([roles.admin]),
//   gc.Allgrades
// );

export default router;
