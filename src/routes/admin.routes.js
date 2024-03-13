import { Router } from "express";
import * as ac from "../controllers/admin/admin.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/admin/admin.valid.js";
import { isAuth, roles } from "../middleware/auth.js";
const router = Router();

//login admin SuperAdmins
router.post("/login", valid(vSchema.login), ac.login);
router.get("/getinfo", isAuth([roles.admin, roles.super]), ac.Getuser);

// ==================================================================

//create admin
router.post(
  "/create",
  valid(vSchema.CreateAdmin),
  isAuth([roles.super]),
  ac.CreateAdmin
);

router.put(
  "/update",
  valid(vSchema.updateAdmin),
  isAuth([roles.super]),
  ac.updateAdmin
);

router.delete(
  "/delete",
  valid(vSchema.deleteAdmin),
  isAuth([roles.super]),
  ac.deleteAdmin
);

router.get(
  "/search",
  valid(vSchema.searchAdmin),
  isAuth([roles.super]),
  ac.searchAdmin
);
// router.patch(
//   "/updateRole",
//   valid(vSchema.updaterole),
//   isAuth([roles.super]),
//   ac.updaterole
// );

router.get("/info", isAuth([roles.admin]), ac.info);
export default router;
