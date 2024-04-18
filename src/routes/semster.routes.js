import { Router } from "express";
import * as sc from "../controllers/semster/semster.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/semster/semster.valid.js";
import { isAuth, roles } from "../middleware/auth.js";
import { limiter } from "../utils/apply.security.js";
import { routes } from "../utils/routes.path.js";
const router = Router();

//user routes
const { semster } = routes;
// router.post("/login", valid(vSchema.login), uc.login);

router.post(
  `${semster.addsemster}`,
  limiter({limit:40,Mintute:60}),
  isAuth([roles.admin]),
  valid(vSchema.addsemster),
  sc.addsemster
);

router.put(
  `${semster.updatesemster}`,
  limiter({limit:20,Mintute:60}),
  isAuth([roles.admin]),
  valid(vSchema.updatesemster),
  sc.updatesemster
);

router.delete(
  `${semster.deletesemster}`,
  limiter({limit:20,Mintute:60}),
  isAuth([roles.admin]),
  valid(vSchema.deletesemster),
  sc.deletesemster
);
// ==============================================================

router.get(
  `${semster.searchsemster}`,
  limiter({limit:50,Mintute:60}),
  valid(vSchema.searchsemster),
  isAuth([roles.admin]),
  sc.searchsemster
);

// =========================================================================

//EDIT_R    student
router.get(
  `${semster.MainSemsterInfoBystudent}`,
  limiter({limit:30,Mintute:60}),
  isAuth([roles.stu]),
  sc.MainSemsterInfo
);

//EDIT_R  admin
router.get(
  `${semster.MainSemsterInfoByAdmin}`,
  limiter({limit:50,Mintute:60}),
  isAuth([roles.admin]),
  sc.MainSemsterInfo
);

// EDIT_R  instructor
router.get(
  `${semster.MainSemsterInfoByInstructor}`,
  limiter({limit:50,Mintute:60}),
  isAuth([roles.instructor]),
  sc.MainSemsterInfo
);

// ===================================================================

export default router;
