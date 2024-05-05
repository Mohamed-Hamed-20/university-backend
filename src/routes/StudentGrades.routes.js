import { Router } from "express";
import * as gc from "../controllers/grates/grates.js";
import { valid } from "../middleware/validation.js";
import * as sgc from "../controllers/semsterGrate/semsterGrate.js";
import * as vSchema from "../controllers/grates/grates.valid.js";
import { isAuth, roles } from "../middleware/auth.js";
import { limiter } from "../utils/apply.security.js";
import { routes } from "../utils/routes.path.js";
const router = Router();
const { studentGrades } = routes;
// رفع الدرجة الانستركتور   ======>   EDIT_R
router.post(
  `${studentGrades.AddGradeByInstructor}`,
  limiter({ limit: 70, Mintute: 60 }),
  valid(vSchema.addgrateInstructor),
  isAuth([roles.instructor]),
  gc.uploadGrade,
  sgc.addTosemster
);

// رفع الدرجة الادمن       ======>   EDIT_R
router.post(
  `${studentGrades.AddGradeByAdmin}`,
  limiter({ limit: 50, Mintute: 60 }),
  valid(vSchema.addgrate),
  isAuth([roles.super, roles.admin]),
  gc.uploadGrade,
  sgc.addTosemster
);
// =============================================================

// تحديث الدرجة الادمن          ======>   EDIT_R
router.put(
  `${studentGrades.updateGradeByAdmin}`,
  limiter({ limit: 40, Mintute: 60 }),
  valid(vSchema.updatecoursegrate),
  isAuth([roles.super, roles.admin]),
  gc.updategrate,
  sgc.updateSemsterGrate
);

// تحديث الدرجة الادكتور          ======>   EDIT_R
router.put(
  `${studentGrades.updateGradeByInstructor}`,
  limiter({ limit: 100, Mintute: 60 }),
  valid(vSchema.updatecoursegrateInstructor),
  isAuth([roles.instructor]),
  gc.updategrate,
  sgc.updateSemsterGrate
);
// =============================================================

// حذف الدرجة الادمن                  ======>   EDIT_R
router.delete(
  `${studentGrades.deleteGradeByAdmin}`,
  limiter({ limit: 100, Mintute: 60 }),
  valid(vSchema.deletecoursegrate),
  isAuth([roles.super, roles.admin]),
  gc.deletecoursegrate,
  sgc.deleteSemsterGrate
);

// حذف الدرجة الدكتور            ======>   EDIT_R
router.delete(
  `${studentGrades.deleteGradeByInstructor}`,
  limiter({ limit: 60, Mintute: 60 }),
  valid(vSchema.deletecoursegrate),
  isAuth([roles.instructor]),
  gc.deletecoursegrate,
  sgc.deleteSemsterGrate
);

//==================================================================

// Admin  students Grates Search ======>   EDIT_R
router.get(
  `${studentGrades.studentsGradesSearchByAdmin}`,
  limiter({ limit: 150, Mintute: 60 }),
  valid(vSchema.studentsGratesSearch),
  isAuth([roles.admin, roles.super]),
  gc.studentsGratesSearch
);

// instructor  students Grates Search ======>   EDIT_R
router.get(
  `${studentGrades.studentsGradesSearchByInstructor}`,
  limiter({ limit: 150, Mintute: 60 }),
  valid(vSchema.studentsGratesSearchInstructor),
  isAuth([roles.instructor]),
  gc.studentsGratesSearch
);
// ========================================================

// Admin  grade Single user ======>   EDIT_R
router.get(
  `${studentGrades.GetSingleGradeAboutUserByAdmin}`,
  limiter({ limit: 50, Mintute: 60 }),
  valid(vSchema.gradeSingleuser),
  isAuth([roles.admin, roles.super]),
  gc.gradeSingleuser
);

// instructor  grade Single user ======>   EDIT_R
router.get(
  `${studentGrades.GetSingleGradeAboutUserByInstructor}`,
  limiter({ limit: 30, Mintute: 60 }),
  valid(vSchema.gradeSingleuser),
  isAuth([roles.instructor]),
  gc.gradeSingleuser
);
// ================================================================================

// صحيفة الطالب التفصيلية  to student  
router.get(
  `${studentGrades.NewspaperBystudent}`,
  limiter({ limit: 30, Mintute: 60 }),
  isAuth([roles.stu]),
  gc.stugrades
);

// صحيفة الطالب التفصيلية  to Admin and super
router.get(
  `${studentGrades.NewspaperByAdmin}`,
  limiter({ limit: 80, Mintute: 60 }),
  valid(vSchema.stugrades),
  isAuth([roles.admin, roles.super]),
  gc.stugrades
);

// =========================================================================
//  student Main semster Grate
router.get(
  `${studentGrades.GetMainsemsterGrade}`,
  limiter({ limit: 100, Mintute: 60 }),
  isAuth([roles.stu]),
  gc.MainsemsterGrate
);

export default router;
