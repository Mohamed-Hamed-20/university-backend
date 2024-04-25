import { Router } from "express";
import * as ac from "../controllers/admin/admin.js";
import * as uc from "../controllers/user/user.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/admin/admin.valid.js";
import { isAuth, roles } from "../middleware/auth.js";
import { allowedExtensions, multerCloud } from "../utils/aws.s3.js";
import { limiter } from "../utils/apply.security.js";
import { routes } from "../utils/routes.path.js";
const router = Router();
const { Admin } = routes;

//login admin SuperAdmins
router.post(
  `${Admin.login}`,
  limiter({ limit: 10, Mintute: 15 }),
  valid(vSchema.login),
  ac.login
);

// confirm Emial for Admin
router.get(
  `${Admin.confirmEmail}`,
  valid(vSchema.SendconfirmEmailValid),
  limiter({ limit: 10, Mintute: 60 * 12 }),
  ac.SendconfirmEmail
);

// check confirm email
router.get(
  `${Admin.checkConfirmEmail}/:key`,
  valid(vSchema.checkConfirmEmail),
  limiter({ limit: 36, Mintute: 60 * 12 }),
  ac.checkConfirmEmail
);

// ==============================================================================
router.get(
  `${Admin.getinfoAdmin}`,
  limiter({ limit: 40, Mintute: 60 }),
  isAuth([roles.admin]),
  ac.Getuser
);
router.get(
  `${Admin.getinfoSuper}`,
  limiter({ limit: 40, Mintute: 60 }),
  isAuth([roles.super]),
  ac.Getuser
);
// ==================================================================

//create admin

router.post(
  `${Admin.createAdmin}`,
  limiter({ limit: 100, Mintute: 60 }),
  valid(vSchema.CreateAdmin),
  isAuth([roles.super]),
  ac.CreateAdmin
);

router.put(
  `${Admin.updateAdmin}`,
  limiter({ limit: 100, Mintute: 60 }),
  valid(vSchema.updateAdmin),
  isAuth([roles.super]),
  ac.updateAdmin
);

router.delete(
  `${Admin.deleteAdmin}`,
  limiter({ limit: 100, Mintute: 60 }),
  valid(vSchema.deleteAdmin),
  isAuth([roles.super]),
  ac.deleteAdmin
);

router.get(
  `${Admin.searchAdmin}`,
  limiter({ limit: 40, Mintute: 60 }),
  valid(vSchema.searchAdmin),
  isAuth([roles.super]),
  ac.searchAdmin
);

//=================================================================================================
//upload one or more image
router.post(
  `${Admin.AddImgBySuper}`,
  limiter({ limit: 15, Mintute: 30 }),
  multerCloud(allowedExtensions.Image).single("adminImage"),
  valid(vSchema.AddAdminImg),
  isAuth([roles.super]),
  ac.AddAdminImg
);

//   EDIT_R     admin
router.post(
  `${Admin.AddImgByAdmin}`,
  limiter({ limit: 15, Mintute: 12 * 60 }),
  multerCloud(allowedExtensions.Image).single("adminImage"),
  isAuth([roles.admin]),
  ac.AddAdminImg
);

//   EDIT_R     admin
router.patch(
  `${Admin.deleteImgByAdmin}`,
  limiter({ limit: 5, Mintute: 30 }),
  isAuth([roles.admin]),
  ac.deleteAdminImg
);

// by super
router.patch(
  `${Admin.deleteImgBysuper}`,
  limiter({ limit: 50, Mintute: 60 }),
  valid(vSchema.deleteAdminImg),
  isAuth([roles.super]),
  ac.deleteAdminImg
);

router.get(
  `${Admin.dashboardAdmin}`,
  limiter({ limit: 40, Mintute: 60 }),
  isAuth([roles.admin]),
  ac.dashboard
);

router.get(`${Admin.logout}`, isAuth([roles.admin, roles.super]), uc.logout);
export default router;
