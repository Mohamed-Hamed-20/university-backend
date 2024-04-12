import { Router } from "express";
import * as gc from "../controllers/grates/grates.js";
import { valid } from "../middleware/validation.js";
import * as sgc from "../controllers/semsterGrate/semsterGrate.js";
import * as vSchema from "../controllers/grates/grates.valid.js";
import { isAuth, roles } from "../middleware/auth.js";
const router = Router();

// رفع الدرجة
router.post(
  "/addgrate",
  valid(vSchema.addgrate),
  isAuth([roles.instructor , roles.admin]),
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
router.get(
  "/MainsemsterGrate",
  // valid(vSchema.MainsemsterGrate),
  isAuth([roles.stu]),
  gc.MainsemsterGrate
);

export default router;
