import { Router } from "express";
import * as gc from "../controllers/grates/grates.js";
import { valid } from "../middleware/validation.js";
import * as sgc from "../controllers/semsterGrate/semsterGrate.js";
import * as vSchema from "../controllers/grates/grates.valid.js";
import { isAuth, roles } from "../middleware/auth.js";
import { routes } from "../utils/routes.path.js";
const router = Router();
const { studentGrades } = routes;
// رفع الدرجة الانستركتور   ======>   EDIT_R
router.post(
  `${studentGrades.AddGradeByInstructor}`,
  valid(vSchema.addgrateInstructor),
  isAuth([roles.instructor]),
  gc.uploadgrate,
  sgc.addTosemster
);

// رفع الدرجة الادمن       ======>   EDIT_R
router.post(
  `${studentGrades.AddGradeByAdmin}`,
  valid(vSchema.addgrate),
  isAuth([roles.admin]),
  gc.uploadgrate,
  sgc.addTosemster
);
// =============================================================

// تحديث الدرجة الادمن          ======>   EDIT_R
router.put(
  `${studentGrades.updateGradeByAdmin}`,
  valid(vSchema.updatecoursegrate),
  isAuth([roles.instructor, roles.admin]),
  gc.updategrate,
  sgc.updateSemsterGrate
);

// تحديث الدرجة الادكتور          ======>   EDIT_R
router.put(
  `${studentGrades.updateGradeByInstructor}`,
  valid(vSchema.updatecoursegrateInstructor),
  isAuth([roles.instructor]),
  gc.updategrate,
  sgc.updateSemsterGrate
);
// =============================================================

// حذف الدرجة الادمن                  ======>   EDIT_R
router.delete(
  `${studentGrades.deleteGradeByAdmin}`,
  valid(vSchema.deletecoursegrate),
  isAuth([roles.admin]),
  gc.deletecoursegrate,
  sgc.deleteSemsterGrate
);

// حذف الدرجة الدكتور            ======>   EDIT_R
router.delete(
  `${studentGrades.deleteGradeByInstructor}`,
  valid(vSchema.deletecoursegrate),
  isAuth([roles.instructor]),
  gc.deletecoursegrate,
  sgc.deleteSemsterGrate
);

//==================================================================

// Admin  students Grates Search ======>   EDIT_R
router.get(
  `${studentGrades.studentsGradesSearchByAdmin}`,
  valid(vSchema.studentsGratesSearch),
  isAuth([roles.admin]),
  gc.studentsGratesSearch
);

// instructor  students Grates Search ======>   EDIT_R
router.get(
  `${studentGrades.studentsGradesSearchByInstructor}`,
  valid(vSchema.studentsGratesSearchInstructor),
  isAuth([roles.instructor]),
  gc.studentsGratesSearch
);
// ========================================================

// Admin  grade Single user ======>   EDIT_R
router.get(
  `${studentGrades.GetSingleGradeAboutUserByAdmin}`,
  valid(vSchema.gradeSingleuser),
  isAuth([roles.admin]),
  gc.gradeSingleuser
);

// instructor  grade Single user ======>   EDIT_R
router.get(
  `${studentGrades.GetSingleGradeAboutUserByInstructor}`,
  valid(vSchema.gradeSingleuser),
  isAuth([roles.instructor]),
  gc.gradeSingleuser
);
// ================================================================================

// صحيفة الطالب التفصيلية  to student  ======>   EDIT_R
router.get(
  `${studentGrades.NewspaperBystudent}`,
  isAuth([roles.stu]),
  gc.stugrades
);

// صحيفة الطالب التفصيلية  to Admin  ======>   EDIT_R
router.get(
  `${studentGrades.NewspaperByAdmin}`,
  valid(vSchema.stugrades),
  isAuth([roles.admin]),
  gc.stugrades
);

// =========================================================================
//  student Main semster Grate
router.get(
  `${studentGrades.GetMainsemsterGrade}`,
  isAuth([roles.stu]),
  gc.MainsemsterGrate
);

export default router;
