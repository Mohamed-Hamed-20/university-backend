import { Router } from "express";
import * as sc from "../controllers/semster/semster.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/semster/semster.valid.js";
import { isAuth, roles } from "../middleware/auth.js";
const router = Router();

//user routes

// router.post("/login", valid(vSchema.login), uc.login);

router.post(
  "/addsemster",
  isAuth([roles.admin, roles.super]),
  valid(vSchema.addsemster),
  sc.addsemster
);
router.put(
  "/updatesemster",
  isAuth([roles.admin, roles.super]),
  valid(vSchema.updatesemster),
  sc.updatesemster
);
router.delete(
  "/deletesemster",
  isAuth([roles.admin, roles.super]),
  valid(vSchema.deletesemster),
  sc.deletesemster
);
router.get(
  "/searchsemster",
  isAuth([roles.admin, roles.instructor, roles.super]),
  sc.searchsemster
);
router.get(
  "/MainSemsterInfo",
  isAuth(roles.admin, roles.instructor, roles.stu, roles.super),
  sc.MainSemsterInfo
);
router.get(
  "/FindSemster",
  isAuth([roles.admin, roles.super, roles.instructor]),
  valid(vSchema.FindSemster),
  sc.FindSemster
);
// missed login with Gmail   <<<<=====
export default router;
