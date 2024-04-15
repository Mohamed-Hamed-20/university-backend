import { Router } from "express";
import * as sc from "../controllers/semster/semster.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/semster/semster.valid.js";
import { isAuth, roles } from "../middleware/auth.js";
import { routes } from "../utils/routes.path.js";
const router = Router();

//user routes
const { semster } = routes;
// router.post("/login", valid(vSchema.login), uc.login);

router.post(
  `${semster.addsemster}`,
  isAuth([roles.admin]),
  valid(vSchema.addsemster),
  sc.addsemster
);

router.put(
  `${semster.updatesemster}`,
  isAuth([roles.admin]),
  valid(vSchema.updatesemster),
  sc.updatesemster
);

router.delete(
  `${semster.deletesemster}`,
  isAuth([roles.admin]),
  valid(vSchema.deletesemster),
  sc.deletesemster
);
// ==============================================================

router.get(
  `${semster.searchsemster}`,
  valid(vSchema.searchsemster),
  isAuth([roles.admin]),
  sc.searchsemster
);

// =========================================================================

//EDIT_R    student
router.get(
  `${semster.MainSemsterInfoBystudent}`,
  isAuth([roles.stu]),
  sc.MainSemsterInfo
);

//EDIT_R  admin
router.get(
  `${semster.MainSemsterInfoByAdmin}`,
  isAuth([roles.admin]),
  sc.MainSemsterInfo
);

// EDIT_R  instructor
router.get(
  `${semster.MainSemsterInfoByInstructor}`,
  isAuth([roles.instructor]),
  sc.MainSemsterInfo
);

// ===================================================================

export default router;
