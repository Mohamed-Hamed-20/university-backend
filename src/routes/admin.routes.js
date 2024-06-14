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
  limiter({ limit: 10, Mintute: 10 }),
  valid(vSchema.login),
  ac.login
);

// confirm Email for Admin
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

// Get Information to Admin && super
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

// create admin
router.post(
  `${Admin.createAdmin}`,
  limiter({ limit: 8, Mintute: 60 }),
  valid(vSchema.CreateAdmin),
  isAuth([roles.super]),
  ac.CreateAdmin
);

// update admin
router.put(
  `${Admin.updateAdmin}`,
  limiter({ limit: 12, Mintute: 60 }),
  valid(vSchema.updateAdmin),
  isAuth([roles.super]),
  ac.updateAdmin
);

// delete admin
router.delete(
  `${Admin.deleteAdmin}`,
  limiter({ limit: 8, Mintute: 60 }),
  valid(vSchema.deleteAdmin),
  isAuth([roles.super]),
  ac.deleteAdmin
);

// search for admins
router.get(
  `${Admin.searchAdmin}`,
  limiter({ limit: 40, Mintute: 60 }),
  valid(vSchema.searchAdmin),
  isAuth([roles.super]),
  ac.searchAdmin
);

//upload Image to admin By super
router.post(
  `${Admin.AddImgBySuper}`,
  limiter({ limit: 15, Mintute: 30 }),
  multerCloud(allowedExtensions.Image).single("adminImage"),
  valid(vSchema.AddAdminImg),
  isAuth([roles.super]),
  ac.AddAdminImg
);

//upload Image to admin By admin
router.post(
  `${Admin.AddImgByAdmin}`,
  limiter({ limit: 15, Mintute: 12 * 60 }),
  multerCloud(allowedExtensions.Image).single("adminImage"),
  isAuth([roles.admin]),
  ac.AddAdminImg
);

//delete Image to admin By Admin
router.patch(
  `${Admin.deleteImgByAdmin}`,
  limiter({ limit: 5, Mintute: 30 }),
  // valid(vSchema.deleteAdminImgByAdmin),
  isAuth([roles.admin]),
  ac.deleteAdminImg
);

//delete Image to admin By super
router.patch(
  `${Admin.deleteImgBysuper}`,
  limiter({ limit: 50, Mintute: 60 }),
  valid(vSchema.deleteAdminImg),
  isAuth([roles.super]),
  ac.deleteAdminImg
);

// dashboard for admins
router.get(
  `${Admin.dashboardAdmin}`,
  limiter({ limit: 40, Mintute: 60 }),
  isAuth([roles.admin]),
  ac.dashboard
);

// make logout by admin && super
router.get(`${Admin.logout}`, isAuth([roles.admin, roles.super]), uc.logout);

export default router;
